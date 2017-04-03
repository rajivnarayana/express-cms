"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processMongooseErrors(error) {
    return Object.keys(error.errors).map(key => {
        return { message: error.errors[key] };
    });
}
exports.processMongooseErrors = processMongooseErrors;
//# sourceMappingURL=error-utils.js.map