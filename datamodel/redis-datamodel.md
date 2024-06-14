
# Redis data model

## Introduction


## Data model

INCR nextTenantId
INCR nextMeasurementId

app:noveltygraph.com name "Our primary website" url "https://noveltygrah.com" slug noveltygraph-com
app:dr.dk name "DR main website" url "https://dr.dk" slug dr-dk

SET app:noveltygraph.com:measurementWeight

SETX app:noveltygraph.com:measurements hostname noveltygraph.com model "model-1" method "method-1" createdDate "01-01-2024 00:00:000"
SETX app:noveltygraph.com:measurement:0-1234231432:entry:0-324321212342 measurementId 0-1234231432 hostname noveltygraph.com transferSize 10000