export function pushAll<T>(array: T[], itemsToPush: T[]): void {
  for(let i = 0; i < itemsToPush.length; i++) {
    array.push(itemsToPush[i]);
  }
}