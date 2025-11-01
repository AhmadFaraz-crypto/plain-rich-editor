#!/usr/bin/env node

/**
 * Simple HTTP server for the website
 */

import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname, normalize } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = __dirname;

const PORT = 9000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.map': 'application/json',
  '.md': 'text/markdown',
};

const server = createServer(async (req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = filePath.split('?')[0]; // Remove query string
  
  try {
    // Handle references to parent dist folder (allow ../dist/ for module imports)
    if (filePath.includes('../dist/') || filePath.startsWith('/../dist/')) {
      // Extract the path after ../dist/
      const distPath = filePath.split('../dist/')[1] || filePath.split('/../dist/')[1] || filePath.replace(/^.*\/dist\//, '');
      const fullPath = join(rootDir, '..', 'dist', distPath);
      
      // Security: ensure the resolved path is within the dist folder
      const resolvedPath = normalize(fullPath);
      const distDir = normalize(join(rootDir, '..', 'dist'));
      if (!resolvedPath.startsWith(distDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden: Path outside dist folder');
        return;
      }
      
      const content = await readFile(fullPath);
      const ext = extname(distPath);
      const contentType = MIME_TYPES[ext] || 'application/javascript';
      
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      });
      res.end(content);
      return;
    }

    // Security: prevent other directory traversal
    const normalizedPath = normalize(filePath);
    if (normalizedPath.includes('..')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    const fullPath = join(rootDir, filePath);
    const content = await readFile(fullPath);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found</title></head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The requested page could not be found.</p>
        <a href="/">Go to Home</a>
      </body>
      </html>
    `);
  }
});

server.listen(PORT, () => {
  console.log(`Website server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

