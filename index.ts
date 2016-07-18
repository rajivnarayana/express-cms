import * as adminRouter_ from "./admin-router";
import * as router_ from "./router";
import { render as formRenderer} from "cms-forms";
import { render as gridRenderer} from "cms-grids";

adminRouter_.use(gridRenderer);
adminRouter_.use(formRenderer);
router_.use(gridRenderer);
router_.use(formRenderer);

export var adminRouter = adminRouter_;
export var router = router_;
