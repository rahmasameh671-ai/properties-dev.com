const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // Clean trailing slash if not root
  if (reqUrl.length > 1 && reqUrl.endsWith('/')) {
    reqUrl = reqUrl.slice(0, -1);
  }

  let filePath = path.join(PUBLIC_DIR, reqUrl);

  // Check if direct file or directory route exists
  if (reqUrl === '/') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  } else if (!path.extname(filePath)) {
    // Check .html extension or folder index.html
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 - Page Not Found</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #000; color: #fff;">
          <h1>404</h1>
          <p>Page Not Found</p>
          <a href="/" style="color: #25D366;">Return to properties-dev.com</a>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`properties-dev.com local preview server running at: http://localhost:${PORT}`);
});
