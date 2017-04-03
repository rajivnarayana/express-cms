"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.FORMATS = ['markdown', 'html'];
let Schema = new mongoose.Schema({
    url: {
        type: String, unique: true, required: [true, 'URL required to create page'],
    },
    format: {
        type: String, enum: exports.FORMATS, default: exports.FORMATS[0]
    },
    title: {
        type: String
    },
    content: {
        type: String, required: [true, 'Content required to create a page']
    },
    published: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.PageSchema = mongoose.model('pages', Schema);
//# sourceMappingURL=pages-schema.js.map