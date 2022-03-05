import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../../../modules/mutation/w3";

const template = `{
  "name": "wrap-template",
  "description": "Web3API Assemblyscript Template",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "build": "yarn build:web3api",
    "build:web3api": "npx w3 build"
  },
  "devDependencies": {
    "@web3api/cli": "0.0.1-prealpha.62",
    "@web3api/wasm-as": "0.0.1-prealpha.62",
    "assemblyscript": "0.19.1"
  }
}
`;

function transform(model: JSON.Obj): JSON.Obj {
  const templateModel = model;
  return templateModel;
}

function render(templateModel: JSON.Obj): string {
  return Mustache_Query.render({
    template: template,
    model: templateModel.stringify()
  });
}

export class PackageJsonFile {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.write({
      path: `${basePath}/package.json`,
      content: render(transform(model))
    });
  }
}