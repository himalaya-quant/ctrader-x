# 0.0.6:WIP

Fix heartbeat

# 0.0.5

Adds subscribeToLiveTrendBars:
Gives the ability to subscribe to live price data, given a timeframe and a
symbolId. Returns an RxJs Observable the can be subscribed to and receive
realtime updates. Still missing unsubscribe feature.

# 0.0.4

Casting symbolsIds to strings and assigning missing ctidTraderAccountId to
ProtoOASymbolByIdReq request payload

# 0.0.3

Now the getSymbolsList will return the full symbols properties lists.
This is achieved by internally calling the `getSymbolsDetails` method, after we
receive the `ProtoOALightSymbol` array, and merging the results of the
`ProtoOALightSymbol` and the `ProtoOASymbol`.

# 0.0.2

Adds symbols manager, responsible for:

- getting symbols list

Better code organization.

# 0.0.1

Basic authentication. Based on:
CTID_TRADER_ACCOUNT_ID
ACCESS_TOKEN
CLIENT_SECRET
CLIENT_ID
