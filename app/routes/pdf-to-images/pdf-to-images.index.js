const PDFImage = require("pdf-image").PDFImage;
const tmp = require('tmp')
const fs = require('fs')
const getRawBody = require('raw-body')
const FILE_NAME = 'main.pdf'
const path = require('path')
const createSession = require('../session/create-session')

function saveBufferToTempFile (directory, buffer) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(directory, FILE_NAME)
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(filePath)
            }
        })
    })
}

function createTempDirectory() {
    return new Promise((resolve, reject) => {
        tmp.dir(function (err, path) {
            if (err) {
                reject(err)
            }
            resolve(path)
        });
    })
}

async function saveBufferToFile(directory, buffer) {
    try {
        const path = await saveBufferToTempFile(directory, buffer)
        return path
    } catch (exception) {
        console.log(exception)
    }
}

async function getImagesFromPdf (path) {
    const pdfImage = new PDFImage(path)
    const info = await pdfImage.getInfo()
    const pageCount = info['Pages']
    const pagesPaths = []
    for (let i = 0; i < pageCount; i++) {
        pagesPaths.push(pdfImage.convertPage(i))
    }
    return await Promise.all(pagesPaths)
}


function readFileInBase64 (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {encoding: 'base64'}, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

async function createImageMap(images) {
    const result = {}
    for (let image of images) {
        const fileName = path.parse(image).name
        result[fileName] = await readFileInBase64(image)
    }
    return result
}

async function handler(ctx, next) {
    // const images = await getImagesFromPdfBuffer(ctx.request.body)
    const rawBody = await getRawBody(ctx.req, {
        length: ctx.req.headers['content-length'],
        limit: '10mb'
    })
    const directoryPath = await createTempDirectory()
    const filePath = await saveBufferToFile(directoryPath, rawBody)
    const images = await getImagesFromPdf(filePath)
    const imagesInBase64 = await createImageMap(images)
    const sessionId = path.parse(directoryPath).name
    await createSession(sessionId)
    ctx.body = {
        images: imagesInBase64,
        session_id: sessionId
    }
}

module.exports = handler