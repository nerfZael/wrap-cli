import { JSON } from "@web3api/wasm-as";
import { FS_Mutation } from "../../../../../../../../modules/mutation/w3";
import { RootDirectory } from "./root/directory";

export class TemplatesDirectory {

  static write(basePath: string, model: JSON.Obj): void {
    const dirPath = `${basePath}/templates`;
    FS_Mutation.createDir({
      path: dirPath
    });

    //Files

    //Directories
    RootDirectory.write(dirPath, model);
  }
}