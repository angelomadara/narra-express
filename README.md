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
To create a random 256-bit key for JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, and CSRF_JWT_SECRET, you can use the following command in a Node.js environment:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```