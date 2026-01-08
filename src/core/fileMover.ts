import * as vscode from "vscode";
import { mapTypeToFolder, ensureSrcOnly } from "./folderMapper";
import type { MovePlanItem, ObjectType } from "../types";

async function fileExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

async function uniqueTarget(target: vscode.Uri): Promise<vscode.Uri> {
  if (!(await fileExists(target))) return target;
  const base = target.path.replace(/\.al$/i, "");
  let idx = 1;
  while (true) {
    const candidate = target.with({ path: `${base}.${idx}.al` });
    if (!(await fileExists(candidate))) return candidate;
    idx++;
  }
}

export function planMoves(
  root: vscode.Uri,
  files: vscode.Uri[],
  types: (ObjectType | null)[]
): { plan: MovePlanItem[]; alreadyPlaced: number } {
  const plan: MovePlanItem[] = [];
  let alreadyPlaced = 0;
  for (let i = 0; i < files.length; i++) {
    const type = types[i];
    const source = files[i];
    if (!type) continue; // unknown type -> skip moving
    const targetDir = mapTypeToFolder(root, type);
    const targetFile = vscode.Uri.joinPath(targetDir, source.path.split("/").pop()!);
    if (!ensureSrcOnly(targetDir, root)) continue;

    // Skip if file is already in the target directory
    const sourceDirStr = source.with({ path: source.path.substring(0, source.path.lastIndexOf("/")) }).toString();
    if (sourceDirStr.toLowerCase() === targetDir.toString().toLowerCase()) {
      alreadyPlaced++;
      continue;
    }

    plan.push({ source, targetDir, targetFile });
  }
  return { plan, alreadyPlaced };
}

export async function executeMoves(plan: MovePlanItem[]): Promise<{ moved: number; skipped: number; errors: number; }>{
  let moved = 0, skipped = 0, errors = 0;
  const uniqueDirs = new Map<string, vscode.Uri>();
  for (const item of plan) uniqueDirs.set(item.targetDir.toString(), item.targetDir);

  // Create target directories first (batched)
  await Promise.all(Array.from(uniqueDirs.values()).map(dir =>
    vscode.workspace.fs.createDirectory(dir).then(
      () => undefined,
      () => undefined
    )
  ));

  // Move files with rename; avoid overwriting
  const tasks = plan.map(async (item) => {
    try {
      const target = await uniqueTarget(item.targetFile);
      await vscode.workspace.fs.rename(item.source, target, { overwrite: false });
      moved++;
    } catch (err) {
      // Permission/locked file or other errors -> skip gracefully
      skipped++;
      errors++;
    }
  });
  await Promise.allSettled(tasks);
  return { moved, skipped, errors };
}
