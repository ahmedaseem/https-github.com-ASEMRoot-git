// app.js

const userRoutes =
require("./api/v1/users/user.routes");


app.use(
"/api/v1/users",
userRoutes
);
