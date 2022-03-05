import {
  Input_generate,
} from "./w3";
import { JSON } from "@web3api/wasm-as";
import { transform } from "../../shared/transform";
import { writeQueryAssemblyScript } from "../../shared/code-gen/writeQueryAssemblyScript";
import { writeMutationAssemblyScript } from "../../shared/code-gen/writeMutationAssemblyScript";
import { writeMutationSchema } from "../../shared/code-gen/writeMutationSchema";
import { writeQuerySchema } from "../../shared/code-gen/writeQuerySchema";

export function generate(input: Input_generate): bool {
  const model = input.inputs[0];

  const tranformedModel = transform(<JSON.Arr>JSON.parse(model));

  writeQuerySchema(tranformedModel);
  writeQueryAssemblyScript(tranformedModel);
  writeMutationSchema(tranformedModel);
  writeMutationAssemblyScript(tranformedModel);

  return true;
}