import { Console_Query, Input_generate } from "./w3";
import { WrapperMetadata } from "../../shared/types/WrapperMetadata";
import { getWrapperMetadata } from "../../shared/metadata/getWrapperMetadata";
import { pascalCase } from "../../shared/utils/pascalCase";
import { generateSchema } from "../../shared/code-gen/schema/generateSchema";
import { generateAssemblyscript } from "../../shared/code-gen/assembly-script/generateAssemblyscript";

export function generate(input: Input_generate): bool {
  const basePath = input.inputs[0];
  const allInterfacesList = input.inputs.slice(1, input.inputs.length);

  const wrapperMetadataList: WrapperMetadata[] = [];

  for(let i = 0; i < allInterfacesList.length; i++) {
    const metadata = getWrapperMetadata(allInterfacesList[i]);

    if(metadata == null) {
      Console_Query.info({
        message: `Found no schema for interface: ${allInterfacesList[i]}`
      });
      continue;
    }

    wrapperMetadataList.push(metadata);
  }
  
  generateSchema(basePath, wrapperMetadataList);
  generateAssemblyscript(basePath, wrapperMetadataList);

  return true;
}
