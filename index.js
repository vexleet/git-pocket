const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');

clear();

console.log(chalk.yellow(figlet.textSync('GIT Pocket', { horizontalLayout: "full" })));

if (!files.directoryExists('.git')) {
    console.log(chalk.red('This directory is not a git repository'));
    process.exit();
}
