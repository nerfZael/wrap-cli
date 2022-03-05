import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../../../modules/mutation/w3";

const template = `repository: https://github.com/web3-api/monorepo
format: 0.0.1-prealpha.4
language: wasm/assemblyscript
build: ./web3api.build.yaml
modules:
  mutation:
    schema: ./src/modules/mutation/schema.graphql
    module: ./src/modules/mutation/index.ts
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

export class Web3apiYamlFile {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.write({
      path: `${basePath}/web3api.yaml`,
      content: render(transform(model))
    });
  }
}