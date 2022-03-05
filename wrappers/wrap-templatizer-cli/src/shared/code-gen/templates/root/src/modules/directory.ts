import { JSON } from "@web3api/wasm-as";
import { FS_Mutation } from "../../../../../../modules/mutation/w3";
import { MutationDirectory } from "./mutation/directory";
export class ModulesDirectory {

  static write(basePath: string, model: JSON.Obj): void {
    const dirPath = `${basePath}/modules`;
    FS_Mutation.createDir({
      path: dirPath
    });

    //Files

    //Directories
    MutationDirectory.write(dirPath, model);
  }
}