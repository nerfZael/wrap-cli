#!/usr/bin/env node
import { buildDependencyContainer, readDir } from "./di/buildDependencyContainer";
import { program } from "commander";
import { Uri, Web3ApiClient } from "@web3api/client-js";
import fs from "fs";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env("");

(async () => {
  const dependencyContainer = await buildDependencyContainer();
  const {
    polywrapClient,
  } = dependencyContainer.cradle;

const installAction = async (uri: string, appName: string, options: { link: boolean, alias: string }) => {
  const appSettingsPath = path.join(__dirname, "apps.json");

  if(!fs.existsSync(appSettingsPath)) {
    fs.writeFileSync(appSettingsPath, "{}");
  }

  const appsJson = fs.readFileSync(appSettingsPath, "utf8");
  const apps = JSON.parse(appsJson);

  if(options.alias) {
    apps[options.alias] = {
      uri,
      name: appName,
    };
  }

  fs.writeFileSync(appSettingsPath, JSON.stringify(apps, null, 2));

  console.log(`App "${appName}" installed`);
};

  program
    .command("exec")
    .description("execute a remote cli wrapper app")
    .argument("<string>", "URI of the cli wrapper")
    .argument("<string>", "name of the cli wrapper app")
    .option("-i, --input <string>", "Input")
    .action(async (uri, appName, options) => {
      await runApp(
        uri, 
        appName, 
        options.input ?
        options.input.split(" ")
          : [],
        polywrapClient
      );
    });

  program
    .command("install")
    .description("install a remote cli wrapper app")
    .argument("<string>", "URI of the cli wrapper")
    .argument("<string>", "name of the cli wrapper app")
    .requiredOption("-l, --link", "Link the app to the URI")
    .requiredOption("-a, --alias <string>", "Alias for the app")
    .action(installAction);
  program
    .command("i")
    .description("install a remote cli wrapper app")
    .argument("<string>", "URI of the cli wrapper")
    .argument("<string>", "name of the cli wrapper app")
    .requiredOption("-l, --link", "Link the app to the URI")
    .requiredOption("-a, --alias <string>", "Alias for the app")
    .action(installAction);

  program
    .command("run")
    .description("install a locally installed cli wrapper app")
    .argument("<string...>", "name of the cli wrapper app")
    .option("-i, --input <string>", "Input")
    .action(async (aliasArray, options) => {
      const alias = aliasArray.join(" ");

      const appSettingsPath = path.join(__dirname, "apps.json");

      if(!fs.existsSync(appSettingsPath)) {
        fs.writeFileSync(appSettingsPath, "{}");
      }

      const appsJson = fs.readFileSync(appSettingsPath, "utf8");
      const apps = JSON.parse(appsJson);

      const app = apps[alias];

      await runApp(
        app.uri, 
        app.name, 
        options.input ?
        options.input.split(" ")
          : [],
        polywrapClient
      );
    });

  program.parse(process.argv);
})();

export const runApp = async (uri: string, appName: string, inputs: string[], polywrapClient: Web3ApiClient) => {
  const { data, error } = await polywrapClient.invoke({
    uri: "/ens/ethereum/thisisateest.eth.eth",
    //w3://ens/ethereum/test.eth
    // /ipfs/Qmsdsadssads
    module: "mutation",
    method: appName,
    input: {
      inputs
    }
  });

  if (error || !data) {
    throw error;
  }
};