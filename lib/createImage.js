'use strict';
const webshot = require('webshot');

let streamToBuffer = (stream, base = 'base64') => {
    return new Promise((resolve, reject) => {
        let buffers = [];

        stream.on('error', reject);
        stream.on('data', (data) => buffers.push(data));
        stream.on('end', () => resolve(Buffer.from(Buffer.concat(buffers)), base));
    });
};

exports.createHtmlImage = (htmlContent, width = 200, height = 200) => {
    let options = {
        screenSize: {
            width: width,
            height: height
        },
        shotSize: {
            width: 'window',
            height: 'window'
        },
        siteType: 'html',
        streamType: 'png',
        defaultWhiteBackground: true
    };

    let imageStream = webshot(htmlContent, options);

    return streamToBuffer(imageStream);
};