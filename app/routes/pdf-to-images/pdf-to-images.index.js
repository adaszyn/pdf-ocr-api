const join = require('path').join
const os = require('os')
const multer = require('multer')
const PDFImage = require("pdf-image").PDFImage;
const tmp = require('tmp')
const fs = require('fs')

var upload = multer({
    dest: 'uploads/'
})

async function getImagesFromPdfBuffer(buffer) {
    try {
        tmp.file(async function _tempFileCreated(err, path, fd, cleanupCallback) {
            if (err) throw err;
            console.log({
                path
            })
            fs.writeFileSync(path, buffer)
            // cleanupCallback();
        });bhj

    } catch (exception) {
        console.log(exception)
    }
}

async function handler(ctx, next) {
    const images = await getImagesFromPdfBuffer(ctx.request.body)
    console.log(images)
    ctx.body = 'Yo!'
}

module.exports = handler