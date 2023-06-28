import path from "path";
import {fileURLToPath} from "url";
import fs from "fs";

export default async function loadTemplate(isProduction = false) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return fs.readFileSync(
    path.resolve(__dirname, isProduction ? '../../dist/client/index.html' : '../../src/index.html'),
    'utf-8',
  );
}
