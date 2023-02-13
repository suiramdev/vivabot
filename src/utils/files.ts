/**
 * @fileoverview Utility functions for files.
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Find files in a directory recursively.
 * @param dir The directory to search.
 * @param filter A filter function to apply to each file.
 * @return The list of files.
 * @throws If the directory does not exist.
 */
export function findFiles(
  dir: string,
  filter: (file: string) => boolean
): string[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory does not exist: ${dir}`);
  }

  const files: string[] = [];
  const queue: string[] = [dir];

  while (queue.length > 0) {
    const dir = queue.shift()!;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const file = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        queue.push(file);
      } else if (filter(file)) {
        files.push(file);
      }
    }
  }

  return files;
}
