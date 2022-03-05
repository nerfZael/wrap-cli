import { JSON } from "@web3api/wasm-as";
import { FS_Mutation } from "../../../../../../modules/mutation/w3";
import { CodeGenDirectory } from "./code-gen/directory";

export class SharedDirectory {

  static write(basePath: string, model: JSON.Obj): void {
    const dirPath = `${basePath}/shared`;
    FS_Mutation.createDir({
      path: dirPath
    });

    //Files

    //Directories
    CodeGenDirectory.write(dirPath, model);
  }
}