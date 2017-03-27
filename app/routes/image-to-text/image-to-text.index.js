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

function getImageAbsolutePath(sessionId, imageId) {
    // todo: this should be changed to work with multiple image formats
    const tempDir = os.tmpdir()
    return path.join(tempDir, sessionId, imageId + '.png')
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

function convertImageToTif(imagePath) {
    return new Promise((resolve, reject) => {
        const { name, dir } = path.parse(imagePath)
        const outputPath = path.join(dir, name + '.tif')
        exec(`convert ${imagePath} ${outputPath}`, function (err, stdout, stderr) {
            if (stderr) {
                reject(stderr)
            } else {
                resolve(outputPath)
            }
        })
    })
}

async function extractData (args) {
    try {
        const {sections, sessionId, imageId} = args
        const uznFileContent = uznSectionsToString(sections)
        await saveUznFileForImage(sessionId, imageId, uznFileContent)
        const imageAbsolutePath = getImageAbsolutePath(sessionId, imageId)
        console.log(imageAbsolutePath)
        const tifImagePath = await convertImageToTif(imageAbsolutePath)
        return await performOCR(tifImagePath)
    } catch (e) {
        console.error(e)
    }
}



async function handler(ctx) {
    const TEMP_REQ_BODY = {
        sections: [
            [100, 430, 520, 160, 'Text']
        ],
        imageId: 'main_00',
        sessionId: 'tmp-5892EjqPSU7NoUJp'
    }
    const ocrResponse = await extractData(TEMP_REQ_BODY)
    ctx.body = {
        text: ocrResponse,

    }

}

module.exports = handler