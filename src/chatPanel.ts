import { WebviewPanel, window, ViewColumn, workspace } from 'vscode';
import { OllamaService } from './ollamaService';

export class ChatPanel {
  private panel: WebviewPanel;
  private chatHistory: any[] = [];

  constructor(private ollama: OllamaService) {
    this.panel = window.createWebviewPanel(
      'ollamaChat',
      'Ollama Chat',
      ViewColumn.Beside,
      { enableScripts: true }
    );

    this.setupWebview();
    this.updateChatView();
  }

  private setupWebview() {
    this.panel.webview.html = this.getWebviewContent();
    
    this.panel.webview.onDidReceiveMessage(async message => {
      if (message.type === 'message' && message.content.trim()) {
        try {
          this.chatHistory.push({ role: 'user', content: message.content });
          this.updateChatView();

          const model = workspace.getConfiguration('ollama').get<string>('defaultModel') || 'codellama';
          const response = await this.ollama.chatCompletion(
            [...this.chatHistory],
            model
          );

          this.chatHistory.push({ role: 'assistant', content: response });
          this.updateChatView();
        } catch (error) {
          window.showErrorMessage(`Erreur de chat: ${error instanceof Error ? error.message : error}`);
        }
      }
    });
  }

  private updateChatView() {
    this.panel.webview.postMessage({
      type: 'update',
      history: this.chatHistory
    });
  }

  private getWebviewContent() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { padding: 10px; font-family: sans-serif; }
          .message { margin: 10px 0; padding: 8px; border-radius: 5px; }
          .user { background: #e3f2fd; }
          .assistant { background: #f5f5f5; }
          #input { width: 80%; padding: 8px; }
          button { padding: 8px 16px; }
          #messages { height: 80vh; overflow-y: auto; }
        </style>
      </head>
      <body>
        <div id="messages"></div>
        <input id="input" placeholder="Tapez votre message...">
        <button onclick="sendMessage()">Envoyer</button>

        <script>
          const vscode = acquireVsCodeApi();
          const messages = document.getElementById('messages');
          const input = document.getElementById('input');

          function sendMessage() {
            const content = input.value.trim();
            if (content) {
              vscode.postMessage({ type: 'message', content });
            }
            input.value = '';
          }

          window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'update') {
              messages.innerHTML = message.history.map(msg => \`
                <div class="message \${msg.role}">
                  <strong>\${msg.role === 'user' ? 'Vous' : 'Assistant'} :</strong> 
                  \${msg.content.replace(/\n/g, '<br>')}
                </div>
              \`).join('');
              messages.scrollTop = messages.scrollHeight;
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}
