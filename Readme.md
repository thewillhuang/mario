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
$ curl -H "Content-Type: application/json" -X POST -d '{ "html": "<p>hello world</p>", "css": "color: 'red';", "filename": "output.pdf" }' https://8i6ymbqx15.execute-api.us-east-1.amazonaws.com/prod
```
