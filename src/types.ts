export type ObjectType =
  | "table"
  | "tableextension"
  | "page"
  | "pageextension"
  | "codeunit"
  | "report"
  | "query"
  | "xmlport"
  | "enum"
  | "interface";

export interface DetectionResult {
  type: ObjectType | null;
  reason: "filename" | "content" | "unknown";
}

export interface MovePlanItem {
  source: import("vscode").Uri;
  targetDir: import("vscode").Uri;
  targetFile: import("vscode").Uri;
}
