// Passenger entrypoint for Next.js standalone build
const path = require('path');
const fs = require('fs');

// Passenger provides PORT; default to 3000 if unset
const PORT = parseInt(process.env.PORT, 10) || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

// Run the Next standalone server produced by `next build`
const serverPath = path.resolve(__dirname, '.next', 'standalone', 'server.js');
if (!fs.existsSync(serverPath)) {
  console.error('Standalone server not found:', serverPath);
  console.error('Did you run `npm run build` on CI and deploy .next/standalone?');
  process.exit(1);
}

require(serverPath);
