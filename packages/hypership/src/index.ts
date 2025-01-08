#!/usr/bin/env node

(async () => {
  try {
    const cli = await import('@hypership/cli');
    if (cli.default) {
      cli.default();
    } else {
      console.error('Failed to find default export in @hypership/cli.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Failed to load hypership:', err);
    process.exit(1);
  }
})();
