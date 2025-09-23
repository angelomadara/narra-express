node scrape.js


### Create a 256-bit key 
This will be use in the .env file for the jwt tokens
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```