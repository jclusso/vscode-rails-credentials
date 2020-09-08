// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.railsCredentials', function () {

		let fileName = vscode.window.activeTextEditor.document.fileName

		let match = /\/(.[^.\/]+)\.yml\.enc/.exec(fileName)
		let env = match[1]
		if (!env) {
			vscode.window.showInformationMessage(`Error: Can only open files that end with .yml.enc`)
			return
		}

		let config = vscode.workspace.getConfiguration('railsCredentials')

		let message = 'Opening credentials'
		if (env != 'credentials') { message = `Opening credentials for ${env}` }
		vscode.window.showInformationMessage(message)

		let terminal = vscode.window.createTerminal('credentials-terminal')
		let envString = ''

		// if you don't have this you can never open the default credentials file.
		if (env != 'credentials') { envString = `--environment ${env}` }

		let editorCommand = ''
		if (config.openIn == 'railsCredentials.existingWindow') {
			editorCommand = 'code -r --wait'
		} else {
			editorCommand = 'code -n --wait'
		}

		terminal.sendText(`env EDITOR="${editorCommand}" ${config.command} ${envString}`)
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
