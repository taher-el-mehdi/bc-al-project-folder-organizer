import * as vscode from "vscode";
import type { DetectionResult, ObjectType } from "../types";

const KNOWN_TYPES: ObjectType[] = [
  "table",
  "tableextension",
  "page",
  "pageextension",
  "codeunit",
  "report",
  "query",
  "xmlport",
  "enum",
  "interface",
];

export async function detectObjectType(uri: vscode.Uri): Promise<DetectionResult> {
  // 1) Filename-based detection: foo.table.al -> table
  const filename = uri.path.split("/").pop() || "";
  const match = filename.match(/\.([A-Za-z]+)\.al$/i);
  if (match) {
    const lower = match[1].toLowerCase();
    if ((KNOWN_TYPES as string[]).includes(lower)) {
      return { type: lower as ObjectType, reason: "filename" };
    }
  }

  // 2) Lightweight content detection: scan until first non-comment keyword
  try {
    const doc = await vscode.workspace.openTextDocument(uri);
    let inBlockComment = false;
    // Scan up to a reasonable cap to avoid heavy parsing
    const MAX_SCAN_LINES = Math.min(doc.lineCount, 500);
    for (let i = 0; i < MAX_SCAN_LINES; i++) {
      const line = doc.lineAt(i).text.trim();
      if (!line) continue; // skip empty

      // handle block comments naively
      if (inBlockComment) {
        if (line.includes("*/")) inBlockComment = false;
        continue;
      }
      if (line.startsWith("/*")) {
        if (!line.includes("*/")) inBlockComment = true;
        continue;
      }
      if (line.startsWith("//")) continue; // line comment

      // Ignore preprocessor pragmas or attributes before object declaration
      // Continue scanning until the first object keyword is found
      const kw = line.match(/^(table|tableextension|page|pageextension|codeunit|report|query|xmlport|enum|interface)\b/i);
      if (kw) {
        return { type: kw[1].toLowerCase() as ObjectType, reason: "content" };
      }
      // No match: keep scanning subsequent lines
    }
  } catch (err) {
    // ignore detection errors; fall through to unknown
  }

  return { type: null, reason: "unknown" };
}
