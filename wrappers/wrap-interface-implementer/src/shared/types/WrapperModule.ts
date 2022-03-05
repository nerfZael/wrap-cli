import { WrapperModuleMethod } from "./WrapperModuleMethod";

export class WrapperModule {
  name: string;
  fullyQualifiedName: string;
  namespaceName: string;
  wrapperUri: string;
  methods: WrapperModuleMethod[];
}
