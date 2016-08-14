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
const odm_1 = require('./odm');
const marked = require("marked");
let router = express.Router();
router.get('/:slug', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let page = yield odm_1.findBySlug(req.params.slug);
    if (page) {
        marked(page.content, (err, content) => {
            if (err) {
                return next(err);
            }
            res.html = { content: content, title: page.title };
            next();
        });
    }
    else {
        next();
    }
}));
module.exports = router;
//# sourceMappingURL=router.js.map