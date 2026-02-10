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
