"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaCompletionProvider = void 0;
const vscode_1 = require("vscode");
class OllamaCompletionProvider {
    constructor(ollama) {
        this.ollama = ollama;
    }
    async provideInlineCompletionItems(document, position) {
        const textBeforeCursor = document.getText(new vscode_1.Range(new vscode_1.Position(0, 0), position));
        try {
            const model = vscode_1.workspace.getConfiguration('ollama').get('defaultModel') || 'codellama';
            const completion = await this.ollama.generateCompletion(`Complete this ${document.languageId} code:\n\n${textBeforeCursor}`, model);
            return [new vscode_1.InlineCompletionItem(completion)];
        }
        catch (error) {
            return [];
        }
    }
}
exports.OllamaCompletionProvider = OllamaCompletionProvider;
//# sourceMappingURL=inlineCompletionProvider.js.map