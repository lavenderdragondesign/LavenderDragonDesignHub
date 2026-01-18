import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const from = path.join(root, 'resize-app', 'dist');
const to = path.join(root, 'dist', 'resize');

if (!fs.existsSync(from)) {
  console.error('Missing resize-app/dist. Did the resize build run?');
  process.exit(1);
}

fs.rmSync(to, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });

const copyDir = (src, dest) => {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
};

copyDir(from, to);
console.log('Copied resize build to dist/resize');
