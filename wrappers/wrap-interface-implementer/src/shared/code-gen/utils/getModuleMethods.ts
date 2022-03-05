import { WrapperMetadata } from "../../types/WrapperMetadata";
import { WrapperModule } from "../../types/WrapperModule";
import { WrapperModuleMethod } from "../../types/WrapperModuleMethod";
import { filterCompare } from "../../utils/filterCompare";

export function getModulesByName(
  pascalCaseModuleName: string, 
  wrapperMetadataList: WrapperMetadata[]
): WrapperModule[] {
  const modules: WrapperModule[] = wrapperMetadataList
    .map<WrapperModule[]>(wrapperMetadata => wrapperMetadata.modules)
    .flat();

  const modulesOfSameName: WrapperModule[] = filterCompare(modules, module => module.name, pascalCaseModuleName);

  return modulesOfSameName;
}

export function getModuleMethods(
  pascalCaseModuleName: string, 
  wrapperMetadataList: WrapperMetadata[]
): WrapperModuleMethod[] {
  const modulesOfSameName = getModulesByName(pascalCaseModuleName, wrapperMetadataList);

  const methods: WrapperModuleMethod[] = modulesOfSameName
    .map<WrapperModuleMethod[]>(module => module.methods)
    .flat();

  return methods;
}