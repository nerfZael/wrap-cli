import { Console_Query, FS_Query, FS_Mutation, Regex_Query } from "../../../modules/mutation/w3";
import { WrapperMetadata } from "../../types/WrapperMetadata";
import { WrapperModule } from "../../types/WrapperModule";
import { getModuleMethods, getModulesByName } from "../utils/getModuleMethods";
import { generateImportInterfacesCode } from "./generateImportInterfacesCode";

export function generateModuleSchema(
  basePath: string,
  pascalCaseModuleName: string, 
  lowerCaseModuleName: string, 
  wrapperMetadataList: WrapperMetadata[]
): void {
  const modules = getValidModules(pascalCaseModuleName, wrapperMetadataList);
  const methods = getModuleMethods(pascalCaseModuleName, wrapperMetadataList);
 
  if(modules.length === 0) {
    Console_Query.debug({
      message: `Found no "${pascalCaseModuleName}" modules \nSkipping schema generation...`
    });
  
    return;
  } else if(methods.length == 0) {
    Console_Query.debug({
      message: `Found no methods for "${pascalCaseModuleName}" modules \nSkipping schema generation for "${pascalCaseModuleName}"...`
    });
  }

  Console_Query.debug({
    message: `Generating schema for module "${pascalCaseModuleName}"`
  });

  const implementInterfacesCode = modules
    .map<string>((x: WrapperModule) => x.fullyQualifiedName)
    .join(" & ");

  const importInterfacesCode = generateImportInterfacesCode(modules);
  
  const existingSchema = FS_Query.read({
    path: `${basePath}/${lowerCaseModuleName}/schema.graphql`
  });

  let newSchema: string = "";

  if(!existingSchema) {
    Console_Query.debug({
      message: `No schema file found. Creating new one...`
    });
    
    const template = modules.length > 0
      ? `${importInterfacesCode}

type ${pascalCaseModuleName} implements ${implementInterfacesCode} {

}`
      : `type ${pascalCaseModuleName} {

}`;

    FS_Mutation.write({
      path: `${basePath}/${lowerCaseModuleName}/schema.graphql`,
      content: template
    });
  } else {
    Console_Query.debug({
      message: `Existing schema file found. Updating...`
    });

    const nonNullSchema = existingSchema as string;
   
    const existingImplementsMatches = Regex_Query.exec({
      text: nonNullSchema,
      regexp: {
        pattern: `type\\s+${pascalCaseModuleName}\\s+implements\\s+([^{]*){`,
        flags: null
      }
    });
    if(existingImplementsMatches.length < 2) {
      newSchema = Regex_Query.replace({
        text: nonNullSchema,
        regexp: {
          pattern: `(type\\s+${pascalCaseModuleName}\\s+)` ,
          flags: "g"
        },
        replaceText: `$1implements ${implementInterfacesCode} `
      });
    } else {
      const existingImplementsString = existingImplementsMatches[1];

      if(existingImplementsString) {
        const existingInterfaces = Regex_Query.match({
          text: existingImplementsString,
          regexp: {
            pattern: "[^&^\\s]+" ,
            flags: "g"
          }
        });
  
        newSchema = Regex_Query.replace({
          text: nonNullSchema,
          regexp: {
            pattern: `(type\\s+${pascalCaseModuleName}\\s+implements\\s+)([^{^@]*)` ,
            flags: "g"
          },
          replaceText: `$1$2& ${implementInterfacesCode} `
        });
      } else {
        newSchema = Regex_Query.replace({
          text: nonNullSchema,
          regexp: {
            pattern: `(type\\s+${pascalCaseModuleName}\\s+)` ,
            flags: "g"
          },
          replaceText: `$1implements ${implementInterfacesCode} `
        });
      }
    }

    newSchema = importInterfacesCode + "\n" + newSchema;

    FS_Mutation.write({
      path: `${basePath}/${lowerCaseModuleName}/schema.graphql`,
      content: newSchema
    });
  }
}

function getValidModules(pascalCaseModuleName: string, wrapperMetadataList: WrapperMetadata[]): WrapperModule[] {
  const modules: WrapperModule[] = [];
  
  for(let i = 0; i < wrapperMetadataList.length; i++) {
    const metadata = wrapperMetadataList[i];

    const modulesOfSameName = getModulesByName(pascalCaseModuleName, wrapperMetadataList);

    if(modulesOfSameName.length === 0) {
      continue;
    } else if(modulesOfSameName.length > 1) {
      throw new Error(`Found more than one module with name: ${pascalCaseModuleName} (${metadata.uri})`);
    }

    modules.push(modulesOfSameName[0]);
  }

  return modules;
}