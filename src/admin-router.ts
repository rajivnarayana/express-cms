import * as express from "express";
import { Form, Field, WidgetTypes } from "cms-forms";
import { Grid, Row } from "cms-grids";
import * as marked from 'marked';
import {Types} from "mongoose";
import * as bodyParser from "body-parser";
import { read, create, update, list, publish, unpublish } from './odm';
import { processMongooseErrors } from "./error-utils";

const fields: Array<Field> = [  {
    class : ['col-sm-7'],
    labelClass : ['col-sm-2','col-sm-offset-1'],
    label : 'URL',
    type : WidgetTypes.TextField,
    name : 'url',
    placeholder : 'relative url'
}, {
    class : ['col-sm-7'],
    labelClass : ['col-sm-2','col-sm-offset-1'],
    label : 'Title',
    type : WidgetTypes.TextField,
    name : 'title',
    placeholder : 'Page title',
}, {
    class : ['col-sm-7'],
    labelClass : ['col-sm-2','col-sm-offset-1'],
    label : 'Type',
    type : WidgetTypes.Select,
    options : {'markdown' : 'Mark Down', 'html' : "HTML"},
    name : 'format',
}, {
    class : ['col-sm-7'],
    labelClass : ['col-sm-2','col-sm-offset-1'],
    label : 'Content',
    type : WidgetTypes.MarkDownEditor || 'MDE',
    name : 'content',
    placeholder : 'Your content',
},{
    label : 'Published',
    class : ['col-sm-7', 'col-sm-offset-3'],
    type : WidgetTypes.CheckBox,
    value : false,
    name : 'published'
}, {
    labelClass: ['col-sm-offset-3', 'col-sm-4'],
    class: ["btn-primary", "btn", "col-xs-12"],
    label : 'Submit 2',
    type : WidgetTypes.Submit,
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
    if (!Types.ObjectId.isValid(id)) {
        return next();
    }
    try {
        (req as any).object = await read(id);
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
    grid.footer = `<a href="${relativeURL('/pages/new')}" class="btn btn-primary">New page</a>`;
    (res as any).grid = grid;
    next();
})
router.route('/pages/new').all((req, res, next) => {
    let form = new Form();
    form.method = 'POST';
    form.action = relativeURL('/pages/new');
    fields[3].type = req.params.format == 'HTML' ? WidgetTypes.HTML : WidgetTypes.MarkDownEditor;
    form.fields = fields;
    (res as any).form = form;
    next();
}).get(async(req, res, next) => {
    next();
}).post(async (req, res, next) => {
    try {
        await create(req.body);
        res.redirect(relativeURL('/pages'));
    } catch(error) {
        console.error(error);
        (res as any).html.errors = processMongooseErrors(error); 
        (res as any).form.setValues(req.body);
        next();
    }
});

router.route('/pages/:id/edit').all(async (req, res, next) => {
    if (!(req as any).object) {
        return next(); //404
    }
    let form = new Form();
    form.method = 'POST';
    form.action = relativeURL(`/pages/${req.params.id}/edit`);
    form.fields = fields;
    form.fields[3].type = (req as any).object.format == 'html' ? WidgetTypes.HTMLEditor : WidgetTypes.MarkDownEditor;
    form.setValues(Object.assign((req as any).object.toObject(), {published : (req as any).object.published ? "on" : ""})); 
    (res as any).form = form;
    next();
}).post(async (req, res, next) => {
    if (!(req as any).object) {
        return next(); //404
    }
    try {
        await update(req.params.id, req.body);
        res.redirect(relativeURL('/pages'));
    } catch(error) {
        console.error(error);
        (res as any).html.errors = processMongooseErrors(error);
        (res as any).form.setValues(req.body);
        next();
    }
});

router.get('/pages/:id', async(req, res, next) => {
    if (!(req as any).object) {
        return next(); //404
    }
    let page = (req as any).object;
    marked(page.content, (err, content) => {
        if (err) {
            return next(err);
        }
        (res as any).html = content;
        next();
    })
});

router.get('/pages/:id/publish', async (req, res, next) => {
    if (!(req as any).object) {
        return next();
    }
    let page = (req as any).object;
    await publish(page.id);
    res.redirect(relativeURL("/pages"));
})

router.get('/pages/:id/unpublish', async (req, res, next) => {
    if (!(req as any).object) {
        return next();
    }
    let page = (req as any).object;
    await unpublish(page.id);
    res.redirect(relativeURL("/pages"));
})

export = router;