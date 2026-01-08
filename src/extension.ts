import * as vscode from "vscode";
import { scanALFiles } from "./core/fileScanner";
import { detectObjectType } from "./core/objectTypeDetector";
import { planMoves, executeMoves } from "./core/fileMover";
import type { ObjectType } from "./types";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("alOrganizer.organizeProject", async () => {
    const root = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!root) {
      vscode.window.showErrorMessage("No workspace open. Please open your AL project.");
      return;
    }

    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Organizing AL project structure...",
      cancellable: false,
    }, async (progress) => {
      progress.report({ message: "Scanning files" });
      const files = await scanALFiles();
      if (files.length === 0) {
        vscode.window.showInformationMessage("No AL files found inside src.");
        return;
      }

      progress.report({ message: "Detecting object types" });
      const detections: (ObjectType | null)[] = await Promise.all(files.map(async (f) => {
        const res = await detectObjectType(f);
        return res.type;
      }));

      progress.report({ message: "Planning moves" });
      const { plan, alreadyPlaced } = planMoves(root, files, detections);

      progress.report({ message: "Moving files" });
      const result = await executeMoves(plan);
      const unknownCount = detections.filter((t) => !t).length;
      const totalSkipped = result.skipped + alreadyPlaced + unknownCount;

      vscode.window.showInformationMessage(
        `AL Organization complete: ${result.moved} moved, ${totalSkipped} skipped (${unknownCount} unknown, ${alreadyPlaced} already placed).`
      );
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
