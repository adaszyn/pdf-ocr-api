var archiver = require('archiver');
const ejs = require('ejs')

var fileSystem = require('fs'),
    path = require('path');

async function generateEpubFile(sections) {
    return sections
}

async function handler(ctx) {
    const response = await generateEpubFile(ctx.request.body)
    var filePath = path.join(__dirname, '../../../assets/empty-epub/mimetype');
    var archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
    });
    const articleContent = ejs.render(fileSystem.readFileSync(path.join(__dirname, '../../../assets/article.tmpl.ejs'), 'utf-8'), {
        elements: ctx.request.body.elements
    });

    // ctx.body = archive
    ctx.body = archive
    archive.append(articleContent, { name: 'OEBPS/article.xhtml' });
    archive.directory(path.join(__dirname, '../../../assets/empty-epub/META-INF'), 'META-INF');
    archive.directory(path.join(__dirname, '../../../assets/empty-epub/OEBPS'), 'OEBPS');
    // archive.file(path.join(__dirname, '../../../assets/empty-epub/mimetype'), 'mimetype');
    archive.append(fileSystem.createReadStream(path.join(__dirname, '../../../assets/empty-epub/mimetype')), { name: 'mimetype' });
    archive.finalize();

}

module.exports = handler