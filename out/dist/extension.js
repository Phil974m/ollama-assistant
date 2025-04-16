"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode_1 = require("vscode");
const ollamaService_1 = require("./ollamaService");
const inlineCompletionProvider_1 = require("./inlineCompletionProvider");
const chatPanel_1 = require("./chatPanel");
function activate(context) {
    const ollama = new ollamaService_1.OllamaService();
    const statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
    const updateStatusBar = () => {
        const model = vscode_1.workspace.getConfiguration('ollama').get('defaultModel') || 'codellama';
        statusBar.text = `$(code) Ollama: ${model}`;
        statusBar.tooltip = 'Cliquer pour changer de modèle';
        statusBar.show();
    };
    updateStatusBar();
    const provider = new inlineCompletionProvider_1.OllamaCompletionProvider(ollama);
    context.subscriptions.push(vscode_1.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider));
    context.subscriptions.push(vscode_1.commands.registerCommand('ollama.generateCode', async () => {
        const prompt = await vscode_1.window.showInputBox({
            prompt: 'Entrez votre demande de code',
            placeHolder: 'Ex: Crée une fonction React pour un bouton cliquable'
        });
        if (!prompt)
            return;
        try {
            const editor = vscode_1.window.activeTextEditor;
            const model = vscode_1.workspace.getConfiguration('ollama').get('defaultModel') || 'codellama';
            if (editor) {
                const code = await ollama.generateCompletion(`Langage: ${editor.document.languageId}\nContexte: ${prompt}`, model);
                await editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, code);
                });
            }
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Erreur Ollama: ${error instanceof Error ? error.message : error}`);
        }
    }), vscode_1.commands.registerCommand('ollama.openChat', () => {
        new chatPanel_1.ChatPanel(ollama);
    }), vscode_1.commands.registerCommand('ollama.changeModel', async () => {
        const models = await ollama.listModels();
        const selected = await vscode_1.window.showQuickPick(models, {
            placeHolder: 'Sélectionnez un modèle Ollama'
        });
        if (selected) {
            await vscode_1.workspace.getConfiguration('ollama').update('defaultModel', selected, true);
            vscode_1.window.showInformationMessage(`Modèle changé pour: ${selected}`);
        }
    }));
    vscode_1.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('ollama')) {
            updateStatusBar();
        }
    });
    statusBar.command = 'ollama.changeModel';
    context.subscriptions.push(statusBar);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map