const fs = require('fs');
const path = require('path');

function safeJoin(base, ...paths) {
  const target = path.resolve(base, ...paths);
  if (!target.startsWith(base + path.sep)) {
    throw new Error(`refusing to access path outside ${base}: ${target}`);
  }
  return target;
}

async function copy(src, dest) {
  try {
    await fs.promises.access(src);
  } catch {
    return;
  }
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.cp(src, dest, { recursive: true });
}

async function main() {
  const root = path.resolve(process.cwd());
  const standalone = safeJoin(root, '.next', 'standalone');

  await copy(safeJoin(root, 'public'), safeJoin(standalone, 'public'));
  await copy(safeJoin(root, '.next', 'static'), safeJoin(standalone, '.next', 'static'));
  await copy(safeJoin(root, 'tmp'), safeJoin(standalone, 'tmp'));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
