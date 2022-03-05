import { JSON } from "@web3api/wasm-as";
import { addFirstLast } from "./addFirstLast";
import { schemaTypeToAssemblyScriptType } from "./mappers/schemaTypeToAssemblyScriptType";
import { schemaTypeToFromStringVar } from "./mappers/schemaTypeToFromStringVar";
import { schemaTypeToFromVar } from "./mappers/schemaTypeToFromVar";
import { solidityTypeToSchemaType } from "./mappers/solidityTypeToSchemaType";

const groupByType = (arr: JSON.Obj[]): JSON.Obj => {
  return arr.reduce((acc: JSON.Obj, item) => {
    let groupName = strOrEmpty(item, "type");
    if(groupName === "constructor") {
      groupName = "ctor";
    }

    if (!acc.get(groupName)) {
      acc.set(groupName, new JSON.Arr());
    }

    const a = acc.getArr(groupName);
    if(!a) {
      return acc;
    }
    a.push(item);

    return acc;
  }, new JSON.Obj());
};

const groupByStateMut = (arr: JSON.Obj[]): JSON.Obj => {
  return arr.reduce((acc: JSON.Obj, item) => {
    let groupName = strOrEmpty(item, "stateMutability");
    if(groupName === "constructor") {
      groupName = "ctor";
    }

    if (!acc.get(groupName)) {
      acc.set(groupName, new JSON.Arr());
    }

    const a = acc.getArr(groupName);
    if(!a) {
      return acc;
    }
    a.push(item);

    return acc;
  }, new JSON.Obj());
};


function strOrEmpty(item: JSON.Obj, name: string): string {
  const a = item.getString(name);

  if(!a) {
    return "";
  }

  return a.toString();
}

export function transform(model: JSON.Arr): JSON.Obj {
  const val = model.valueOf();

  const list: JSON.Obj[] = val.map<JSON.Obj>((x: JSON.Value) => {
    return <JSON.Obj>x;
  });

  const grouped = groupByType(list);

  const func = grouped.getArr("function");

  if(func) {
    func._arr.forEach((x: JSON.Value) => {
      const inputs = (x as JSON.Obj).getArr("inputs");

      if(!inputs) {
        return;
      }
      inputs._arr
        .map<JSON.Obj>((x: JSON.Value) => {
          return <JSON.Obj>x;
        })
        .forEach((input: JSON.Obj) => {
          const type = strOrEmpty(input, "type");
          input.set("schemaType", solidityTypeToSchemaType(type));
          const schemaType = strOrEmpty(input, "schemaType");
          const name = strOrEmpty(input, "name");

          input.set("stringParseSchemaType", schemaTypeToFromStringVar(schemaType, "result"));
          input.set("inputToString", schemaTypeToFromVar(schemaType, name, "input"));
          input.set("assemblyScriptType", schemaTypeToAssemblyScriptType(schemaType));
        });

      const outputs = (x as JSON.Obj).getArr("outputs");

        if(!outputs) {
          return;
        }
      outputs._arr
        .map<JSON.Obj>((x: JSON.Value) => {
          return <JSON.Obj>x;
        })
        .forEach((input: JSON.Obj) => {
          const type = strOrEmpty(input, "type");
          input.set("schemaType", solidityTypeToSchemaType(type));

          const schemaType = strOrEmpty(input, "schemaType");

          input.set("stringParseSchemaType", schemaTypeToFromStringVar(schemaType, "result"));
          input.set("assemblyScriptType", schemaTypeToAssemblyScriptType(schemaType));
        });
    });
    grouped.set("function", groupByStateMut(func._arr.map<JSON.Obj>((x: JSON.Value) => x as JSON.Obj)));

    addFirstLast(grouped);
  }

  return grouped;
}