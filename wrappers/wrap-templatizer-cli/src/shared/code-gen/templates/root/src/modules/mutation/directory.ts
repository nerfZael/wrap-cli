import { JSON } from "@web3api/wasm-as";
import { FS_Mutation } from "../../../../../../../modules/mutation/w3";
import { IndexTsFile } from "./index.ts";
import { SchemaTsFile } from "./schema.graphql";

export class MutationDirectory {

  static write(basePath: string, model: JSON.Obj): void {
    const dirPath = `${basePath}/mutation`;
    FS_Mutation.createDir({
      path: dirPath
    });

    //Files
    IndexTsFile.write(dirPath, model);
    SchemaTsFile.write(dirPath, model);

    //Directories
  }
}