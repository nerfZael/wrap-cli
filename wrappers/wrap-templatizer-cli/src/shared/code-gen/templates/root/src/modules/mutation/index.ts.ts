import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../../../../../../modules/mutation/w3";

const template = `import { JSON } from "@web3api/wasm-as";
import { RootDirectory } from "../../shared/code-gen/templates/root/directory";
import { Console_Query, Input_generate } from "./w3";

export function generate(input: Input_generate): bool {
  if(input.inputs.length === 0 || input.inputs[0] === "") {
    throw new Error("Name is a required argument");
  }

  const model = new JSON.Obj();
  model.set("name", input.inputs[0]);

  RootDirectory.write(input.inputs[0], model);

  return true;
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

export class IndexTsFile {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.write({
      path: `${basePath}/index.ts`,
      content: render(transform(model))
    });
  }
}