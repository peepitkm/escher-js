EscherJS - HTTP Request Signing Library [![Build Status](https://travis-ci.org/emartech/escher-js.svg?branch=master)](https://travis-ci.org/emartech/escher-js)
===================================

Escher helps you creating secure HTTP requests (for APIs) by signing HTTP(s) requests. It's both a server side and client side implementation. The status is work in progress.

The algorithm is based on [Amazon's _AWS Signature Version 4_](http://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html), but we have generalized and extended it.

More details are available at our [Escher documentation site](http://escherauth.io/).

## Signing a GET/POST request

Escher works by calculating a cryptographic signature of your request, and adding it (and other authentication information) to said request.
Usually you will want to add the authentication information to the request by appending extra headers to it.
Let's say you want to send a signed GET/POST request to http://example.com/ using the jQuery.ajax() library:

### Dependencies
- jQuery Library as `<script src="jquery.min.js"></script>`
- Escher Library in `dist` folder as `<script src="dist/escher.min.js"></script>`

### Pre-Config

```js
var config = {
    algoPrefix: 'AWS4', // or `YOU4`
    vendorKey: 'AWS', // or `YOU`
    hashAlgo: 'SHA256',
    credentialScope: 'aws_request', // or `your_request`
    authHeaderName: 'Authorization', // or `X-YOUR-Auth`
    dateHeaderName: 'X-Amz-Date', // or `X-YOUR-Date`
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    apiSecret: 'YOUR_SECRET'
};
```

### GET Request

```js
var host = 'example.com';
var url = '/path';
var method = 'GET';

var body = '';

var headersToSign = ['Authorization','X-Amz-Date'];

var requestOptions = {
    host: host,
    method: method,
    url: url,
    headers: [['host', host]]
};

var signRequest = Escher.create(config).signRequest(requestOptions, body, headersToSign);

var headers = {};
signRequest.headers.forEach(function(header){
    let key = header[0];
    headers[key] = header[1];
});

$.ajax({
    url: 'https://' + host + url,
    type: method,
    headers: headers,
    dataType: 'json',
    success: function (data) {
        console.info(data);
    }
});

```

### POST Request

```js
var host = 'example.com';
var url = '/path';
var method = 'POST';

var body = JSON.stringify({
    'this_is': 'a_request_body'
});
var headersToSign = ['Authorization','X-Amz-Date'];

var requestOptions = {
    host: host,
    method: method,
    url: url,
    headers: [['host', host]]
};

var signRequest = Escher.create(config).signRequest(requestOptions, body, headersToSign);

var headers = {};
signRequest.headers.forEach(function(header){
    let key = header[0];
    headers[key] = header[1];
});

$.ajax({
    url: 'https://' + host + url,
    type: method,
    headers: headers,
    data: body,
    dataType: 'json',
    success: function (data) {
        console.info(data);
    }
});
```

## Presigning an URL

In some cases you may want to send authenticated requests from a context where you cannot modify the request headers, e.g. when embedding an API generated iframe.
You can however generate a presigned URL, where the authentication information is added to the query string.

```js
var url = 'https://example.com/path';
var expires = 300;

var preSignUrl = Escher.create(config).preSignUrl(url, expires);
```

## Validating a request

You can validate a request signed by the methods described above. For that you will need a database of the access keys and secrets of your clients.
Escher accepts any kind of object as a key database that implements the ArrayAccess interface. (It also accepts plain arrays)

```js
var requestObject = {
    host: host,
    method: method,
    url: url,
    body: body
    ...
};

var keys = {
    'ACCESS_KEY_OF_CLIENT_1'  => 'SECRET OF CLIENT 1',
    'ACCESS_KEY_OF_CLIENT_2' => 'SECRET OF CLIENT 2',
};

var mandatorySignedHeaders = ['Authorization','X-Amz-Date'];

try {
    var authenticate = Escher.create(config).authenticate(requestObject, keys, mandatorySignedHeaders);
} catch(err) {
    console.err(err.message);
}
```

## Development

The [Test Cases](https://github.com/EscherAuth/test-cases) are included as git submodule.

Don't forget to use the `git pull --recurse-submodules` and the `git clone --recurse-submodules` to pull and clone the remote repository.

## Modified Logs

- Changed `require('path').posix` to `require('path')` in `lib/canonicalizer.js:3` for cannot read property 'normalize' of undefined preventing
- Changed `createHash(hashAlgo)` to `createHash(hashAlgo.toLowerCase())` in `lib/utils.js:63` for SHA256 is not supported preventing
- Changed `crypto.createHmac(hashAlgo, key)` to `crypto.createHmac(hashAlgo.toLowerCase(), key)` in `lib/authhelper.js:69` for SHA256 is not supported preventing
- Added `webpack.config.js` to bundle JavaScript files for usage in a browser