import { JSON } from "@web3api/wasm-as";
import { FS_Mutation } from "../../../../../modules/mutation/w3";
import { SharedDirectory } from "./shared/directory";
import { ModulesDirectory } from "./modules/directory";

export class SrcDirectory {

  static write(basePath: string, model: JSON.Obj): void {
    const dirPath = `${basePath}/src`;
    FS_Mutation.createDir({
      path: dirPath
    });

    //Files

    //Directories
    ModulesDirectory.write(dirPath, model);
    SharedDirectory.write(dirPath, model);
  }
}