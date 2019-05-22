## backend app for razorgrip 

##### Activate app :
    npm i
    node index.js
##### Project Structure :
```
1. koa.js.
2. mongo db.
3. mongoose as ORM.
4. routing via koa router
```
##### Endpoints :

1. /testConnection : client test connection with server.
2. /fetch-words : fetch works from 'http://api.datamuse.com/words', don't sent data to client.
3. /tweet-report : send report to client about what app has in Mongo. the count of words.
4. /fetchWordsFromMongo : send all words from Mongo to client.
5. /deleteAll : delete all Mongo docs.
    


