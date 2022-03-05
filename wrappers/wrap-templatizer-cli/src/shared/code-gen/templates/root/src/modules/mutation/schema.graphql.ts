import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../../../../../../modules/mutation/w3";

const template = `#import { Mutation, Query } into FS from "w3://ens/rinkeby/wrap-fs.eth"
#import { Query } into Mustache from "w3://ens/rinkeby/wrap-mustache.eth"
#import { Query } into Regex from "w3://ens/rinkeby/wrap-regex.eth"
#import { Query } into Console from "w3://ens/console.web3api.eth"

type Mutation {
  generate(
    inputs: [String!]!
  ): Boolean!
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

export class SchemaTsFile {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.write({
      path: `${basePath}/schema.graphql`,
      content: render(transform(model))
    });
  }
}