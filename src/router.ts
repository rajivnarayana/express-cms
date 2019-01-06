import * as express from "express";
import {findBySlug} from './odm';
import * as marked from "marked";

let router = express.Router();

router.get('/:slug', async (req, res, next) => {
    let page = await findBySlug(req.params.slug);
    if (page) {
        if (page.format == 'markdown') {
            marked(page.content, (err, content) => {
                if (err) {
                    return next(err);
                }
                (res as any).html = {content : content, title : page.title, slug : req.params.slug};
                next();
            })
        } else {
            (res as any).html = {content : page.content, title : page.title, slug : req.params.slug};
            next();
        }
    } else {
        next();
    }
})

export = router;