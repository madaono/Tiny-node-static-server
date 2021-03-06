const path = require('path');

const mimeTypes = {
    'avi':'video/x-msvideo',
    'css':'text/css',
    'gif':'image/gif',
    'html':'text/html',
    'ico':'image/x-icon',
    'jpe':'image/jpeg',
    'jpeg':'image/jpeg',
    'jpg':'image/jpeg',
    'js':'application/x-javascript',
    'json':'application/json',
    'pdf':'application/pdf',
    'png':'image/png',
    'svg':'image/svg+xml',
    'swf':'application/x-shockwave-flash',
    'tiff':'image/tiff',
    'txt':'text/plain',
    'wav':'audio/x-wav',
    'xml':'text/xml'
};

module.exports = (filePath) => {
    let ext = path.extname(filePath)
    .split('.').pop();

    if (!ext) {
        ext = filePath;
    }

    return mimeTypes[ext] || mimeTypes['txt'];
};