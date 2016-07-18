"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pages_schema_1 = require('./pages-schema');
function read(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pages_schema_1.PageSchema.findById(id);
    });
}
exports.read = read;
function create(values) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pages_schema_1.PageSchema.create(values);
    });
}
exports.create = create;
function update(id, values) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pages_schema_1.PageSchema.findByIdAndUpdate(id, { $set: values }, { $new: true });
    });
}
exports.update = update;
function list() {
    return __awaiter(this, void 0, Promise, function* () {
        return yield pages_schema_1.PageSchema.find();
    });
}
exports.list = list;
function findBySlug(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        let pages = yield pages_schema_1.PageSchema.find({ url: slug, published: true });
        if (pages.length == 0) {
            return null;
        }
        else {
            return pages[0];
        }
    });
}
exports.findBySlug = findBySlug;
//# sourceMappingURL=odm.js.map