import { WrapperMetadata } from "../../types/WrapperMetadata";
import { generateAssemblyscriptModule } from "./generateAssemblyscriptModule";

export function generateAssemblyscript(basePath: string, wrapperMetadataList: WrapperMetadata[]): void {
  generateAssemblyscriptModule(basePath, "Query", "query", wrapperMetadataList);
  generateAssemblyscriptModule(basePath, "Mutation", "mutation", wrapperMetadataList);
}