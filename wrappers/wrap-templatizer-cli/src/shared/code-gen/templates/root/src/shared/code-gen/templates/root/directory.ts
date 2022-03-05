import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, FS_Query, Regex_Query } from "../../../../../../../../../modules/mutation/w3";
import { DirectoryFile } from "../../../../../../shared/directory.ts";

export class RootDirectory {

  static write(basePath: string, model: JSON.Obj): void {
    const dirPath = `${basePath}/root`;
    FS_Mutation.createDir({
      path: dirPath
    });

    generateContents(dirPath, dirPath, model, true);
  }
}

function generateContents(basePath: string, writePath: string, model: JSON.Obj, isRoot: boolean): void {
  const contents = model.get("contents")
    ? model.get("contents") as JSON.Arr
    : new JSON.Arr();

  const items = contents.valueOf();

  const directoryModel = new JSON.Obj();
  const dirName = FS_Query.getName({
    path: writePath
  });
  directoryModel.set("pascalName", capitalize(dirName));
  directoryModel.set("relativePath", isRoot ? "" : `/${dirName}`);
  directoryModel.set("backPath", calculateBackPath(basePath, writePath));

  const fileArray = new JSON.Arr();
  const directoryArray = new JSON.Arr();

  directoryModel.set("files", fileArray);
  directoryModel.set("directories", directoryArray);

  for(let i = 0; i < items.length; i++) {
    const itemObj = items[i] as JSON.Obj;

    const absolutePath = itemObj.getString("absolutePath") 
      ? (itemObj.getString("absolutePath") as JSON.Str)._str
      : "";

    const relativePath = itemObj.getString("relativePath")
      ? (itemObj.getString("relativePath") as JSON.Str)._str
      : "";

    const isDir = itemObj.getBool("isDir") != null
      ? (itemObj.getBool("isDir") as JSON.Bool)._bool
      : false;

    const name = FS_Query.getName({
      path: relativePath
    });
    const fileObj = new JSON.Obj();
    fileObj.set("name", name); 
    fileObj.set("pascalName", fileToClassName(name)); 

    if(isDir) {
      FS_Mutation.createDir({ 
        path: `${writePath}/${relativePath}`
      });

      generateContents(basePath, `${writePath}/${relativePath}`, itemObj, false);
   
      directoryArray.push(fileObj);
    } else {
      const content = FS_Query.read({
        path: `${absolutePath}`,
      });

      if(content) {
        FS_Mutation.write({
          path: `${writePath}/${relativePath}.ts`,
          content: render(basePath, `${writePath}/${relativePath}.ts`, FS_Query.getName({
            path: `${absolutePath}`
          }), content as string)
        });
      }

      fileArray.push(fileObj);
    }
  }

  DirectoryFile.write(writePath, directoryModel);
}

function render(basePath: string, filePath: string, fileName: string, content: string): string {
  let escapedContent = Regex_Query.replace({
    text: content,
    regexp: {
      pattern: "`",
      flags: "g"
    },
    replaceText: "\\`",
  });

  escapedContent = Regex_Query.replace({
    text: escapedContent,
    regexp: {
      pattern: "[$]",
      flags: "g"
    },
    replaceText: "\\$",
  });

  const fileClassName = fileToClassName(fileName);

  return `import { JSON } from "@web3api/wasm-as";
import { FS_Mutation, Mustache_Query } from "../../../${calculateBackPath(basePath, filePath)}modules/mutation/w3";

const template = \`${escapedContent}\`;

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

export class ${fileClassName}File {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.write({
      path: \`\${basePath}/${fileName}\`,
      content: render(transform(model))
    });
  }
}`;
}


export function calculateBackPath(basePath: string, filePath: string): string {
  let backPath = "";
  const baseDepth = basePath.split("/").length;
  const fileDepth = filePath.split("/").length;

  for(let i = 0; i < fileDepth - baseDepth; i++) {
    backPath += "../";
  }

  return backPath;
}

export function fileToClassName(fileName: string): string {
  let fileClassName = Regex_Query.replace({
    text: fileName,
    regexp: {
      pattern: "[^a-z^A-Z^0-9]",
      flags: "g"
    },
    replaceText: " ",
  });

  fileClassName = fileClassName.split(" ").map<string>(x => capitalize(x)).join("");

  return fileClassName;
}

export function capitalize(str: string): string {
  // take first character, uppercase it
  // add the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1);
}