# cTraderX

A typescript implementation of the cTrader API.
Strongly typed and easy to use.

Strictly follows the documentation provided by Spotware for the messages and
payloads definition. You can find the full specification at:
[Spotware Messages specification](help.ctrader.com/open-api/messages)

Under the hood the `cTraderX` uses ProtoBuffer messages for communicating with
the cTrader API. But to the end user the procedure is completely abstracted
behind an intuitive and easy to use interface.

# Features

- Basic authentication (still does not support automatic flow)
- Symbols information fetching
- Symbols historical bars fetching
- Symbol live bars updates subscription

# Getting started

Install the package:

```sh
npm i @himalaya-quant/ctrader-x
```

Import the client and instantiate it:

```ts
import { cTraderX } from '@himalaya-quant/ctrader-x';

const client = new cTraderX({
    // by default cTraderX tries to read the credentials from env
    // see Authentication section for more information.
    // optional configuration options:

    // live?: boolean;
    // clientId?: string;
    // clientSecret?: string;
    // accessToken?: string;
    // ctidTraderAccountId?: number;
    // logger?: ILogger;
});

await client.connect();
console.log('connected!');

const symbolsList = await client.symbols.getSymbolsList();
console.log(symbolsList);
```

### Examples:

For more examples, see the `src/examples` folder where you can find examples about:

- authentication
- get symbols list & info
- get symbol bars
- subscribe to live bars

And other examples that might come in the future.


# Authentication

In order to use any of the client methods, you'll need to provide credentials
to be used for the application and user authentication.

These credentials can be provided during the `cTraderX` client instantiation or
via .env config:

```
CTRADERX_SPOTWARE_CTID_TRADER_ACCOUNT_ID
CTRADERX_SPOTWARE_ACCESS_TOKEN
CTRADERX_SPOTWARE_CLIENT_SECRET
CTRADERX_SPOTWARE_CLIENT_ID
```

# Logging

cTraderX uses a basic logger implementation, that for simplicity sake relies on
the console logger.

You can toggle debug logs on and off via env variable:

```
CTRADERX_DEBUG_LOGS
```

Or you can provide your own logger implementation by implementing the `ILogger`
interface, and providing it during `cTraderX` client instantiation.

<br/>
<br/>
<p align="center">Developed with ❤️ by Caius Citiriga</p>