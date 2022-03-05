export function solidityTypeToSchemaType(type: string): string {
  if(type == "int8") {
    return "Int8";
   }
   if(type == "int16") {
    return "Int16";
   }
   if(type == "int32") {
    return "Int32";
   }
   if(type == "int") {
    return "BigInt";
   }
   if(type == "bool") {
    return "Boolean";
   }
   if(type == "bytes") {
    return "Bytes";
   }
   if(type == "bytes32") {
    return "String";
   }
   if(type == "string") {
    return "String";
   }
   if(type == "address") {
    return "String";
   }
   if(type == "uint8") {
    return "UInt8";
   }
   if(type == "uint16") {
    return "UInt16";
   }
   if(type == "uint32") {
    return "UInt32";
   }
   if(type == "uint64") {
    return "BigInt";
   }
   if(type == "uint128") {
    return "BigInt";
   }
   if(type == "uint256") {
    return "BigInt";
   }
   return "Undefined";
}