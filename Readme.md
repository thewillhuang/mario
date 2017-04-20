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

#### Limitations
- http://docs.aws.amazon.com/lambda/latest/dg/limits.html
- 2 dashboard charts is around 0.8mb, limit for payload is is 6mb, so theoretically we could print a dashboard with 13-20 dashboards depending on type (excluding images), if we really really wanted to, we could gzip -> base64 encode the content to send more.
- current implementation which is to transfer html + css to render, bypassing login auth etc. We can easily render more images if we made a webpage for lambda to view.
- delete requests on s3 are free, so implementing a TTL (time to live) lambda that triggers every day / minute / second to delete files will cost pretty much nothing https://aws.amazon.com/s3/pricing/ 1 million free / month
- because this is lambda, we can also pretty much handle all pdf generation in excess of 2000 / second.
