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
@decentralized-identity/ion-cli/0.3.4 win32-x64 node-v14.17.6
$ ion --help [COMMAND]
USAGE
  $ ion COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ion cache:clear`](#ion-cacheclear)
* [`ion cache:list`](#ion-cachelist)
* [`ion help [COMMAND]`](#ion-help-command)
* [`ion key:new [KID]`](#ion-keynew-kid)
* [`ion key:public JWK`](#ion-keypublic-jwk)
* [`ion load NAME`](#ion-load-name)
* [`ion new NAME`](#ion-new-name)
* [`ion operation:create KEY [SERVICES]`](#ion-operationcreate-key-services)
* [`ion publish [INITIALSTATE]`](#ion-publish-initialstate)
* [`ion resolve DID`](#ion-resolve-did)
* [`ion sign PAYLOAD FRIENDLYNAME`](#ion-sign-payload-friendlyname)
* [`ion verify JWS DOCUMENT [PAYLOAD]`](#ion-verify-jws-document-payload)

## `ion cache:clear`

Clears the DID cache, removing all previously resolved DIDs.

```
USAGE
  $ ion cache:clear

OPTIONS
  -d, --directory=directory  (required) that contains the cache. Defaults to environment variable DID_PATH if set.
  -h, --help                 show CLI help

EXAMPLE
  $ ion cache:clear -d d:dids
```

_See code: [src/commands/cache/clear.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/cache/clear.ts)_

## `ion cache:list`

Lists the cached DIDs.

```
USAGE
  $ ion cache:list

OPTIONS
  -d, --directory=directory  (required) that contains the cache. Defaults to environment variable DID_PATH if set.
  -h, --help                 show CLI help
  -x, --extended             show extra columns
  --columns=columns          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --filter=filter            filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=csv|json|yaml     output in a more machine friendly format
  --sort=sort                property to sort by (prepend '-' for descending)

EXAMPLE
  $ ion cache:list -d d:dids
```

_See code: [src/commands/cache/list.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/cache/list.ts)_

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

## `ion key:new [KID]`

Creates a new elliptic curve key for the specified curve, returning a JSON serialized and optionally escaped representation.

```
USAGE
  $ ion key:new [KID]

ARGUMENTS
  KID  [default: key-1] identifier for the key (kid).

OPTIONS
  -h, --help                   show CLI help
  --curve=(secp256k1|Ed25519)  [default: secp256k1] specifies the elliptic curve to use for the keys.

  --escape                     specifies that the output JSON string should be escaped. Use this when using the output
                               as input to another command.

EXAMPLES
  $ ion key:new key-1
  $ ion key:new key-1 --curve secp256k1
  $ ion key:new key-1 --curve secp256k1 --escape
```

_See code: [src/commands/key/new.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/key/new.ts)_

## `ion key:public JWK`

Returns the public key JWK.

```
USAGE
  $ ion key:public JWK

ARGUMENTS
  JWK  an escaped JSON string containing the private key jwk.

OPTIONS
  -h, --help  show CLI help

  --escape    specifies that the output JSON string should be escaped. Use this when using the output as input to
              another command.

EXAMPLES
  $ ion key:public {ESCAPED JSON STRING}
  $ ion key:public {ESCAPED JSON STRING} --escape
```

_See code: [src/commands/key/public.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/key/public.ts)_

## `ion load NAME`

Loads a DID from the directory using the friendly name.

```
USAGE
  $ ion load NAME

ARGUMENTS
  NAME  name for the new DID. Name should not include spaces or special characters.

OPTIONS
  -d, --directory=directory       (required) to which the DID should be saved. Defaults to environment variable DID_PATH
                                  if set.

  -h, --help                      show CLI help

  --escape                        specifies that the output JSON string should be escaped. Use this when using the
                                  output as input to another command.

  --what=(All|InitialState|Keys)  [default: All] specify the objects from the specified package to load.

EXAMPLES
  $ ion load FriendlyName
  $ ion load FriendlyName -d d:/dids
  $ ion load FriendlyName -d d:/dids --escape
```

_See code: [src/commands/load.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/load.ts)_

## `ion new NAME`

Creates a new ION DID with either defaults or the specified input.

```
USAGE
  $ ion new NAME

ARGUMENTS
  NAME  name for the new DID. Name should not include spaces or special characters.

OPTIONS
  -c, --curve=(secp256k1|Ed25519)  [default: secp256k1] specify the elliptic curve to use for the keys.

  -d, --directory=directory        to which the DID package should be saved. Defaults to environment variable DID_PATH
                                   if set.

  -h, --help                       show CLI help

  --escape                         specifies that the output JSON string should be escaped. Use this when using the
                                   output as input to another command.

  --input=input                    specifies the input to use when generating the ION DID.

  --jwk=jwk                        specifies the private key for the DID.

  --kid=kid                        [default: key-1]  for the key pair.

