#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the timestamp either from env var or create a new one
const buildTimestamp = process.env.REACT_APP_BUILD_TIMESTAMP || new Date().toISOString();
const versionFilePath = path.resolve(__dirname, '../public/version.json');

try {
  // Read, update, and write back in a more concise way
  const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
  versionData.buildTimestamp = buildTimestamp;
  fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));

  console.log(`Updated version.json with build timestamp: ${buildTimestamp}`);
} catch (error) {
  console.error('Error updating version.json:', error);
  process.exit(1);
}