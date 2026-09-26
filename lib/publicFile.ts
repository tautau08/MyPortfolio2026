import "server-only";
import fs from "node:fs";
import path from "node:path";

/** Whether a URL like "/cv.pdf" points at a real file in /public. Server components only. */
export function publicFileExists(url: string): boolean {
  if (!url.startsWith("/")) return false;
  return fs.existsSync(path.join(process.cwd(), "public", url));
}
