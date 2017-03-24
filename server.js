const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const pdfToImagesHandler = require('./app/routes/pdf-to-images/pdf-to-images.index')
const sessionHandler = require('./app/routes/session/session.index')

app
    // .use(bodyParser({
    //     formLimit: 925170000
    // }))
    .use(router.routes())
    .use(router.allowedMethods());

router.post('/', pdfToImagesHandler);
router.get('/session', sessionHandler);


app.listen(3000);

/*
DONE
 - flow -> request -> {token} -> dir 'token' -> images

TO BE DONE
   - authorization (?)
   - OCR over images
   - Testing environment
*/
