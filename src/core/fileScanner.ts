import * as vscode from "vscode";

export async function scanALFiles(): Promise<vscode.Uri[]> {
  // Fast file discovery using VS Code API
  // Scan the entire workspace; we'll organize into src
  const pattern = new vscode.RelativePattern(vscode.workspace.workspaceFolders?.[0]!, "**/*.al");
  const files = await vscode.workspace.findFiles(pattern, "**/node_modules/**");
  return files;
}
