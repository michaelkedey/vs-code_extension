"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const node_1 = require("vscode-languageclient/node");
class UddlHoverProvider {
    provideHover(document, position, token) {
        const word = document.getText(document.getWordRangeAtPosition(position));
        const hoverText = new vscode.MarkdownString(`Hover information for ${word}`);
        return new vscode.Hover(hoverText);
    }
}
function activate(context) {
    const serverModule = context.asAbsolutePath('path/to/UDDLServer.js');
    // Debug options for the server
    const debugOptions = {
        execArgv: ['--nolazy', '--inspect=6009'],
    };
    // Server options
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: { module: serverModule, transport: node_1.TransportKind.ipc, options: debugOptions },
    };
    // Client options
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'uddl' }],
        synchronize: {
            configurationSection: 'uddlServer',
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.uddl'),
        },
    };
    // Create and start the language client
    const languageClient = new node_1.LanguageClient('uddlServer', 'uddl Server', serverOptions, clientOptions);
    // Register hover provider and store disposables
    const disposables = [];
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
exports.activate = activate;
function deactivate() {
    // Deactivation code here
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map