export function schemaTypeToFromStringVar(type: string, varName: string): string {
  if(type == "Int8") {
    return `parseInt(${varName}) as i8`;
   }
   if(type == "Int16") {
    return `parseInt(${varName}) as i16`;
   }
   if(type == "Int32") {
    return `parseInt(${varName}) as i32`;
   }
   if(type == "String") {
    return `${varName}`;
   }
   if(type == "UInt8") {
    return `parseInt(${varName}) as u8`;
   }
   if(type == "UInt16") {
    return `parseInt(${varName}) as u16`;
   }
   if(type == "UInt32") {
    return `parseInt(${varName}) as u32`;
   }
   if(type == "BigInt") {
    return `BigInt.fromString(${varName})`;
   }

   return "Undefined";
}