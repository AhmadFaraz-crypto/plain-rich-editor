#!/usr/bin/env node

/**
 * Obfuscation script for production builds
 * Obfuscates all JavaScript files in the dist folder using javascript-obfuscator
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

// Configuration for obfuscation
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false, // Set to true to prevent debugging in browser console
  debugProtectionInterval: 0,
  disableConsoleOutput: false, // Set to true to remove all console.* calls
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false, // Keep false for ES modules
  selfDefending: true, // Prevents code from being reformatted
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false,
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
 * Obfuscate a single JavaScript file
 */
async function obfuscateFile(filePath) {
  try {
    const code = await readFile(filePath, 'utf8');
    
    const result = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
    
    await writeFile(filePath, result.getObfuscatedCode(), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error obfuscating ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting obfuscation process...');
  console.log('Note: Obfuscation makes code harder to read but not impossible to reverse');
  
  try {
    const jsFiles = await findJsFiles(distDir);
    
    if (jsFiles.length === 0) {
      console.log('No JavaScript files found in dist folder');
      return;
    }

    console.log(`Found ${jsFiles.length} JavaScript file(s) to obfuscate`);

    let successCount = 0;
    let failCount = 0;

    for (const file of jsFiles) {
      const relativePath = file.replace(distDir, '');
      process.stdout.write(`  Obfuscating ${relativePath}... `);
      
      const success = await obfuscateFile(file);
      
      if (success) {
        console.log('OK');
        successCount++;
      } else {
        console.log('FAILED');
        failCount++;
      }
    }

    console.log(`\nObfuscation complete!`);
    console.log(`   Success: ${successCount}`);
    if (failCount > 0) {
      console.log(`   Failed: ${failCount}`);
    }
    console.log(`\nRemember: Obfuscation adds overhead and may slow down execution`);
  } catch (error) {
    console.error('Obfuscation failed:', error);
    process.exit(1);
  }
}

main();

