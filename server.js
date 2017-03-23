const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const pdfToImagesHandler = require('./app/routes/pdf-to-images/pdf-to-images.index')
const bodyParser = require('koa-bodyparser');

app
    .use(bodyParser({
        formLimit: 9251700
    }))
    .use(router.routes())
    .use(router.allowedMethods());

router.post('/', pdfToImagesHandler);


app.listen(3000);