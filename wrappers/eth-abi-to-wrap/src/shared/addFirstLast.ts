import { JSON } from "@web3api/wasm-as";

export function addFirstLast(val: JSON.Value): void {
  if(val.isArr) {
    const array = (val as JSON.Arr)._arr;
    for(let i = 0; i < array.length; i++) {
      const item: JSON.Value = array[i];
      if(!item.isObj) {
        throw new Error("Expected object");
      }

      const obj = item as JSON.Obj;
      obj.set("_first_", i === 0);
      obj.set("_last_", i === array.length - 1);

      addFirstLast(item);
    }
  } else if(val.isObj) {
    const obj = (val as JSON.Obj);

    for(let i = 0; i < obj.keys.length; i++) {
      const key = obj.keys[i];

      if(obj.has(key)) {
        const keyVal = obj.get(key);

        if(keyVal) {
          addFirstLast(keyVal);
        }
      }
    }
  }
};