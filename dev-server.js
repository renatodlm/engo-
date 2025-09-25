const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
   '.html': 'text/html',
   '.js': 'text/javascript',
   '.css': 'text/css',
   '.json': 'application/json',
   '.png': 'image/png',
   '.jpg': 'image/jpg',
   '.gif': 'image/gif',
   '.ico': 'image/x-icon',
   '.svg': 'image/svg+xml',
};

function serveFile(res, filePath) {
   const extname = path.extname(filePath);
   const contentType = mimeTypes[extname] || 'application/octet-stream';

   fs.readFile(filePath, (error, content) => {
      if (error) {
         if (error.code === 'ENOENT') {
            res.writeHead(404);
            res.end('File not found');
         } else {
            res.writeHead(500);
            res.end(`Server Error: ${error.code}`);
         }
      } else {
         res.writeHead(200, { 'Content-Type': contentType });
         res.end(content, 'utf-8');
      }
   });
}

const server = http.createServer((req, res) => {
   let filePath = '.' + req.url;

   if (filePath === './') {
      filePath = './src/view/hub.html'; // Hub é sempre a página inicial
   }

   if (req.url === '/game') {
      filePath = './src/view/index.html'; // Jogo é acessado via /game
   }

   if (req.url.startsWith('/src/')) {
      filePath = '.' + req.url;
   } else if (req.url.startsWith('/dist/')) {
      filePath = '.' + req.url;
   } else if (req.url === '/styles.css') {
      filePath = './dist/styles.css';
   }

   serveFile(res, filePath);
});

server.listen(PORT, () => {
   console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
   console.log(`📁 Servindo arquivos de dist/ e src/`);
});
