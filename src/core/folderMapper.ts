import { Uri } from "vscode";
import type { ObjectType } from "../types";

const folderNames: Record<ObjectType, string> = {
  table: "tables",
  tableextension: "tableextensions",
  page: "pages",
  pageextension: "pageextensions",
  codeunit: "codeunits",
  report: "reports",
  query: "queries",
  xmlport: "xmlports",
  enum: "enums",
  interface: "interfaces",
};

export function mapTypeToFolder(root: Uri, type: ObjectType): Uri {
  return Uri.joinPath(root, "src", folderNames[type]);
}

export function ensureSrcOnly(target: Uri, workspaceRoot: Uri): boolean {
  const normalized = target.toString().toLowerCase();
  const srcRoot = Uri.joinPath(workspaceRoot, "src").toString().toLowerCase();
  return normalized.startsWith(srcRoot);
}
