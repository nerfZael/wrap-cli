import { JSON } from "@web3api/wasm-as";
import { FS_Mutation } from "../../../../../../../modules/mutation/w3";
import { TemplatesDirectory } from "./templates/directory";

export class CodeGenDirectory {

  static write(basePath: string, model: JSON.Obj): void {
    const dirPath = `${basePath}/code-gen`;
    FS_Mutation.createDir({
      path: dirPath
    });

    //Files

    //Directories
    TemplatesDirectory.write(dirPath, model);
  }
}