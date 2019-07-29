#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const github = require('./lib/github');
const inquirer = require('./lib/inquirer');
const repo = require('./lib/repo');

clear();

console.log(chalk.yellow(figlet.textSync('GIT Pocket', { horizontalLayout: "full" })));

if (!files.directoryExists('.git')) {
    console.log(chalk.red('This directory is not a git repository'));
    process.exit();
}

const getGithubToken = async () => {
    let token = github.getStoredGithubToken();
    if (token) {
        return token;
    }

    await github.setGithubCredentials();

    token = await github.registerNewToken();
    return token;
}

const run = async () => {
    const token = await getGithubToken();
    github.githubAuth(token);

    let command = await inquirer.askForCommand();

    while (command.command !== 'exit') {
        switch (command.command) {
            case 'Add files':
                const filesToAdd = await inquirer.askWhichFilesToAdd();

                const doneAddFiles = await repo.addFilesToRepo(filesToAdd.files);

                if (doneAddFiles) {
                    console.log(chalk.green('Files added successfully. You can commit now.'));
                }
                break;
            case 'Commit and Push':
                const commitMessage = await inquirer.askCommitMessage();

                const doneCommitAndPush = await repo.commitAndPush(commitMessage['commit-message']);

                if (doneCommitAndPush) {
                    console.log(chalk.green('All done!'));
                }
                break;
            case 'Status':
                const statusOfRepo = await repo.getStatusOfRepo();

                console.log(chalk.green(`Branch: ${statusOfRepo.current}`));

                for (let i = 0; i < statusOfRepo.files.length; i++) {
                    const currentFile = statusOfRepo.files[i];

                    if (currentFile.working_dir === 'M') {
                        console.log(chalk.red(`${currentFile.path} - Modified`));
                    }
                    else if (currentFile.working_dir === '?') {
                        console.log(chalk.red(`${currentFile.path} - New file`));
                    }

                    if (currentFile.index !== ' ' && currentFile.working_dir === ' ') {
                        console.log(chalk.green(`${currentFile.path} - Ready to commit`));
                    }
                }

                console.log('\n');

                break;
            case 'Commit logs':
                const logs = await repo.showCommitLogs();

                for (let i = 0; i < logs.length; i++) {
                    const currentLog = logs[i];

                    console.log(`commit ${chalk.yellow(currentLog.hash)} ${currentLog.refs}`);
                    console.log(`Author: ${chalk.green(currentLog.author_name)}`);
                    console.log(`Date: ${currentLog.date}`);
                    console.log(`Commit message: ${currentLog.message}`);

                    console.log('\n');
                }

                break;
            case 'Create new branch':
                const branchName = await inquirer.askBranchName();

                const doneNewBranch = await repo.createNewBranch(branchName['branch-name']);

                if (doneNewBranch) {
                    console.log(chalk.green('Created new branch!'));
                }
                break;
            case "Switch branch":
                const switchBranchName = await inquirer.askSwitchBranch();

                const doneSwitchBranch = await repo.changeBranch(switchBranchName['switch-branch']);

                if (doneSwitchBranch) {
                    console.log(chalk.green(`Successfully switched branch to ${switchBranchName['switch-branch']}.`));
                }
                break;
            case 'Exit':
                process.exit();
                break;
        }
        command = await inquirer.askForCommand();
    }
};

run();