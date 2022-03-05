import { pascalize } from "./pascalize";

export function pascalCase(str: string): string {
  const list = str.split("/");
  const nameAndDomain = list[2].split(".");
  const name = nameAndDomain[0];

  return pascalize(name);
}