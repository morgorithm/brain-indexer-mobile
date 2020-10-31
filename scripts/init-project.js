const chalk = require("chalk");
const inquirer = require("inquirer");
const childProcess = require("child_process");
const packageJson = require("../package.json");
const rimraf = require("rimraf");
const fs = require("fs");

async function initProject() {
  console.log(chalk.green("Start to initiate your project"));

  const answers = await inquirer.prompt([
    {
      name: "applicationName",
      message: "What is your application name?",
      validate: (value) => Boolean(value) || `Application name is required`,
    },
    {
      type: "checkbox",
      name: "platforms",
      message: "Check platforms that you want to add",
      choices: ["Android", "iOS"],
      validate: (value) =>
        Boolean(value?.length) || `Platform should be selected at least 1`,
    },
  ]);

  const PLATFORM_MAP = {
    Android: "android",
    iOS: "ios",
  };
  const { applicationName, platforms } = answers;

  childProcess.execSync(`cordova create ${applicationName}`);
  platforms.forEach((platform) => {
    const stdout = childProcess.execSync(
      `cd ${applicationName} && cordova platform add ${PLATFORM_MAP[platform]}`
    );
    console.log(chalk.greenBright(stdout.toString()));

    packageJson.scripts[
      `emulate:${PLATFORM_MAP[platform]}`
    ] = `cd ${applicationName} && cordova run ${PLATFORM_MAP[platform]}`;
  });

  packageJson.applicationName = applicationName;
  packageJson.scripts.clean = `rm -rf ./${applicationName}/www/*`;
  fs.writeFileSync("./package.json", JSON.stringify(packageJson));
  rimraf.sync(`./${applicationName}/www/*`);
}

initProject();
