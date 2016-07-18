import * as express from "express";
import {findBySlug} from './odm';
import * as marked from "marked";

let router = express.Router();

router.get('/:slug', async (req, res, next) => {
    let page = await findBySlug(req.params.slug);
    if (page) {
        marked(page.content, (err, content) => {
            if (err) {
                return next(err);
            }
            res.html = {content : content};
            next();
        })
    } else {
        next();
    }
})

export = router;