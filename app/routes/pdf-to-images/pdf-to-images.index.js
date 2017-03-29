const PDFImage = require("pdf-image").PDFImage;
const tmp = require('tmp')
const fs = require('fs')
const getRawBody = require('raw-body')
const FILE_NAME = 'main.pdf'
const path = require('path')
const createSession = require('../session/create-session')
const exec = require('child_process').exec
const glob = require('glob')

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

function  parseGetInfoCommandOutput (output) {
    var info = {}
    output.split("\n").forEach(function (line) {
        if (line.match(/^(.*?):[ \t]*(.*)$/)) {
            info[RegExp.$1] = RegExp.$2
        }
    })
    return info
}

// function execPdfInfo (pdfPath) {
//     return new Promise((resolve, reject) => {
//         exec(`pdfinfo ${pdfPath}`, (err, stdout, stderr) => {
//             if (err) {
//                 resolve(stdout)
//             } else {
//                 reject(stderr)
//             }
//         })
//     })
// }
//
// async function getPdfInfo (pdfPath) {
//     const pdfInfoOutput = await execPdfInfo(pdfPath)
//     return parseGetInfoCommandOutput(pdfInfoOutput)
// }

function execConvert(location, outputFormat) {
    return new Promise((resolve, reject) => {
        const { name, dir } = path.parse(location)
        const cmd = `convert -fill '#FFFFFF' -density 150 ${location} -quality 90 -alpha Off ${dir}/${name}_%02d.${outputFormat}`
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        })
    })
}

function getAllFilesFromDir (dir, extension) {
    return new Promise((resolve, reject) => {
        glob(`${dir}/*.${extension}`, {absolute: false}, function (er, files) {
            if (er) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })
}

async function getImagesFromPdf (location) {
    const { dir } = path.parse(location)
    await Promise.all([
        execConvert(location, 'tif'),
        execConvert(location, 'png')
    ])
    const images = await getAllFilesFromDir(dir, 'png')
    return images
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
    const result = []
    for (let image of images) {
        const fileName = path.parse(image).name
        const page = parseInt(fileName.split('_').pop())
        result.push({
            imageId: fileName,
            page,
            base64Image: await readFileInBase64(image)
        })
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
        sessionId: sessionId
    }
}

module.exports = handler