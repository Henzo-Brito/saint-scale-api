import { createApp } from "./tools/createAppRoute.js";
import apiRoute from "./routes/api.js";

const app = createApp()

app.route("/api/", apiRoute)

export default app