import apiRoute from "./routes/api.js";
import { createApp } from "./tools/createAppRoute.js";
const app = createApp();
app.route("/api/", apiRoute);
export default app;
