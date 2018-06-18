'use strict';
const webshot = require('webshot');

exports.createHtmlImageStream = (htmlContent, width = 200, height = 200) => {
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

    return webshot(htmlContent, options);
};