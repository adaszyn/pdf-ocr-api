const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const pdfToImagesHandler = require('./app/routes/pdf-to-images/pdf-to-images.index')
const sessionHandler = require('./app/routes/session/session.index')
const imageToTextHandler = require('./app/routes/image-to-text/image-to-text.index')
const bodyParser = require('koa-bodyparser');

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

router.post('/', pdfToImagesHandler);
router.get('/session', sessionHandler);
router.post('/imageToText', imageToTextHandler);


app.listen(3000);

/*
DONE
 - flow -> request -> {token} -> dir 'token' -> images

TO BE DONE
   - authorization (?)
   - OCR over images
   - Testing environment
*/
