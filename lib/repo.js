const _ = require('lodash');
const fs = require('fs');
const git = require('simple-git')();
const CLI = require('clui')
const Spinner = CLI.Spinner;
const touch = require('touch');
const chalk = require('chalk');

const inquirer = require('./inquirer');
const gh = require('./github');

module.exports = {
    getStatusOfRepo: async () => {
        try {
            let statusOfRepo = [];

            await git.status((err, status) => {
                statusOfRepo = status;
            });

            return statusOfRepo;
        }
        catch (err) {
            console.log(err);
        }
    },

    addFilesToRepo: async (filesToAdd) => {
        const status = new Spinner('Adding files to repository');
        status.start();

        if (filesToAdd.length === 0) {
            filesToAdd = ['./*'];
        }

        try {
            await git.add(filesToAdd);

            return true;
        }
        catch (err) {
            throw err;
        }
        finally {
            status.stop();
        }
    },

    commitAndPush: async (commitMessage) => {
        const status = new Spinner('Pushing files to repository');
        status.start();

        try {
            await git
                .commit(commitMessage)
                .push('origin', 'master');

            return true;
        }
        catch (err) {
            throw err;
        }
        finally {
            status.stop();
        }
    },

    showCommitLogs: async () => {
        let logs = [];

        await git.log((err, log) => {
            logs = log['all'];
        });

        return logs;
    },

    createNewBranch: async (branchName) => {
        const status = new Spinner('Creating new branch');
        status.start();

        try {
            await git
                .pull('origin', 'master')
                .checkoutLocalBranch(branchName)
                .push('origin', branchName);

            return true;
        }
        catch (err) {
            throw err;
        }
        finally {
            status.stop();
        }
    },

    listAllBranches: async () => {
        let allBranches = [];
        await git.branch((err, branches) => {
            allBranches = branches.all.filter(branch => !branch.startsWith('remotes/origin')).map(branch => branch);
        });

        return allBranches;
    },

    changeBranch: async (branchName) => {
        await git
            .checkout(branchName);

        return true;
    }
};