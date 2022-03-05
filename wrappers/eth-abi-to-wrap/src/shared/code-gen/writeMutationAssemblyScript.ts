import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../modules/mutation/w3";

export function writeMutationAssemblyScript(model: JSON.Obj): bool {
  const filePath = "./query/schema.graphql";
  const template = `import {
  Ethereum_TxResponse,
  Ethereum_Mutation,
  {{#function}}
  {{#nonpayable}}
  Input_{{name}}{{^_last_}},{{/_last_}}
  {{/nonpayable}}
  {{#payable}}
  Input_{{name}}{{^_last_}},{{/_last_}}
  {{/payable}}
  {{/function}}
} from "./w3";
import { BigInt } from '@web3api/wasm-as';

{{#function}}
{{#nonpayable}}
export function {{name}}(input: Input_{{name}}): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function {{name}}({{#inputs}}{{type}} {{name}}{{^_last_}}, {{/_last_}}{{/inputs}}) public returns ({{#outputs}}{{type}}{{/outputs}})",
    args: [{{#inputs}}{{inputToString}}{{^_last_}}, {{/_last_}}{{/inputs}}]
  });
}
{{^_last_}}

{{/_last_}}
{{/nonpayable}}
{{#payable}}
export function {{name}}(input: Input_{{name}}): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function {{name}}({{#inputs}}{{type}} {{name}}{{^_last_}}, {{/_last_}}{{/inputs}}) public returns ({{#outputs}}{{type}}{{/outputs}})",
    args: [{{#inputs}}{{inputToString}}{{^_last_}}, {{/_last_}}{{/inputs}}]
  });
}
{{^_last_}}

{{/_last_}}
{{/payable}}
{{/function}}  
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