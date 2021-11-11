# Strapi all in one AWS S3 provider

## Configurations

Your configuration is passed down to the provider. (e.g: `new AWS.S3(config)`). You can see the complete list of options [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property)

See the [using a provider](https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#using-a-provider) documentation for information on installing and using a provider. And see the [environment variables](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#environment-variables) for setting and using environment variables in your configs.

## Example

### Without ClamAV

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
  provider: 'aws-s3-aio',
   providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env('AWS_REGION'),
      params: {
        Bucket: env('AWS_BUCKET_NAME'),
      },
      cdn: env('AWS_CLOUDFRONT'), // if not given it will not use cloudfront
      acl: 'private' // change to 'public-read' to use it with public open buckets, private will allow uploads with non public uploads
  },
  // ...
});
```

### With CLAMAV

```js
// ...
upload: {
    provider: 'clamav-proxy',
    providerOptions: {
      uploadProvider: 'strapi-provider-upload-aws-s3-aio',
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env('AWS_REGION'),
      params: {
        Bucket: env('AWS_BUCKET_NAME'),
      },
      clamav: {
        host: env('CLAMAV_HOST', '127.0.0.1'),
        port: env('CLAMAV_PORT', 3310),
        timeout: env('CLAMAV_TIMEOUT', 3000),
      },
    },
  },
```

## Required AWS Policy Actions

These are the minimum amount of permissions needed for this provider to work.

```json
"Action": [
  "s3:PutObject",
  "s3:GetObject",
  "s3:ListBucket",
  "s3:DeleteObject",
  "s3:PutObjectAcl"
],
```

## Links

- [Strapi website](https://strapi.io/)
- [Strapi community on Slack](https://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
- [AWS Permissions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl)
