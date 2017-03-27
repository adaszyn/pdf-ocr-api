const {uznSectionsToString} = require('../../util/uzn-util/uzn-util')
const exec = require('child_process').exec
const {TESS_DATA_DIR} = require('../../../config/config')
const fs = require('fs')
const path = require('path')
const os = require('os')

function performOCR (absImagePath) {
    return new Promise((resolve, reject) => {
        const cmd = `tesseract ${absImagePath} stdout -l eng -psm 4 --tessdata-dir ${TESS_DATA_DIR}`
        console.log('cmd', cmd);
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        })
    })
}

function getImageAbsolutePath(sessionId, imageId, extension = 'png') {
    // todo: this should be changed to work with multiple image formats
    const tempDir = os.tmpdir()
    return path.join(tempDir, sessionId, imageId + '.' + extension)
}

function saveUznFileForImage (sessionId, imageId, uznFileContent) {
    const tempDir = os.tmpdir()
    const fileName = path.join(tempDir, sessionId, imageId + '.uzn')
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, uznFileContent, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}


async function extractData (args) {
    try {
        const {sections, sessionId, imageId} = args
        const uznFileContent = uznSectionsToString(sections)
        await saveUznFileForImage(sessionId, imageId, uznFileContent)
        const imageAbsolutePath = getImageAbsolutePath(sessionId, imageId, 'tif')
        return await performOCR(imageAbsolutePath)
    } catch (e) {
        console.error(e)
    }
}



async function handler(ctx) {
    const ocrResponse = await extractData(ctx.request.body)
    console.log(ctx.request.body);
    ctx.body = {
        text: ocrResponse,

    }

}

module.exports = handler