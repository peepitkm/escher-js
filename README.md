EscherJS - HTTP Request Signing Library [![Build Status](https://travis-ci.org/emartech/escher-js.svg?branch=master)](https://travis-ci.org/emartech/escher-js)
===================================

Escher helps you creating secure HTTP requests (for APIs) by signing HTTP(s) requests. It's both a server side and client side implementation. The status is work in progress.

The algorithm is based on [Amazon's _AWS Signature Version 4_](http://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html), but we have generalized and extended it.

More details are available at our [Escher documentation site](http://escherauth.io/).

## Development

The [Test Cases](https://github.com/EscherAuth/test-cases) are included as git submodule.

Don't forget to use the `git pull --recurse-submodules` and the `git clone --recurse-submodules` to pull and clone the remote repository.

## Modified Logs

- Changed `require('path').posix` to `require('path')` in `lib/canonicalizer.js:3` for cannot read property 'normalize' of undefined preventing
- Changed `createHash(hashAlgo)` to `createHash(hashAlgo.toLowerCase())` in `lib/utils.js:63` for SHA256 is not supported preventing
- Changed `crypto.createHmac(hashAlgo, key)` to `crypto.createHmac(hashAlgo.toLowerCase(), key)` in `lib/authhelper.js:69` for SHA256 is not supported preventing
- Added `webpack.config.js` to bundle JavaScript files for usage in a browser