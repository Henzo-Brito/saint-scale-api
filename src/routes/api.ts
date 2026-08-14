import { createRouter } from "@/tools/createAppRoute.js";
import userRoute from "./user/user.index.js";

const apiRoute = createRouter()

apiRoute.route("/user", userRoute)

export default apiRoute

