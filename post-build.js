const fs = require('fs');
const path = require('path');

// Get the directory from the command line arguments
const targetDir = process.argv[2];
if (!targetDir) {
  console.error('Error: No target directory specified.');
  process.exit(1);
}

const targetPaths = {
  node_analytics: path.join(__dirname, 'packages', 'sdks', 'node-sdk', 'node_analytics', 'dist', 'index.js'),
  node_events: path.join(__dirname, 'packages', 'sdks', 'node-sdk', 'node_events', 'dist', 'index.js'),
  react_analytics: path.join(__dirname, 'packages', 'sdks', 'react-sdk', 'analytics', 'dist', 'index.js'),
  react_events: path.join(__dirname, 'packages', 'sdks', 'react-sdk', 'events', 'dist', 'index.js')
}

const filePath = targetPaths[targetDir]

if (!filePath) {
  throw new Error(`Invalid target directory: ${targetDir}`)
}

try {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    const shebang = '#!/usr/bin/env node\n';
    if (!data.startsWith(shebang)) {
      fs.writeFileSync(filePath, shebang + data, 'utf8');
    }
  } else {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
} catch (err) {
  console.error(`Error reading file: ${err.message}`);
  process.exit(1);
}