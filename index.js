"use strict";
const adminRouter_ = require("./admin-router");
const router_ = require("./router");
const cms_forms_1 = require("cms-forms");
const cms_grids_1 = require("cms-grids");
adminRouter_.use(cms_grids_1.render);
adminRouter_.use(cms_forms_1.render);
router_.use(cms_grids_1.render);
router_.use(cms_forms_1.render);
exports.adminRouter = adminRouter_;
exports.router = router_;
//# sourceMappingURL=index.js.map