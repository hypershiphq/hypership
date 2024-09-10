const fs = require('fs');
const path = require('path');

// Get the directory from the command line arguments
const targetDir = process.argv[2];
if (!targetDir) {
  console.error('Error: No target directory specified.');
  process.exit(1);
}

const filePath = path.join(__dirname, 'apps',targetDir, 'dist', 'index.js');

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