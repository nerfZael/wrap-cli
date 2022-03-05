import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../../../modules/mutation/w3";

const template = `import { JSON } from "@web3api/wasm-as";
import { FS_Mutation } from "../../../../{{{backPath}}}modules/mutation/w3";
{{#files}}
import { {{pascalName}}File } from "./{{name}}";
{{/files}}
{{#directories}}
import { {{pascalName}}Directory } from "./{{name}}/directory";
{{/directories}}


export class {{pascalName}}Directory {

  static write(basePath: string, model: JSON.Obj): void {
    const dirPath = \`\${basePath}{{{relativePath}}}\`;
    FS_Mutation.createDir({
      path: dirPath
    });

    //Files
    {{#files}}
    {{pascalName}}File.write(dirPath, model);
    {{/files}}
  
    //Directories
    {{#directories}}
    {{pascalName}}Directory.write(dirPath, model);
    {{/directories}}
  }
}`;

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

export class DirectoryFile {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.write({
      path: `${basePath}/directory.ts`,
      content: render(transform(model))
    });
  }
}