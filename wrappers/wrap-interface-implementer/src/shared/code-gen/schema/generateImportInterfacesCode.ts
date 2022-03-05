import { WrapperMetadata } from "../../types/WrapperMetadata";
import { WrapperModule } from "../../types/WrapperModule";
import { getModulesByName } from "../utils/getModuleMethods";

export function generateImportInterfacesCode(
  modules: WrapperModule[]
): string {
  let code = "";

  for(let i = 0; i < modules.length; i++) {
    const module = modules[i];

    let template = `#import { ${module.name} } into ${module.namespaceName} from "${module.wrapperUri}"`;

    if(i < modules.length - 1) {
      //If not last interface, add new line
      template += "\n";
    }

    code += template;
  }

  return code;
}