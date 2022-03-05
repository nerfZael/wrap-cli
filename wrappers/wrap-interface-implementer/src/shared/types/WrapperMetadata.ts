import { WrapperModule } from "./WrapperModule";

export class WrapperMetadata {
  uri: string;
  namespaceName: string;
  modules: WrapperModule[] = [];

  constructor(uri: string, namespaceName: string) {
    this.uri = uri;
    this.namespaceName = namespaceName;
  }
};
