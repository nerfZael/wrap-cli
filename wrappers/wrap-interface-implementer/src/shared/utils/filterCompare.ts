export function filterCompare<T, TProp>(array: T[], selector: (item: T) => TProp, compareProp: TProp): T[] {
  const filteredArray: T[] = [];
  for(let i = 0; i < array.length; i++) {
    if(selector(array[i]) === compareProp) {
      filteredArray.push(array[i]);
    }
  }

  return filteredArray;
}
