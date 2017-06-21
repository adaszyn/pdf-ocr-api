const archiver = require('archiver');
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

async function handler(ctx) {
    const { publisher, author, title } = ctx.request.body
    const archive = archiver('zip', {
        zlib: {level: 9}
    })
    const articleContent = ejs.render(fs.readFileSync(path.join(__dirname, '../../../assets/article.tmpl.xhtml'), 'utf-8'), {
        elements: ctx.request.body.elements
    })

    const contentOPFContent = ejs.render(fs.readFileSync(path.join(__dirname, '../../../assets/content.tmpl.opf'), 'utf-8'), {
        publisher,
        author,
        title
    })
    // ctx.body = archive
    ctx.body = archive
    archive.append(articleContent, {name: 'OEBPS/article.xhtml'});
    archive.append(contentOPFContent, {name: 'OEBPS/content.opf'});
    archive.directory(path.join(__dirname, '../../../assets/empty-epub/META-INF'), 'META-INF');
    archive.directory(path.join(__dirname, '../../../assets/empty-epub/OEBPS'), 'OEBPS');
    // archive.file(path.join(__dirname, '../../../assets/empty-epub/mimetype'), 'mimetype');
    archive.append(fs.createReadStream(path.join(__dirname, '../../../assets/empty-epub/mimetype')), {name: 'mimetype'});
    archive.finalize();

}

module.exports = handler