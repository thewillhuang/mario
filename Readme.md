An Apex Lambda function built using aws codebuild, running native phantom js taking html css and returns an AWS s3 url link for the user to download the files.

Install NPM dependencies:

```
$ yarn && cd functions/convert && yarn && ../..
```

Deploy the functions:

```
$ apex deploy
```

#### Supported Apis
http://phantomjs.org/api/webpage/

#### Try it out
```bash
curl -H "Content-Type: application/json" -H "Accept: application/pdf" -X POST -d '{ "html": "<p>Hello World</p>", "css": "* { color: orange; }",  "pageConfig": { "paperSize" : { "format": "A4", "orientation": "landscape" } } }' https://4bsdjq15h1.execute-api.us-east-1.amazonaws.com/prod
```

#### Example payload
```json
{
  "html": "<p>Hello World</p>",
  "css": "* { color: orange; }",
  "pageConfig": {
    "paperSize" : {
      "format": "A4",
      "orientation": "landscape"
    }
  }
}
```
