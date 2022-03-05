import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../modules/mutation/w3";

export function writeQueryAssemblyScript(model: JSON.Obj): bool {
  const filePath = "./query/index.ts";
  const template = `import {
  Ethereum_Query,
  {{#function}}
  {{#view}}
  Input_{{name}}{{^_last_}},{{/_last_}}
  {{/view}}
  {{/function}}
} from "./w3";
import { BigInt } from '@web3api/wasm-as';

{{#function}}
{{#view}}
export function {{name}}(input: Input_{{name}}): {{#outputs}}{{assemblyScriptType}}{{/outputs}} {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function {{name}}({{#inputs}}{{type}} {{name}}{{^_last_}}, {{/_last_}}{{/inputs}}) public view returns ({{#outputs}}{{type}}{{/outputs}})",
    args: [{{#inputs}}input.{{name}}{{^_last_}}, {{/_last_}}{{/inputs}}]
  });

  return {{#outputs}}{{stringParseSchemaType}}{{/outputs}};
}
{{^_last_}}

{{/_last_}}
{{/view}}
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