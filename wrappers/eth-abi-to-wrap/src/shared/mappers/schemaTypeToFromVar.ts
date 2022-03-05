
export function schemaTypeToFromVar(type: string, name: string, varName: string): string {
  if(type == "Int8") {
    return `${varName}.${name}.toString()`;
  }
  if(type == "Int16") {
  return `${varName}.${name}.toString()`;
  }
  if(type == "Int32") {
  return `${varName}.${name}.toString()`;
  }
  if(type == "Boolean") {
  return `${varName}.${name}.toString()`;
  }
  if(type == "Bytes") {
  return `${varName}.${name}.toString()`;
  }
  if(type == "String") {
  return `${varName}.${name}`;
  }
  if(type == "UInt8") {
  return `${varName}.${name}.toString()`;
  }
  if(type == "UInt16") {
  return `${varName}.${name}.toString()`;
  }
  if(type == "UInt32") {
  return `${varName}.${name}.toString()`;
  }
  if(type == "BigInt") {
  return `${varName}.${name}.toString()`;
  }
    
  return "Undefined";
}