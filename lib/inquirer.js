const inquirer = require('inquirer');
const files = require('./files');
const repo = require('./repo');

module.exports = {
    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your GitHub username or e-mail adress:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    }
                    else {
                        return 'Please enter your username or e-mail adress.';
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your GitHub password:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    }
                    else {
                        return 'Please enter your password.';
                    }
                }
            }
        ];

        return inquirer.prompt(questions);
    },

    askForCommand: () => {
        const questions = [
            {
                type: 'list',
                message: 'Choose command:',
                name: 'command',
                choices: ['Add files', 'Commit and Push', 'Status', 'Exit'],
            }
        ];

        return inquirer.prompt(questions);
    },

    askWhichFilesToAdd: async () => {
        let files = await repo.getStatusOfRepo();

        const notModifiedFiles = files.files.filter(file => file.working_dir !== ' ');
        const pathToFiles = notModifiedFiles.map(file => file.path);

        const questions = [
            {
                type: 'checkbox',
                message: 'Choose which files you want to add:',
                name: 'files',
                choices: pathToFiles,
                default: ['./*'],
            }
        ];

        return inquirer.prompt(questions);
    },

    askCommitMessage: () => {
        const questions = [
            {
                name: 'commit-message',
                type: 'input',
                message: 'Enter a commit message:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    }
                    else {
                        return 'Please enter a commit message.';
                    }
                }
            },
        ];

        return inquirer.prompt(questions);
    }
};