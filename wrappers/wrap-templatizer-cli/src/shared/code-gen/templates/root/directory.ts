import { JSON } from "@web3api/wasm-as";
import { FS_Mutation } from "../../../../modules/mutation/w3";
import { GitignoreFile } from "./.gitignore";
import { NvmrcFile } from "./.nvmrc";
import { PackageJsonFile } from "./package.json";
import { ReadmeMdFile } from "./README.md";
import { SrcDirectory } from "./src/directory";
import { Web3apiBuildYamlFile } from "./web3api.build.yaml";
import { Web3apiYamlFile } from "./web3api.yaml";

export class RootDirectory {

  static write(basePath: string, model: JSON.Obj): void {
    FS_Mutation.createDir({
      path: basePath
    });

    //Files
    GitignoreFile.write(basePath, model);
    NvmrcFile.write(basePath, model);
    PackageJsonFile.write(basePath, model);
    ReadmeMdFile.write(basePath, model);
    Web3apiBuildYamlFile.write(basePath, model);
    Web3apiYamlFile.write(basePath, model);

    //Directories
    SrcDirectory.write(basePath, model);
  }
}