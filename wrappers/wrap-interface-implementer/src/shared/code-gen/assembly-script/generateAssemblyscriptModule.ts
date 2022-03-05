import { Console_Query, FS_Mutation, FS_Query } from "../../../modules/mutation/w3";
import { WrapperMetadata } from "../../types/WrapperMetadata";
import { WrapperModuleMethod } from "../../types/WrapperModuleMethod";
import { schemaTypeToAssemblyScriptType } from "../mappers/schemaTypeToAssemblyScriptType";
import { getModuleMethods } from "../utils/getModuleMethods";

export function generateAssemblyscriptModule(
  basePath: string,
  pascalCaseModuleName: string, 
  lowerCaseModuleName: string, 
  wrapperMetadataList: WrapperMetadata[]
): void {
  const funcCode: string[] = [];
  const importsCode: string[] = [];

  const methods = getModuleMethods(pascalCaseModuleName, wrapperMetadataList);

  if(methods.length === 0) {
    Console_Query.debug({
      message: `Found no methods for "${pascalCaseModuleName}" modules \nSkipping AssemblyScript generation for "${pascalCaseModuleName}"...`
    });
    return;
  }

  for(let i = 0; i < methods.length; i++) {
    const method: WrapperModuleMethod = methods[i];

    let returnType: string | null = method.returnType;

    if(returnType != null) {
      let nonNullableReturnType = returnType as string; 

      const nullable = !nonNullableReturnType.endsWith("!");
      nonNullableReturnType = !nullable
        ? nonNullableReturnType.slice(0, nonNullableReturnType.length - 1)
        : nonNullableReturnType;
    
      returnType = schemaTypeToAssemblyScriptType(nonNullableReturnType);
    } else {
      returnType = "void";
    }
    
    funcCode.push(`export function ${method.name}(input: Input_${method.name}): ${returnType} {
  return;
}`);

    importsCode.push(`Input_${method.name}`);
  }

    
  const existingModuleCode = FS_Query.read({
    path: `${basePath}/${lowerCaseModuleName}/index.ts`
  });

  if(!existingModuleCode) {
    const importsTemplate = `import {
${importsCode.map<string>(x => `  ${x}`).join(",\n")}
} from "./w3";`;
      
    FS_Mutation.write({
      path: `${basePath}/${lowerCaseModuleName}/index.ts`,
      content: importsTemplate + "\n" + funcCode.join("\n\n")
    });
  } else {
    //TODO: Extend imports
    FS_Mutation.write({
      path: `${basePath}/${lowerCaseModuleName}/index.ts`,
      content: existingModuleCode + "\n" + funcCode.join("\n\n")
    });
  }
}