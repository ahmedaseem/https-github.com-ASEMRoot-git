const audit =
require("../../../middleware/audit.middleware");


router.delete(

"/:id",

audit(
"DELETE",
"USER"
),

role("admin"),

deleteUser

);
