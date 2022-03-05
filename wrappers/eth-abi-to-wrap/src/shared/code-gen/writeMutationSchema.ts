import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../modules/mutation/w3";

export function writeMutationSchema(model: JSON.Obj): bool {
  const filePath = "./query/schema.graphql";
  const template = `#import { Connection } into Ethereum from "w3://ens/ethereum.web3api.eth"

type Mutation {
{{#function}}
  {{#nonpayable}}
  {{name}}(
    connection: Ethereum_Connection!,
    address: String!{{#inputs.length}},{{/inputs.length}}
    {{#inputs}}
    {{name}}: {{schemaType}}!{{^_last_}},{{/_last_}}
    {{/inputs}}
  ): Ethereum_TxResponse!{{^_last_}}
{{/_last_}}

  {{/nonpayable}}
  {{#payable}}
  {{name}}(
    connection: Ethereum_Connection!,
    address: String!{{#inputs.length}},{{/inputs.length}}
    {{#inputs}}
    {{name}}: {{schemaType}}!{{^_last_}},{{/_last_}}
    {{/inputs}}
  ): Ethereum_TxResponse!{{^_last_}}
  {{/_last_}}

  {{/payable}}
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