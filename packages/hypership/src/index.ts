#!/usr/bin/env node

import('@hypership/cli').catch(err => {
  console.error('Failed to load hypership:', err);
  process.exit(1);
});
