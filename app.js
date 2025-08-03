const next = require('next');

const port = process.env.PORT || 56788; // <-- Twój port
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  require('http')
    .createServer((req, res) => handle(req, res))
    .listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
});

