import { Console_Query, Regex_Query } from "../../modules/mutation/w3";
import { WrapperModule } from "../types/WrapperModule";
import { WrapperModuleMethod } from "../types/WrapperModuleMethod";

export function getModuleMetadata(moduleName: string, schema: string, namespaceName: string, wrapperUri: string): WrapperModule | null {
  const methods: WrapperModuleMethod[] = [];

  const queryBodyMatch = Regex_Query.match({
    text: schema,
    regexp: {
      pattern: `type\\s+${moduleName}\\s+[^{]*{\\s*([^}]*)\\s*}`,
      flags: null
    }
  });

  if(queryBodyMatch.length < 2) {
    Console_Query.debug({
      message: `No ${moduleName} type found in schema.graphql`
    });
    return null;
  }

  const queryBody = queryBodyMatch[1];

  const interfaceMathods = Regex_Query.match({
    text: queryBody,
    regexp: {
      pattern: "([a-zA-Z0-9_]+)\\(",
      flags: "g"
    }
  }).map<string>((x: string) => x.slice(0, x.length - 1));

  //TODO: Add support for methods without return types
  const interfaceReturnTypes = Regex_Query.match({
    text: queryBody,
    regexp: {
      pattern: "\\): [a-zA-Z0-9_!]+",
      flags: "g"
    }
  });

  for(let i = 0; i < interfaceMathods.length; i++) {
    methods.push({
      name: interfaceMathods[i],
      returnType: interfaceReturnTypes[i].slice(3, interfaceReturnTypes[i].length)
    });
  }

  return {
    name: moduleName,
    fullyQualifiedName: `${namespaceName}_${moduleName}`,
    namespaceName: namespaceName,
    wrapperUri: wrapperUri,
    methods: methods
  } as WrapperModule;
} 