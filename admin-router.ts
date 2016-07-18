import * as express from "express";
import { Form, Field } from "cms-forms";
import { Grid, Row } from "cms-grids";
import * as marked from 'marked';

import * as bodyParser from "body-parser";
import { read, create, update, list } from './odm';

const fields: [Field] = [{
    label : 'Title',
    type : 'TextField',
    name : 'title',
    placeholder : 'Page title',
}, {
    label : 'Content',
    type : 'MDE',
    name : 'content',
    placeholder : 'Your content',
}, {
    label : 'Page',
    type : 'TextField',
    name : 'url',
    placeholder : 'relative url'
}, {
    label : 'Published',
    type : 'CheckBox',
    value : false,
    name : 'published'
}, {
    label : 'Submit',
    type : 'Submit',
    value : "Submit",
    name : 'draft'
}];

let router = express.Router();
let relativeURL = (path) => {
    return path;
}

router.use(bodyParser.urlencoded({extended: true}));

router.use((req, res, next) => {
    relativeURL = (relativePath) => {
        return req.baseUrl + relativePath;
    }
    next();
})

router.param('id', async (req, res, next, id) => {
    try {
        req.object = await read(id);
        next();
    } catch (error) {
        next(error)
    }
});

router.get('/pages', async (req, res, next) => {
    let allPages = await list();
    const grid = new Grid();
    grid.header = "Available Pages";
    grid.headerRow = ["url", "title", "status", "actions"];
    grid.rows = allPages.map((page) => {
        let row : Row = new Row();
        row.columns = [
            {
                href : relativeURL(`/pages/${page.id}/edit`),
                title : page.url
            },
            page.title,
            page.published ? "Published" : "Not Published"
        ];
        row.actions = [page.published ? {
            title: 'Unpublish',
            href: relativeURL(`/pages/${page.id}/unpublish`)
        } :{
            title: 'Publish',
            href: relativeURL(`/pages/${page.id}/publish`)
        }]
        return row;
    })
    grid.footer = "Add new page";
    res.grid = grid;
    next();
})
router.route('/pages/new').all((req, res, next) => {
    let form = new Form();
    form.method = 'POST';
    form.action = relativeURL('/pages/new');
    form.fields = fields;
    res.form = form;
    next();
}).get(async(req, res, next) => {
    next();
}).post(async (req, res, next) => {
    try {
        await create(req.body);
        res.redirect(relativeURL('/pages'));
    } catch(error) {
        res.form.setValues(req.body);
        next();
    }
});

router.route('/pages/:id/edit').get(async (req, res, next) => {
    if (!req.object) {
        return next(); //404
    }
    let form = new Form();
    form.method = 'POST';
    form.action = relativeURL(`/pages/${req.params.id}/edit`);
    form.fields = fields;
    form.setValues(req.object.toObject()); 
    res.form = form;
    next();
}).post(async (req, res, next) => {
    if (!req.object) {
        return next(); //404
    }
    try {
        await update(req.params.id, req.body);
        res.redirect(relativeURL('/pages'));
    } catch(error) {
        res.form.setValues(req.body);
        next();
    }
});

router.get('/pages/:id', async(req, res, next) => {
    let page = req.object;
    marked(page.content, (err, content) => {
        if (err) {
            return next(err);
        }
        res.html = content;
        next();
    })
});

export = router;