import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../modules/mutation/w3";

export function writeQuerySchema(model: JSON.Obj): bool {
  const filePath = "./query/schema.graphql";
  const template = `#import { Connection } into Ethereum from "w3://ens/ethereum.web3api.eth"
type Query {
{{#function}}
{{#view}}
  {{name}}(
    connection: Ethereum_Connection!,
    address: String!{{#inputs.length}},{{/inputs.length}}
    {{#inputs}}
    {{name}}: {{schemaType}}!{{^_last_}},{{/_last_}}
    {{/inputs}}
  ): {{#outputs}}{{schemaType}}{{/outputs}}!{{^_last_}}
{{/_last_}}

{{/view}}
{{/function}}
}
`;

  const output = Mustache_Query.render({
    template: template,
    model: model.stringify()
  });

  FS_Mutation.write({
    path: filePath,
    content: output
  });

  return true;
}