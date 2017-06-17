const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const pdfToImagesHandler = require('./app/routes/pdf-to-images/pdf-to-images.index')
const sessionHandler = require('./app/routes/session/session.index')
const imageToTextHandler = require('./app/routes/image-to-text/image-to-text.index')
const generateEpubHandler = require('./app/routes/generate-epub/generate-epub.index')
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');

const servicePrefix = process.env.NODE_ENV === 'production'
    ? '/ocr-api/'
    : '/'
app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods());

router.post(`${servicePrefix}session`, pdfToImagesHandler);
router.get(`${servicePrefix}session`, sessionHandler);
router.post(`${servicePrefix}imageToText`, imageToTextHandler);
router.post(`${servicePrefix}generateEpub`, generateEpubHandler);


app.listen(3000);

/*
 DONE
 - flow -> request -> {token} -> dir 'token' -> images

 TO BE DONE
 - authorization (?)
 - OCR over images
 - Testing environment
 */
