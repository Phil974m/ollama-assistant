"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const vscode_1 = require("vscode");
class OllamaService {
    get endpoint() {
        return vscode_1.workspace.getConfiguration('ollama').get('endpoint') || 'http://localhost:11434';
    }
    async listModels() {
        try {
            const response = await fetch(`${this.endpoint}/api/tags`);
            const data = await response.json();
            return data.models.map((m) => m.name);
        }
        catch (error) {
            vscode_1.window.showErrorMessage('Impossible de récupérer les modèles Ollama');
            return [];
        }
    }
    async generateCompletion(prompt, model) {
        try {
            const response = await fetch(`${this.endpoint}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    prompt,
                    stream: false,
                    options: { temperature: 0.7 }
                })
            });
            if (!response.ok)
                throw new Error(await response.text());
            const data = await response.json();
            return data.response;
        }
        catch (error) {
            throw new Error(`Échec de génération : ${error instanceof Error ? error.message : error}`);
        }
    }
    async chatCompletion(messages, model) {
        try {
            const response = await fetch(`${this.endpoint}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    messages,
                    stream: false
                })
            });
            if (!response.ok)
                throw new Error(await response.text());
            const data = await response.json();
            return data.message.content;
        }
        catch (error) {
            throw new Error(`Échec du chat : ${error instanceof Error ? error.message : error}`);
        }
    }
}
exports.OllamaService = OllamaService;
//# sourceMappingURL=ollamaService.js.map