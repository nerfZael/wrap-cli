import { capitalize } from "./capitalize";

export function pascalize(str: string): string {
  // splitting words by dash
  const words = str.split("-");
  // use capitalize function to capitalize every word
  const capitalized = words.map<string>(word => capitalize(word));
  // glue up words with .join()
  return capitalized.join("");
}