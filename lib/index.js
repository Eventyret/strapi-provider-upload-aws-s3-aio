'use strict';
/* eslint-disable no-unused-vars */
// Public node modules.
const AWS = require('aws-sdk');

module.exports = {
  init(config) {
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      ...config,
    });

    return {
      async upload(file, customParams = {}) {
        // Leaving this here for later ticket creating webP support.
        //const fileBuffer = isImage(file) ? await sharp(file.buffer).webp().toBuffer() : file.buffer;
        const fileBuffer = file.buffer;
        const path = file.path ? `${file.path}` : '';

        return await new Promise((resolve, reject) => {
          S3.upload(
            {
              Key: `${path}uploads/${file.hash}${file.ext}`,
              Body: Buffer.from(fileBuffer, 'binary'),
              ACL: config.ACL ? config.acl : 'private',
              ContentType: file.mime,
              ...customParams,
            },
            (err, data) => {
              if (err) return reject(err);
              file.url = config.cdn ? `/${data.Key}` : data.Location;
              file.previewUrl = `https://${config.cdn}/${data.Key}`;
              resolve();
            }
          );
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          S3.deleteObject(
            {
              Key: `${path}uploads/${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
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
  return ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].includes(file.ext);
}
