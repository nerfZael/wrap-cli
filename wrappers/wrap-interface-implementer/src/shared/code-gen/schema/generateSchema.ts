import { Console_Query } from "../../../modules/mutation/w3/imported/Console_Query";
import { WrapperMetadata } from "../../types/WrapperMetadata";
import { generateModuleSchema } from "./generateModuleSchema";

export function generateSchema(basePath: string, wrapperMetadataList: WrapperMetadata[]): void {
  Console_Query.debug({
    message: `Generating schema...`
  });
  
  generateModuleSchema(basePath, "Query", "query", wrapperMetadataList);
  generateModuleSchema(basePath, "Mutation", "mutation", wrapperMetadataList);
}