EXAMPLES
  $ ion new FriendlyName
  $ ion new FriendlyName -d d:/dids
  $ ion new FriendlyName -d d:/dids --curve secp256k1 --kid key-1
  $ ion new FriendlyName -d d:/dids --input {ESCAPED JSON STRING} --jwk {ESCAPED PRIVATE KEY JWK}
```

_See code: [src/commands/new.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/new.ts)_

## `ion operation:create KEY [SERVICES]`

Creates a payload for generating a new ION DID.

```
USAGE
  $ ion operation:create KEY [SERVICES]

ARGUMENTS
  KEY       specifies the public key to use for the create operation.
  SERVICES  specifies any services to be included in the create operation.

OPTIONS
  -h, --help  show CLI help

  --escape    specifies that the output JSON string should be escaped. Use this when using the output as input to
              another command.

EXAMPLES
  $ ion operation:create {ESCAPED KEY}
  $ ion operation:create {ESCAPED KEY} {ESCAPED SERVICES} --escape
```

_See code: [src/commands/operation/create.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/operation/create.ts)_

## `ion publish [INITIALSTATE]`

Publishes the specified DID to the ION network.

```
USAGE
  $ ion publish [INITIALSTATE]

ARGUMENTS
  INITIALSTATE  the initial state of the DID being published.

OPTIONS
  -d, --directory=directory    to which the DID should be saved. Defaults to environment variable DID_PATH if set.
  -h, --help                   show CLI help
  --friendlyName=friendlyName  specifies the friendly name of the DID to load and publish.

EXAMPLE
  $ ion publish {ESCAPED INITIAL STATE} --friendlyName={FRIENDLY_NAME}
```

_See code: [src/commands/publish.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/publish.ts)_

## `ion resolve DID`

Resolves the provided DID and outputs the document to the console, optionally caching the DID state.

```
USAGE
  $ ion resolve DID

ARGUMENTS
  DID  The DID to resolve

OPTIONS
  -d, --directory=directory  to which the DID package should be saved. Defaults to environment variable DID_PATH if set.
  -h, --help                 show CLI help

  --cache                    specifies that the resolved document should be cached in the specified directory and if
                             cached read from the directory.

  --cacheTtl=cacheTtl        [default: 86400] specifies the time to live (ttl) for a cached document in in seconds.

  --escape                   specifies that the output JSON string should be escaped. Use this when using the output as
                             input to another command.

  --name=name                URI of the node you desire to contact for resolution. If you are running your own node, use
                             this to pass in your node's resolution endpoint.

  --node=node                URI of the node you desire to contact for resolution. If you are running your own node, use
                             this to pass in your node's resolution endpoint.

EXAMPLES
  $ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw
  $ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw --node https://some.node --escape
  $ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw --node https://some.node --cache
  $ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw --node https://some.node --cache --cacheTtl 60 
  --name SomeDID
```

_See code: [src/commands/resolve.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/resolve.ts)_

## `ion sign PAYLOAD FRIENDLYNAME`

Sign payload using the private key associated with the specified DID.

```
USAGE
  $ ion sign PAYLOAD FRIENDLYNAME

ARGUMENTS
  PAYLOAD       to sign
  FRIENDLYNAME  of the DID to use to sign the payload

OPTIONS
  -d, --directory=directory  (required) from which to read DID and key. Defaults to environment variable DID_PATH if
                             set.

  -h, --help                 show CLI help

  -k, --kid=kid              [default: key-1]  of the private key to use for signing.

  -s, --detached             flag indicating a payload-detached JWS should be output. Default is false.

EXAMPLES
  $ ion sign 'Hello World' FriendlyName -d d:/dids
  $ ion sign 'Hello World' FriendlyName -d d:/dids -k 'key-1'
  $ ion sign 'Hello World' FriendlyName -d d:/dids -k 'key-1' -s
  $ ion sign 'Hello World' FriendlyName -d d:/dids -k 'key-1' -s -n https://node.local/1.0/identifiers/
```

_See code: [src/commands/sign.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/sign.ts)_

## `ion verify JWS DOCUMENT [PAYLOAD]`

Verify payload using the private key associated with the specified DID.

```
USAGE
  $ ion verify JWS DOCUMENT [PAYLOAD]

ARGUMENTS
  JWS       signature to verify.
  DOCUMENT  the escaped DID document of the entity that signed the payload.
  PAYLOAD   when verifying a payload-detached JWS

OPTIONS
  -h, --help  show CLI help
  --kid=kid   identifier of the public key to use for verifying.

EXAMPLE
  $ ion verify 
  '2tleS0xIiwiYWxnIjoiRVMyNTZLIn0..D7kXXnQmtSw1WX1RCW3IzA6T5-qivSOL2_6RVydIo1Z_wXKO00GEUl2xjwvRpHlr4B7jBy1_PZenCNP9_mWx1
  Q' '{ESCAPED DID DOCUMENT}' 'hello world' -k '#key-1'
```

_See code: [src/commands/verify.ts](https://github.com/decentralized-identity/ion-cli/blob/v0.3.4/src/commands/verify.ts)_
<!-- commandsstop -->
