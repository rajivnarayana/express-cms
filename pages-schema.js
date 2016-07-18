"use strict";
const mongoose = require('mongoose');
let Schema = new mongoose.Schema({
    url: {
        type: String, required: [true, 'URL required to create page'],
    },
    title: {
        type: String
    },
    content: {
        type: String
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