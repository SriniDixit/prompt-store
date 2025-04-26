# Search Prompts

A VS Code extension that provides a chat participant for searching and using pre-defined prompts in VS Code's built-in chat interface.

## Features

- Search through a collection of pre-defined prompts using keywords
- Access prompts directly from VS Code's chat interface
- Interactive prompt selection through a quick-pick dropdown
- Smart keyword-based search functionality
- Built-in prompt templates for common tasks like code review and refactoring

## Usage

1. Open VS Code's chat interface (Ctrl+Shift+P or Cmd+Shift+P, then type "Chat")
2. Type "@prompts" followed by your search terms
3. Select from the matching prompts in the dropdown
4. The selected prompt will be used to enhance your chat interaction

### Example Prompts

The extension comes with built-in prompts for:

- **Code Review**: Analyzes code for best practices, potential bugs, performance issues, and security concerns
- **Code Refactoring**: Suggests improvements focusing on code organization, design patterns, maintainability, and readability

## Requirements

- VS Code version 1.99.0 or higher

## Extension Settings

This extension contributes a chat participant with the following attributes:

- Name: `prompts`
- Full Name: `Prompt Search`
- Description: Search and use prompts

## Development

### Building the Extension

1. Clone the repository
2. Run `npm install` to install dependencies
3. Press F5 to start debugging

### Available Scripts

- `npm run compile` - Compile the extension
- `npm run watch` - Compile the extension in watch mode
- `npm run package` - Package the extension for distribution
- `npm run test` - Run the test suite
- `npm run lint` - Lint the code

## License

[Include your license information here]

## Contributing

[Include contribution guidelines here]