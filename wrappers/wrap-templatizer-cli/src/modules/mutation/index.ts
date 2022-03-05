import { JSON } from "@web3api/wasm-as";
import { RootDirectory } from "../../shared/code-gen/templates/root/directory";
import { FS_Query, Input_templatize } from "./w3";

export function templatize(input: Input_templatize): bool {
  RootDirectory.write(input.inputs[1], acquireModel(input.inputs[0]));
  
  return true;
}

function acquireModel(projectPath: string): JSON.Obj {
  const items = FS_Query.readDirAsJson({
    path: projectPath
  });

  const obj = new JSON.Obj();

  obj.set("contents", JSON.parse(items))

  return obj;
}
