#!/usr/bin/env node

/**
 * Minification script for production builds
 * Minifies all JavaScript files in the dist folder using terser
 */

import { readdir, readFile, writeFile, stat, unlink } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

// Configuration for terser minification
const terserOptions = {
  compress: {
    drop_console: false, // Keep console.logs if needed
    drop_debugger: true,
    passes: 2, // Multiple passes for better minification
  },
  mangle: {
    toplevel: false, // Don't mangle top-level names (for ES modules)
    reserved: ['RichEditor', 'EditorEngine'], // Keep important class names
  },
  format: {
    comments: false, // Remove all comments
  },
  module: true, // ES module mode
  sourceMap: false, // Remove source maps for production
};

/**
 * Recursively find all .js files in a directory
 */
async function findJsFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await findJsFiles(filePath, fileList);
    } else if (extname(file) === '.js' && !file.endsWith('.map.js')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Minify a single JavaScript file
 */
async function minifyFile(filePath) {
  try {
    let code = await readFile(filePath, 'utf8');
    
    // Remove source map references from the code
    // Remove lines like: //# sourceMappingURL=index.js.map
    code = code.replace(/\/\/# sourceMappingURL=[^\n]*\n?/g, '');
    code = code.replace(/\/\*# sourceMappingURL=[^\*]*\*\/\n?/g, '');
    
    const result = await minify(code, terserOptions);

    if (result.error) {
      throw result.error;
    }

    if (!result.code) {
      throw new Error('Minification produced no output');
    }

    // Ensure no source map reference is added
    const minifiedCode = result.code.replace(/\/\/# sourceMappingURL=[^\n]*\n?/g, '');
    
    await writeFile(filePath, minifiedCode, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting minification process...');
  
  try {
    const jsFiles = await findJsFiles(distDir);
    
    if (jsFiles.length === 0) {
      console.log('No JavaScript files found in dist folder');
      return;
    }

    console.log(`Found ${jsFiles.length} JavaScript file(s) to minify`);

    let successCount = 0;
    let failCount = 0;

    for (const file of jsFiles) {
      const relativePath = file.replace(distDir, '');
      process.stdout.write(`  Minifying ${relativePath}... `);
      
      const success = await minifyFile(file);
      
      if (success) {
        console.log('OK');
        successCount++;
      } else {
        console.log('FAILED');
        failCount++;
      }
    }

    // Remove source code content from source maps (but keep the map files)
    console.log('\nRemoving source code from source maps...');
    await sanitizeSourceMaps(distDir);
    console.log('Source maps sanitized (source code removed)');

    console.log(`\nMinification complete!`);
    console.log(`   Success: ${successCount}`);
    if (failCount > 0) {
      console.log(`   Failed: ${failCount}`);
    }
  } catch (error) {
    console.error('❌ Minification failed:', error);
    process.exit(1);
  }
}

/**
 * Remove source code content from source map files (but keep the maps for debugging)
 */
async function sanitizeSourceMaps(dir) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await sanitizeSourceMaps(filePath);
    } else if (file.endsWith('.map')) {
      try {
        const mapContent = await readFile(filePath, 'utf8');
        const mapJson = JSON.parse(mapContent);
        
        // Remove source content from the map (keeps the map but removes actual code)
        if (mapJson.sourcesContent) {
          mapJson.sourcesContent = []; // Clear all source content
        }
        
        // Optionally, we can also change source paths to be more generic
        // but keep the structure for debugging
        await writeFile(filePath, JSON.stringify(mapJson, null, 0), 'utf8');
      } catch (error) {
        // Ignore errors if file doesn't exist or can't be parsed
      }
    }
  }
}

main();

