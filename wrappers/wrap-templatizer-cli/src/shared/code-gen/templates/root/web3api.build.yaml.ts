import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../../../modules/mutation/w3";

const template = `format: 0.0.1-prealpha.1
docker:
  name: build-env
config:
  node_version: "16.13.0"
  include:
    - ./package.json
    - ./src
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

export class Web3apiBuildYamlFile {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.write({
      path: `${basePath}/web3api.build.yaml`,
      content: render(transform(model))
    });
  }
}