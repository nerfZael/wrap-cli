# Wrapper-based CLI tools

The primary idea here is to develop CLI tools (of any kind) with Polywrap. The benefits they have over traditional CLI tools are:
- Security
    - Wrappers can not access the OS directly. They need to go through plugins which can set permissions in different ways and act as "guards" to different OS components.
    - Per plugin permissions could be implemented by modifying their configuration (e.g. Only allow current working directory for File System plugin)
    - Per wrapper permissions could be implemented by monitoring which wrapper tries to access which plugin.
    - Additional control could be implemented by mimicking tx.origin and msg.sender functionality of smart contracts
- Composability 
    - Due to the composable nature of wrappers, they can easily be reused, extend each others functionality or turned into standard interfaces for other similar tools to follow.

## Wrap CLI manager

To manage (install, update) and run these CLI tools, we can implement a "Wrap CLI manager". It can take the form of a new CLI tool or can be intergrated as part of our w3 CLI (or both). In the following examples the latter is assumed.
    
## Developer experience

The following examples are based on the need for: https://github.com/polywrap/monorepo/issues/670

### Web 2 way
Install CLI tools from diferent developers/contributors:
```
npm install @contributor1.eth/ens-cli
npm install @contributor2.eth/ipfs-cli
```
Use those tools:
```
publish-ens -u "test.eth" -hash "Qm..."
publish-ipfs
```

### Web 3 way

#### Deployed wrappers
```
ens/ens-cli.contributor1.eth
    Apps 
        publish-ens
        verify-ens
    
ens/ipfs-cli.contributor2.eth
    Apps 
        publish-ipfs
        verify-ipfs

ens/publish.polywrap.eth
    Apps
        publish
            Commands
                ens -> "ens/ens-cli.contributor1.eth" -> publish-ens
                ipfs -> "ens/ipfs-cli.contributor2.eth" -> publish-ipfs
        verify
            Commands
                ens -> "ens/ens-cli.contributor1.eth" -> verify-ens
                ipfs -> "ens/ipfs-cli.contributor2.eth" -> verify-ipfs
```

#### Usage
This installs the "publish" and "verify" apps:
```
w3 install ens/publish.polywrap.eth
```
This updates the "publish" and "verify" apps:
```
w3 update ens/publish.polywrap.eth
```
Use the "ens" command on the "publish" app:
```
w3 publish ens -u "test.eth" -hash "Qm..."
```
Use the "ipfs" command on the "publish" app:
```
w3 publish ipfs
```

#### Update all cli wrappers
```
w3 update
```

#### Install/Update specific apps

This installs only the "publish" app:
```
w3 install ens/publish.polywrap.eth -a "publish"
```
This updates only the "verify" app:
```          
w3 update ens/publish.polywrap.eth -a "verify"
```

#### Install via IPFS URI
```
w3 install ipfs/Qm...
```

Require:
- File System Plugin
    currentWorkingDirOnly = true
- HTTP Plugin
    URIs = ["http://google.com", ""]
    Method: GET
    Method: Post
y/n


### Additional features:
- Plugin permissions
    - On install/update, request access to plugins. The user can deny the request, thus aborting the installation/update if he chooses.
    - If the CLI wrapper tries accessing other plugins (for which it has not been granted access), the wrap cli manager will abort the execution.
- Plugin config/env permissions
    - While the plugin permissions approach is useful, it is also an all or nothing kind of approach. E.g. You either allow file system access to a CLI wrapper or you don't. To allow for more granularity we can implement permission requests for each setting value in the plugin config. 
        - E.g. require File System Plugin access with the setting "currentWorkingDirOnly" set to a value of true. 
        - E.g. require HTTP Plugin access with the setting "baseURI" set to a value of "http://ipfs.io".
- Plugin method permissions
- File system cache
    - The wrap cli manager will cache installed CLI wrappers in a local directory
- Local storage
    - Each CLI wrapper (or each app) will have it's own directory it can access and use for any kind of persistance required tasks.

### WIP Example CLI wrapper Schema:
```graphql=
type Mutation {
    run(command: String!)    
}

type Query {
    getAppInfo(appName: String!): AppInfo!
    getAppNames: [String!]!
    getApps: [AppInfo!]!
}

type AppInfo {
    name: String!
    description: String!
    commands: [CommandInfo!]
}

type CommandInfo {
    name: String!
    description: String
}

type ArgInfo {
    name: String!
    description: String
}
```
