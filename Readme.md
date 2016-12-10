An Apex Lambda function built using https://github.com/lambci/lambci, running native phantom js taking html css and returns an AWS s3 url link for the user to download the files.

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
$ echo '{ "html": "<p>hello world</p>", "css": "* {color: red;}", "pageConfig": { "format": "A4", "orientation": "landscape" } }' | apex invoke convert
```

api gateway (throttled)
```
$ curl -H "Content-Type: application/json" -H "Accept: application/pdf" -X POST -d '{ "html": "<p>hello world</p>", "css": "* {color: red;}", "pageConfig": { "format": "A4", "orientation": "landscape" } }' https://8i6ymbqx15.execute-api.us-east-1.amazonaws.com/dev > ~/Desktop/output.pdf
```
