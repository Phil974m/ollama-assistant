import { workspace, window } from 'vscode';

export class OllamaService {
  private get endpoint() {
    return workspace.getConfiguration('ollama').get<string>('endpoint') || 'http://localhost:11434';
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`);
      const data = await response.json();
      return data.models.map((m: any) => m.name);
    } catch (error) {
      window.showErrorMessage('Impossible de récupérer les modèles Ollama');
      return [];
    }
  }

  async generateCompletion(prompt: string, model: string): Promise<string> {
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

      if (!response.ok) throw new Error(await response.text());
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      throw new Error(`Échec de génération : ${error instanceof Error ? error.message : error}`);
    }
  }

  async chatCompletion(messages: any[], model: string): Promise<string> {
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

      if (!response.ok) throw new Error(await response.text());
      
      const data = await response.json();
      return data.message.content;
    } catch (error) {
      throw new Error(`Échec du chat : ${error instanceof Error ? error.message : error}`);
    }
  }
}
