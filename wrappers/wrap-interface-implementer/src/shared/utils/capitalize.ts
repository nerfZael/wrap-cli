export function capitalize(str: string): string {
  // take first character, uppercase it
  // add the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1);
}