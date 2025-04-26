import * as vscode from 'vscode';

interface Prompt {
    id: string;
    title: string;
    description: string;
    content: string;
    keywords: string[];
}

// Sample prompt store - in a real application, this could be loaded from a JSON file
const promptStore: Prompt[] = [
    {
        id: 'code-review',
        title: 'Code Review',
        description: 'Review code for best practices and potential issues',
        content: 'You are a code review expert. Analyze the following code for: 1) Best practices 2) Potential bugs 3) Performance issues 4) Security concerns. Provide specific, actionable feedback.',
        keywords: ['review', 'code', 'analysis', 'bugs', 'security']
    },
    {
        id: 'refactor',
        title: 'Code Refactoring',
        description: 'Suggest code refactoring improvements',
        content: 'You are a refactoring expert. Analyze the code and suggest improvements focusing on: 1) Code organization 2) Design patterns 3) Maintainability 4) Readability. Provide specific refactoring suggestions with examples.',
        keywords: ['refactor', 'improve', 'clean code', 'design patterns']
    }
];

// Function to search prompts based on keywords
async function searchPrompts(query: string): Promise<Prompt[]> {
    const searchTerms = query.toLowerCase().split(' ');
    
    return promptStore.filter(prompt => {
        // Pre-process the searchable text for this prompt
        const searchableText = [
            ...prompt.keywords.map(k => k.toLowerCase()),
            prompt.title.toLowerCase(),
            prompt.description.toLowerCase()
        ].join(' ');
        
        // Check if any search term exists in the searchable text
        return searchTerms.some(term => searchableText.includes(term));
    });
}

// Function to show prompt selection dropdown
async function showPromptPicker(matches: Prompt[]): Promise<Prompt | undefined> {
    const items = matches.map(prompt => ({
        label: prompt.title,
        description: prompt.description,
        prompt: prompt
    }));

    const selection = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a prompt to use'
    });

    return selection?.prompt;
}

export function activate(context: vscode.ExtensionContext) {
	// Define the chat handler
	const handler: vscode.ChatRequestHandler = async (
		request: vscode.ChatRequest, 
		_context: vscode.ChatContext, 
		stream: vscode.ChatResponseStream, 
		token: vscode.CancellationToken
	) => {
		try {
			// Show progress indication
			stream.progress('Searching prompts...');

			// Search for matching prompts
			const matches = await searchPrompts(request.prompt);
			
			if (matches.length === 0) {
				stream.markdown('No matching prompts found. Please try different search terms.');
				return;
			}

			// Show prompt picker and get selection
			const selectedPrompt = await showPromptPicker(matches);
			
			if (!selectedPrompt) {
				stream.markdown('No prompt selected.');
				return;
			}

			// Initialize messages array with the selected prompt
			const messages = [
				vscode.LanguageModelChatMessage.User(selectedPrompt.content)
			];

			// Add user's current message
			messages.push(vscode.LanguageModelChatMessage.User(request.prompt));

			try {
				// Send request to the model
				const chatResponse = await request.model.sendRequest(messages, {}, token);

				// Stream the response
				for await (const fragment of chatResponse.text) {
					if (token.isCancellationRequested) {
						stream.markdown('*Request cancelled*');
						return;
					}
					stream.markdown(fragment);
				}
			} catch (modelError) {
				stream.markdown('❌ *Failed to get response from the language model*');
				console.error('Model error:', modelError);
				return;
			}
		} catch (error) {
			stream.markdown('❌ *An unexpected error occurred*');
			console.error('Handler error:', error);
			return;
		}
	};

	// Create and register the chat participant
	const promptSearch = vscode.chat.createChatParticipant('search-prompts.participant', handler);
	
	// Optional: Add an icon to the participant
	promptSearch.iconPath = new vscode.ThemeIcon('search');
	
	context.subscriptions.push(promptSearch);
}

export function deactivate() {}
