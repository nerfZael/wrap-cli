import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../../../modules/mutation/w3";

const template = `v16.13.0`;

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

export class NvmrcFile {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.write({
      path: `${basePath}/.nvmrc`,
      content: render(transform(model))
    });
  }
}