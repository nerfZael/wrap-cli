import * as awilix from "awilix";
import { NameAndRegistrationPair } from "awilix";
import { WrappersConfig } from "../config/WrappersConfig";
import { EthersConfig } from "../config/EthersConfig";
import { ethereumPlugin, EthereumProvider } from '@web3api/ethereum-plugin-js';
import { Client, Plugin, PluginModules, PluginRegistration, Web3ApiClient } from "@web3api/client-js";
import * as Mustache from "mustache";
import path from "path";
import fs from "fs";
import { Wallet } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers";

export const buildDependencyContainer = async(
  extensionsAndOverrides?: NameAndRegistrationPair<unknown>
): Promise<awilix.AwilixContainer<any>> => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    wrappersConfig: awilix.asClass(WrappersConfig).singleton(),
    ethersConfig: awilix.asClass(EthersConfig).singleton(),
    polywrapClient: awilix.asFunction(({ethersConfig}) => {

      const fsPlugin = () => {
        class MockPlugin extends Plugin {
          getModules(_client: Client): PluginModules {
            return {
              mutation: {
                write: async (input, client) => {
                  const filePath = sanitizePath(input.path as string); 

                  fs.mkdirSync(path.dirname(filePath), { recursive: true });
                  fs.writeFileSync(filePath, input.content as string, { encoding: "utf-8" });
                  console.log(`Write file: ${path.relative(process.cwd(), filePath)}`);
                  return true;
                },
                createDir: async (input, client) => {
                  const cwd = process.cwd();
                  
                  let dirPath;

                  if((input.path as string).startsWith(cwd)) {
                    dirPath = path.resolve((input.path as string));
                  }
                  
                  dirPath = path.resolve(path.join(cwd, input.path as string));
                  
                  if(!dirPath.startsWith(cwd)) {
                    throw new Error(`Directory path ${dirPath} is not in the current working directory ${cwd}`);
                  }

                  fs.mkdirSync(dirPath, { recursive: true });
                  console.log(`Create directory: ${path.relative(process.cwd(), dirPath)}`);
                  return true;
                },
                
              },
              query: {
                read: async (input, client) => {
                  const filePath = sanitizePath(input.path as string); 

                  console.log(`Read file: ${filePath}`);
                  
                  if(!fs.existsSync(filePath)) {
                    return undefined;
                  }

                  const content = fs.readFileSync(filePath, { encoding: "utf-8" });

                  return content;
                },
                readDirAsJson: async (input, client) => {
                  const dirPath = sanitizePath(input.path as string); 

                  const items = readDir(dirPath);

                  console.log(`Read directory: ${path.relative(process.cwd(), dirPath)}`);
                  return JSON.stringify(items);
                },
                getName: async (input, client) => {
                  return path.basename(input.path as string);
                },
              },
            };
          }
        }
    
        return {
          factory: () => new MockPlugin(),
          manifest: {
            schema: ``,
            implements: [],
          },
        };
      };

      const mustachePlugin = () => {
        class MockPlugin extends Plugin {
          getModules(_client: Client): PluginModules {
            return {
              query: {
                render: async (input: any, client) => {
                  return Mustache.render(input.template, JSON.parse(input.model));
                },
              },
            };
          }
        }
    
        return {
          factory: () => new MockPlugin(),
          manifest: {
            schema: ``,
            implements: [],
          },
        };
      };

      const metadataPlugin = () => {
        class MockPlugin extends Plugin {
          getModules(_client: Client): PluginModules {
            return {
              query: {
                getSchema: async (input: any, client) => {
                  return await client.getSchema(input.uri, {});
                },
              },
            };
          }
        }
    
        return {
          factory: () => new MockPlugin(),
          manifest: {
            schema: ``,
            implements: [],
          },
        };
      };

      const regexPlugin = () => {
        class MockPlugin extends Plugin {
          getModules(_client: Client): PluginModules {
            return {
              query: {
                exec: async (input: any, client) => {
                  return new RegExp(input.regexp.pattern, input.regexp.flags ?? undefined ).exec(input.text);
                },
                match: async (input: any, client) => {
                  return input.text.match(new RegExp(input.regexp.pattern, input.regexp.flags ?? undefined));
                },
                replace: async (input: any, client) => {
                  return input.text.replace(new RegExp(input.regexp.pattern, input.regexp.flags ?? undefined), input.replaceText);
                },
              },
            };
          }
        }
    
        return {
          factory: () => new MockPlugin(),
          manifest: {
            schema: ``,
            implements: [],
          },
        };
      };
    
      const wallet = new Wallet("7732a81a56a9663dbf8118aa82bed8aa107d63f46883f9629884ba7ffe1678f6", new JsonRpcProvider( ethersConfig.providerNetwork));
      const plugins: PluginRegistration[] = [
        {
          uri: 'ens/ethereum.web3api.eth',
          plugin: ethereumPlugin({
            networks: {
              ropsten: {
                provider: (wallet.provider as unknown) as EthereumProvider,
                signer: wallet,
              }
            },
          }),
        },
        {
          uri: 'ens/rinkeby/wrap-fs.eth',
          plugin: fsPlugin()
        },
        {
          uri: 'ens/rinkeby/wrap-mustache.eth',
          plugin: mustachePlugin()
        },
        {
          uri: 'ens/rinkeby/wrap-metadata.eth',
          plugin: metadataPlugin()
        },
        {
          uri: 'ens/rinkeby/wrap-regex.eth',
          plugin: regexPlugin()
        }
      ];
    
      return new Web3ApiClient({ plugins, envs: [{
        uri: "ens/ipfs.web3api.eth",
        common: {
          disableParallelRequests: false
        }
      } ]});
    }).singleton(),
    ...extensionsAndOverrides,
  });

  return container;
};

export const sanitizePath = (pathToSanitize: string): string => {
  const cwd = process.cwd();
  let sanizitizedPath;;

  if(pathToSanitize.startsWith(cwd)) {
    sanizitizedPath = path.resolve(pathToSanitize);
  }
  else {
    sanizitizedPath = path.resolve(path.join(cwd, pathToSanitize));
  }

  if(!sanizitizedPath.startsWith(cwd)) {
    throw new Error(`Path ${sanizitizedPath} is not in the current working directory ${cwd}`);
  }

  return sanizitizedPath;
};

export const readDir = function(dirPath: string) {
  const items: DirectoryItem[] = [];

  const filesAndDirs = fs.readdirSync(dirPath);

  for(const item of filesAndDirs) {
    const itemPath = path.join(dirPath, item);

    const isDir = fs.statSync(itemPath).isDirectory();

    items.push({
      absolutePath: itemPath,
      relativePath: path.relative(dirPath, itemPath),
      isDir,
      contents: isDir 
        ? readDir(itemPath)
        : [],
    });
  }
  
  return items;
}

export type DirectoryItem = {
  absolutePath: string;
  relativePath: string;
  isDir: boolean;
  contents: DirectoryItem[];
}