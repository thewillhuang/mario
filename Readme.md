
Install NPM dependencies:

```
$ yarn
```

Deploy the functions:

```
$ apex deploy
```

Try it out:

native modules on lambda
```
$ echo '{ "html": "<p>hello world</p>", "css": "color: 'red';", "filename": "output.pdf" }' | apex invoke convert
```

api gateway (throttled)
```
$ curl -H "Content-Type: application/json" -X POST -d '{ "password": "hello" }' https://93fw7d2uui.execute-api.us-east-1.amazonaws.com/prod
```
