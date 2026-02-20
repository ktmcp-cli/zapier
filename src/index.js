/**
 * Zapier CLI - Main Command Interface
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import * as api from './lib/api.js';
import { setConfig, getConfig, getAllConfig, clearConfig } from './lib/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure main program
program
  .name('zapier')
  .description(chalk.cyan('Zapier NLA API CLI - Natural Language Actions platform'))
  .version(packageJson.version, '-v, --version', 'output the current version')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ zapier config set apiKey <your-api-key>
  $ zapier actions list --json
  $ zapier actions execute <action-id> --params '{"key":"value"}'

${chalk.bold('API Documentation:')}
  ${chalk.blue('https://nla.zapier.com/docs/')}

${chalk.bold('Get API Key:')}
  ${chalk.blue('https://nla.zapier.com/')}
`);

// Config commands
const config = program.command('config').description('Manage configuration');

config
  .command('set')
  .description('Set a configuration value')
  .argument('<key>', 'Configuration key')
  .argument('<value>', 'Configuration value')
  .action((key, value) => {
    setConfig(key, value);
    console.log(chalk.green(`✓ Set ${key} = ${value}`));
  });

config
  .command('get')
  .description('Get a configuration value')
  .argument('<key>', 'Configuration key')
  .action((key) => {
    const value = getConfig(key);
    console.log(value || chalk.gray('(not set)'));
  });

config
  .command('list')
  .description('List all configuration')
  .action(() => {
    const cfg = getAllConfig();
    console.log(JSON.stringify(cfg, null, 2));
  });

config
  .command('clear')
  .description('Clear all configuration')
  .action(() => {
    clearConfig();
    console.log(chalk.green('✓ Configuration cleared'));
  });

// Actions commands
const actions = program.command('actions').description('Manage Zapier NLA actions');

actions
  .command('list')
  .description('List available actions')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching available actions...').start();
    try {
      const data = await api.get('/actions');
      spinner.succeed('Actions retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch actions');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

actions
  .command('get')
  .description('Get action details by ID')
  .argument('<id>', 'Action ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    const spinner = ora(`Fetching action ${id}...`).start();
    try {
      const data = await api.get(`/actions/${id}`);
      spinner.succeed('Action retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch action');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

actions
  .command('execute')
  .description('Execute an action')
  .argument('<id>', 'Action ID')
  .option('--params <json>', 'Action parameters as JSON string', '{}')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    const spinner = ora(`Executing action ${id}...`).start();
    try {
      const params = JSON.parse(options.params);
      const data = await api.post(`/actions/${id}/execute`, params);
      spinner.succeed('Action executed');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to execute action');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Global error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
