import * as vscode from "vscode";

export async function scanALFiles(): Promise<vscode.Uri[]> {
  // Fast file discovery using VS Code API
  // Only inside src; avoid touching outside
  const pattern = new vscode.RelativePattern(vscode.workspace.workspaceFolders?.[0]!, "src/**/*.al");
  const files = await vscode.workspace.findFiles(pattern, "**/node_modules/**");
  return files;
}
