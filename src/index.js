#!/usr/bin/env node

const createDirectories = require("./bin/createDirectories");
const createFiles = require("./bin/createFiles");
const initializeProject = require("./bin/initializer");
const chalk = require("chalk");
// initializeProject: 2 steps (create directory + npm init)
// createDirectories: 1 (src) + 7 (subdirs) = 8
// createFiles: 2 files
const TOTAL_STEPS = 2+8+2;
process.stdin.setEncoding('utf8');
let projectName = "my-app";
console.log(chalk.blue("Enter Project Name: "));
process.stdin.on('data', async function (data) {
    projectName = data.trim();
    let completedSteps = 0;
    let lastPercentage = -1;
    
    const updateProgress = () => {
        completedSteps++;
        const percentage = Math.round((completedSteps / TOTAL_STEPS) * 100);
        if (percentage !== lastPercentage) {
            process.stdout.write(chalk.blue(`[${percentage}%] `));
            lastPercentage = percentage;
        }    
    };
    try {
        await initializeProject(projectName, updateProgress);
        await createDirectories(projectName, updateProgress);
        await createFiles(projectName, updateProgress);
        console.log(chalk.blue(`\n[100%] `) + chalk.green.bold('Project setup completed!'));
    } catch (error) {
        console.error(`Error generating project: ${error}`);
        process.exit(1);
    }
});