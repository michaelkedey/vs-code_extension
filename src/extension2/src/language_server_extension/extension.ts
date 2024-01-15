import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

class UddlHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const word = document.getText(document.getWordRangeAtPosition(position));
    const hoverText = new vscode.MarkdownString(`Hover information for ${word}`);
    return new vscode.Hover(hoverText);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const serverModule = context.asAbsolutePath('path/to/UDDLServer.js');

  // Debug options for the server
  const debugOptions = {
    execArgv: ['--nolazy', '--inspect=6009'],
  };

  // Server options
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
  };

  // Client options
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'uddl' }],
    synchronize: {
      configurationSection: 'uddlServer',
      fileEvents: vscode.workspace.createFileSystemWatcher('**/*.uddl'),
    },
  };

  // Create and start the language client
  const languageClient = new LanguageClient(
    'uddlServer',
    'uddl Server',
    serverOptions,
    clientOptions
  );

  // Register hover provider and store disposables
  const disposables: vscode.Disposable[] = [];
  disposables.push(vscode.languages.registerHoverProvider('uddl', new UddlHoverProvider()));




// Start the language client and add its start function to disposables
disposables.push({
  dispose: async () => {
    await languageClient.stop();
  },
});

// Start the language client
languageClient.start();

// Add disposables to the context subscriptions
disposables.forEach((d) => context.subscriptions.push(d));
}

export function deactivate() {
// Deactivation code here
}

