## CORS
CORS is enabled to all of the routes
``` 
app.use(cors(corsOptions));
```
if we want to enable it for a specific route, remove or disable the `app.use(cors(corsOptions))` inside the `server.ts` and add it in every route
```
app.get('/products/:id', cors(corsOptions), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for a Single Route'})
})
```
or just put this on the router file
```
router.use(cors(strictCorsOptions));
```