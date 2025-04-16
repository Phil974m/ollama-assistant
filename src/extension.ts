import { 
  ExtensionContext, 
  commands, 
  window, 
  workspace, 
  languages, 
  StatusBarAlignment 
} from 'vscode';
import { OllamaService } from './ollamaService';
import { OllamaCompletionProvider } from './inlineCompletionProvider';
import { ChatPanel } from './chatPanel';

export function activate(context: ExtensionContext) {
  const ollama = new OllamaService();
  const statusBar = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  
  const updateStatusBar = () => {
    const model = workspace.getConfiguration('ollama').get<string>('defaultModel') || 'codellama';
    statusBar.text = `$(code) Ollama: ${model}`;
    statusBar.tooltip = 'Cliquer pour changer de modèle';
    statusBar.show();
  };

  updateStatusBar();

  const provider = new OllamaCompletionProvider(ollama);
  context.subscriptions.push(
    languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider)
  );

  context.subscriptions.push(
    commands.registerCommand('ollama.generateCode', async () => {
      const prompt = await window.showInputBox({ 
        prompt: 'Entrez votre demande de code',
        placeHolder: 'Ex: Crée une fonction React pour un bouton cliquable'
      });
      
      if (!prompt) return;

      try {
        const editor = window.activeTextEditor;
        const model = workspace.getConfiguration('ollama').get<string>('defaultModel') || 'codellama';
        
        if (editor) {
          const code = await ollama.generateCompletion(
            `Langage: ${editor.document.languageId}\nContexte: ${prompt}`,
            model
          );
          
          await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, code);
          });
        }
      } catch (error) {
        window.showErrorMessage(`Erreur Ollama: ${error instanceof Error ? error.message : error}`);
      }
    }),

    commands.registerCommand('ollama.openChat', () => {
      new ChatPanel(ollama);
    }),

    commands.registerCommand('ollama.changeModel', async () => {
      const models = await ollama.listModels();
      const selected = await window.showQuickPick(models, {
        placeHolder: 'Sélectionnez un modèle Ollama'
      });
      
      if (selected) {
        await workspace.getConfiguration('ollama').update('defaultModel', selected, true);
        window.showInformationMessage(`Modèle changé pour: ${selected}`);
      }
    })
  );

  workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('ollama')) {
      updateStatusBar();
    }
  });

  statusBar.command = 'ollama.changeModel';
  context.subscriptions.push(statusBar);
}

export function deactivate() {}
