## Patch version
(updates 1.0.0 → 1.0.1)
```
npm version patch
```

## Minor version
(updates 1.0.0 → 1.1.0)
```
npm version minor
```

## Major version
(updates 1.0.0 → 2.0.0)
```
npm version major
```



### Create a 256-bit key 
This will be use in the .env file for the jwt tokens
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```