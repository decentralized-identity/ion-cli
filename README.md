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
@decentralized-identity/ion-cli/0.2.0 win32-x64 node-v14.17.6
$ ion --help [COMMAND]
USAGE
  $ ion COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ion help [COMMAND]`](#ion-help-command)
* [`ion new NAME`](#ion-new-name)
* [`ion resolve DID`](#ion-resolve-did)
* [`ion sign PAYLOAD FRIENDLYNAME`](#ion-sign-payload-friendlyname)
* [`ion verify JWS FRIENDLYNAME [PAYLOAD]`](#ion-verify-jws-friendlyname-payload)

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

## `ion new NAME`

Creates a new ION DID, optionally publishes to the network and writes the private key a *.jwk file and the DID to a *.json file.

```
USAGE
  $ ion new NAME

ARGUMENTS
  NAME  name for the new DID. Name should not include spaces or special characters.

OPTIONS
  -c, --curve=(secp256k1|Ed25519)  [default: secp256k1] specify the elliptic curve to use for the keys.
  -d, --directory=directory        to which to save the *jwk and *.json files.
  -h, --help                       show CLI help
  -k, --kid=kid                    [default: key-1]  for the key pair

  -n, --node=node                  URI of the node you desire to contact for resolution. If you are running your own
                                   node, use this to pass in your node's resolution endpoint.

  -p, --publish                    flag indicating whether the DID should be published to the ION network. Default is
                                   false.

EXAMPLES
  $ ion new FriendlyName
  $ ion new FriendlyName -d d:/dids
  $ ion new FriendlyName -d d:/dids -c secp256k1
  $ ion new FriendlyName -d d:/dids -c secp256k1 -p
  $ ion new FriendlyName -d d:/dids -c secp256k1 -p -n https://node.local/1.0/identifiers/ 
  $ ion new FriendlyName -d d:/dids -c secp256k1 -p -n https://node.local/1.0/identifiers/ -k key-1
```

_See code: [src/commands/new.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.2.0/src/commands/new.ts)_

## `ion resolve DID`

Resolves the provided DID and outputs the document to the console.

```
USAGE
  $ ion resolve DID

ARGUMENTS
  DID  The DID to resolve

OPTIONS
  -h, --help       show CLI help

  -n, --node=node  URI of the node you desire to contact for resolution. If you are running your own node, use this to
                   pass in your node's resolution endpoint.

EXAMPLE
  $ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw
```

_See code: [src/commands/resolve.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.2.0/src/commands/resolve.ts)_

## `ion sign PAYLOAD FRIENDLYNAME`

Sign payload using the private key associated with the specified DID.

```
USAGE
  $ ion sign PAYLOAD FRIENDLYNAME

ARGUMENTS
  PAYLOAD       to sign
  FRIENDLYNAME  of the DID to use to sign the payload

OPTIONS
  -d, --directory=directory  (required) from which to read DID and key.
  -h, --help                 show CLI help
  -k, --kid=kid              [default: key-1]  of the private key to use for signing.
  -s, --detached             flag indicating a payload-detached JWS should be output. Default is false.

EXAMPLES
  $ ion sign 'Hello World' FriendlyName -d d:/dids
  $ ion sign 'Hello World' FriendlyName -d d:/dids -k 'key-1'
  $ ion sign 'Hello World' FriendlyName -d d:/dids -k 'key-1' -s
  $ ion sign 'Hello World' FriendlyName -d d:/dids -k 'key-1' -s -n https://node.local/1.0/identifiers/
```

_See code: [src/commands/sign.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.2.0/src/commands/sign.ts)_

## `ion verify JWS FRIENDLYNAME [PAYLOAD]`

Sign payload using the private key associated with the specified DID.

```
USAGE
  $ ion verify JWS FRIENDLYNAME [PAYLOAD]

ARGUMENTS
  JWS           signature to verify.
  FRIENDLYNAME  of the DID to use to verify the signature
  PAYLOAD       when verifying a payload-detached JWS

OPTIONS
  -d, --directory=directory  (required) from which to read DID and key.
  -h, --help                 show CLI help
  -s, --detached             flag indicating a payload-detached JWS should be output. Default is false.

EXAMPLES
  $ ion verify 
  '2tleS0xIiwiYWxnIjoiRVMyNTZLIn0.ImhlbGxvIHdvcmxkIg.D7kXXnQmtSw1WX1RCW3IzA6T5-qivSOL2_6RVydIo1Z_wXKO00GEUl2xjwvRpHlr4B7
  jBy1_PZenCNP9_mWx1Q' FriendlyName -d d:/dids
  $ ion verify 
  '2tleS0xIiwiYWxnIjoiRVMyNTZLIn0.ImhlbGxvIHdvcmxkIg.D7kXXnQmtSw1WX1RCW3IzA6T5-qivSOL2_6RVydIo1Z_wXKO00GEUl2xjwvRpHlr4B7
  jBy1_PZenCNP9_mWx1Q' FriendlyName -d d:/dids
  $ ion verify 
  '2tleS0xIiwiYWxnIjoiRVMyNTZLIn0..D7kXXnQmtSw1WX1RCW3IzA6T5-qivSOL2_6RVydIo1Z_wXKO00GEUl2xjwvRpHlr4B7jBy1_PZenCNP9_mWx1
  Q' FriendlyName 'hello world' -d d:/dids
```

_See code: [src/commands/verify.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.2.0/src/commands/verify.ts)_
<!-- commandsstop -->
