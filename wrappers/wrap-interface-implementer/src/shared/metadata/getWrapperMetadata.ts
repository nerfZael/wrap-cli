import { getModuleMetadata } from "./getModuleMetadata";
import { WrapperMetadata } from "../types/WrapperMetadata";
import { WrapMetadata_Query } from "../../modules/mutation/w3";
import { pascalCase } from "../utils/pascalCase";

export function getWrapperMetadata(uri: string): WrapperMetadata | null {
  const schema = WrapMetadata_Query.getSchema({
    uri: uri
  });
  
  if(!schema) {
    //TODO: No query schema found for interface
    return null;
  }

  const nonNullSchema = schema as string;

  const metadata = new WrapperMetadata(uri, pascalCase(uri));

  const queryModule = getModuleMetadata("Query", nonNullSchema, metadata.namespaceName, metadata.uri);
  const mutationModule = getModuleMetadata("Mutation", nonNullSchema, metadata.namespaceName, metadata.uri);

  if(queryModule != null) {
    metadata.modules.push(queryModule);
  }
  if(mutationModule != null) {
    metadata.modules.push(mutationModule);
  }

  return metadata;
}