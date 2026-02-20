#!/usr/bin/env node

/**
 * Zapier CLI - Main Entry Point
 *
 * Production-ready CLI for Zapier NLA API
 * Natural Language Actions platform
 */

import('../src/index.js').catch(err => {
  console.error('Failed to start CLI:', err);
  process.exit(1);
});
