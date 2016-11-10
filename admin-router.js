"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const express = require("express");
const cms_forms_1 = require("cms-forms");
const cms_grids_1 = require("cms-grids");
const marked = require('marked');
const mongoose_1 = require("mongoose");
const bodyParser = require("body-parser");
const odm_1 = require('./odm');
const error_utils_1 = require("./error-utils");
const fields = [{
        class: ['col-sm-7'],
        labelClass: ['col-sm-2', 'col-sm-offset-1'],
        label: 'URL',
        type: cms_forms_1.WidgetTypes.TextField,
        name: 'url',
        placeholder: 'relative url'
    }, {
        class: ['col-sm-7'],
        labelClass: ['col-sm-2', 'col-sm-offset-1'],
        label: 'Title',
        type: cms_forms_1.WidgetTypes.TextField,
        name: 'title',
        placeholder: 'Page title',
    }, {
        class: ['col-sm-7'],
        labelClass: ['col-sm-2', 'col-sm-offset-1'],
        label: 'Content',
        type: cms_forms_1.WidgetTypes.MarkDownEditor || 'MDE',
        name: 'content',
        placeholder: 'Your content',
    }, {
        label: 'Published',
        class: ['col-sm-7', 'col-sm-offset-3'],
        type: cms_forms_1.WidgetTypes.CheckBox,
        value: false,
        name: 'published'
    }, {
        class: ['col-sm-4', 'col-sm-offset-3'],
        label: 'Submit',
        type: cms_forms_1.WidgetTypes.Submit,
        value: "Submit",
        name: 'draft'
    }];
let router = express.Router();
let relativeURL = (path) => {
    return path;
};
router.use(bodyParser.urlencoded({ extended: true }));
router.use((req, res, next) => {
    relativeURL = (relativePath) => {
        return req.baseUrl + relativePath;
    };
    next();
});
router.param('id', (req, res, next, id) => __awaiter(this, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return next();
    }
    try {
        req.object = yield odm_1.read(id);
        next();
    }
    catch (error) {
        next(error);
    }
}));
router.get('/pages', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let allPages = yield odm_1.list();
    const grid = new cms_grids_1.Grid();
    grid.header = "Available Pages";
    grid.headerRow = ["url", "title", "status", "actions"];
    grid.rows = allPages.map((page) => {
        let row = new cms_grids_1.Row();
        row.columns = [
            {
                href: relativeURL(`/pages/${page.id}/edit`),
                title: page.url
            },
            page.title,
            page.published ? "Published" : "Not Published"
        ];
        row.actions = [page.published ? {
                title: 'Unpublish',
                href: relativeURL(`/pages/${page.id}/unpublish`)
            } : {
                title: 'Publish',
                href: relativeURL(`/pages/${page.id}/publish`)
            }];
        return row;
    });
    grid.footer = `<a href="${relativeURL('/pages/new')}" class="btn btn-primary">New page</a>`;
    res.grid = grid;
    next();
}));
router.route('/pages/new').all((req, res, next) => {
    let form = new cms_forms_1.Form();
    form.method = 'POST';
    form.action = relativeURL('/pages/new');
    form.fields = fields;
    res.form = form;
    next();
}).get((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    next();
})).post((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield odm_1.create(req.body);
        res.redirect(relativeURL('/pages'));
    }
    catch (error) {
        res.html.errors = error_utils_1.processMongooseErrors(error);
        res.form.setValues(req.body);
        next();
    }
}));
router.route('/pages/:id/edit').all((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if (!req.object) {
        return next(); //404
    }
    let form = new cms_forms_1.Form();
    form.method = 'POST';
    form.action = relativeURL(`/pages/${req.params.id}/edit`);
    form.fields = fields;
    form.setValues(Object.assign(req.object.toObject(), { published: req.object.published ? "on" : "" }));
    res.form = form;
    next();
})).post((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if (!req.object) {
        return next(); //404
    }
    try {
        yield odm_1.update(req.params.id, req.body);
        res.redirect(relativeURL('/pages'));
    }
    catch (error) {
        res.html.errors = error_utils_1.processMongooseErrors(error);
        res.form.setValues(req.body);
        next();
    }
}));
router.get('/pages/:id', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if (!req.object) {
        return next(); //404
    }
    let page = req.object;
    marked(page.content, (err, content) => {
        if (err) {
            return next(err);
        }
        res.html = content;
        next();
    });
}));
router.get('/pages/:id/publish', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if (!req.object) {
        return next();
    }
    let page = req.object;
    yield odm_1.publish(page.id);
    res.redirect(relativeURL("/pages"));
}));
router.get('/pages/:id/unpublish', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if (!req.object) {
        return next();
    }
    let page = req.object;
    yield odm_1.unpublish(page.id);
    res.redirect(relativeURL("/pages"));
}));
module.exports = router;
//# sourceMappingURL=admin-router.js.map