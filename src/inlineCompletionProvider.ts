import { 
  InlineCompletionItem, 
  InlineCompletionItemProvider, 
  TextDocument, 
  Position, 
  Range, 
  workspace 
} from 'vscode';
import { OllamaService } from './ollamaService';

export class OllamaCompletionProvider implements InlineCompletionItemProvider {
  constructor(private ollama: OllamaService) {}

  async provideInlineCompletionItems(document: TextDocument, position: Position) {
    const textBeforeCursor = document.getText(
      new Range(new Position(0, 0), position)
    );

    try {
      const model = workspace.getConfiguration('ollama').get<string>('defaultModel') || 'codellama';
      const completion = await this.ollama.generateCompletion(
        `Complete this ${document.languageId} code:\n\n${textBeforeCursor}`,
        model
      );

      return [new InlineCompletionItem(completion)];
    } catch (error) {
      return [];
    }
  }
}
