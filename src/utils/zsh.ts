import * as vscode from 'vscode';


export function executeZshCommand(command: string) {
  // 1. Create a new terminal instance with a specific name.
  const terminal = vscode.window.createTerminal({ name: "My Zsh Command Runner" });

  // 2. Show the terminal in the UI.
  terminal.show();

  // 3. Send the command text to the terminal and press Enter.
  // The integrated terminal will use the user's default shell (which would be Zsh on macOS by default).
  terminal.sendText(command);
}