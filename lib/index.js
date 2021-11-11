'use strict';
/* eslint-disable no-unused-vars */
// Public node modules.
const sharp = require('sharp');
const AWS = require('aws-sdk');

module.exports = {
  init(config) {
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      ...config,
    });

    return {
      async upload(file, customParams = {}) {
        let webP;
        if (isImage(file)) {
          webP = await sharp(file.buffer).webp().toBuffer();
        }

        return new Promise((resolve, reject) => {
          // upload file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          S3.upload(
            {
              Key: `${path}${file.hash}${file.ext}`,
              Body: Buffer.from(file.buffer, 'binary'),
              ACL: config.ACL ? config.acl : 'private',
              ContentType: file.mime,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }
              file.url = config.cdn ? `${config.cdn}${data.Key}` : data.Location;
              // set the bucket file url

              return resolve();
            }
          );

          if (isImage(file)) {
            S3.upload(
              {
                Key: `webp/${path}${file.hash}.webp`,
                Body: Buffer.from(webP.buffer, 'binary'),
                ACL: config.ACL ? config.acl : 'private',
                ContentType: file.mime,
                ...customParams,
              },
              (err, data) => {
                if (err) {
                  return reject(err);
                }
                // set the bucket file url with webp
                file.url = config.cdn ? `${config.cdn}${data.Key}` : data.Location;

                return resolve();
              }
            );
          }
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }
              return resolve();
            }
          );
          S3.deleteObject(
            {
              Key: `webp/${path}${file.hash}.webp`,
              ...customParams,
            },
            (err) => {
              if (err) {
                return reject(err);
              }
              return resolve();
            }
          );
        });
      },
    };
  },
  isImage,
};

/**
 * Check if the file is an image.
 * @param {File} file
 * @returns {boolean} image
 */
function isImage(file) {
  const types = ['.png', '.jpg', '.gif', 'webp'];
  let image = false;
  Object.values(types).forEach((type) => {
    if (file.ext === type) image = true;
    return image;
  });
  return image;
}
