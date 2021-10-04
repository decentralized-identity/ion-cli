@decentralized-identity/ion-cli
===============================

ION Command Line Interface to make working with the ION network and using ION DIDs easy peasy lemon squeezy

[![Version](https://img.shields.io/npm/v/@decentralized-identity/ion-cli.svg)](https://npmjs.org/package/@decentralized-identity/ion-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@decentralized-identity/ion-cli.svg)](https://npmjs.org/package/@decentralized-identity/ion-cli)
[![License](https://img.shields.io/npm/l/@decentralized-identity/ion-cli.svg)](https://github.com/decentralized-identity/ion-cli/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @decentralized-identity/ion-cli
$ ion COMMAND
running command...
$ ion (-v|--version|version)
@decentralized-identity/ion-cli/0.1.0 win32-x64 node-v14.17.6
$ ion --help [COMMAND]
USAGE
  $ ion COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ion help [COMMAND]`](#ion-help-command)
* [`ion new`](#ion-new)
* [`ion resolve [DID]`](#ion-resolve-did)

## `ion help [COMMAND]`

display help for ion

```
USAGE
  $ ion help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

## `ion new`

creates a new ION DID and optionally publishes and writes the key pair to a *.jwk file and the DID to a *.did file to a specified directory.

```
USAGE
  $ ion new

OPTIONS
  --help see all commands in CLI
  --curve specify the elliptic curve to use for the keys. Default is 'secp256k1'
  --publish flag indicating whether the DID should be published to the ION network. Default is false.
  --directory to which to save the files.
  --node URI of the node you desire to contact for resolution. If you are running your own node, use this to pass in your node's resolution endpoint.
```

_See code: [@oclif/plugin-help](https://github.com/decentralized-identity/ion-cli/src/commands/did/new.ts)_

## `ion resolve [DID]`

resolves the provided DID and outputs the document to the console.

```
USAGE
  $ ion resolve [DID]

ARGUMENTS
  DID  The ION identifier to resolve

OPTIONS
  --help see all commands in CLI
  --node URI of the node you desire to contact for resolution. If you are running your own node, use this to pass in your node's resolution endpoint.
```

_See code: [@oclif/plugin-help](https://github.com/decentralized-identity/ion-cli/src/commands/did/resolve.ts)_
<!-- commandsstop -->
