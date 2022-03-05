export function schemaTypeToAssemblyScriptType(type: string): string {
  if(type == "Int8") {
    return "i8";
   }
   if(type == "Int16") {
    return "i16";
   }
   if(type == "Int32") {
    return "i32";
   }
   if(type == "Boolean") {
    return "bool";
   }
   if(type == "Bytes") {
    return "Bytes";
   }
   if(type == "String") {
    return "string";
   }
   if(type == "UInt8") {
    return "u8";
   }
   if(type == "UInt16") {
    return "u16";
   }
   if(type == "UInt32") {
    return "u32";
   }
   if(type == "BigInt") {
    return "BigInt";
   }
   return "Undefined";
}