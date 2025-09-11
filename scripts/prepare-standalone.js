const fs = require('fs');
const path = require('path');

async function copy(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.cp(src, dest, { recursive: true });
}

async function main() {
  const root = process.cwd();
  const standalone = path.join(root, '.next', 'standalone');

  await copy(path.join(root, 'public'), path.join(standalone, 'public'));
  await copy(path.join(root, '.next', 'static'), path.join(standalone, '.next', 'static'));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
