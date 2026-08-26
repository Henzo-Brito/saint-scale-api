import { createRouter } from "@/tools/createAppRoute.js";
import userRoute from "./user/user.index.js";
import authRoute from "./auth/auth.index.js";

const apiRoute = createRouter()

apiRoute.route("/user", userRoute)
apiRoute.route("/auth", authRoute)

export default apiRoute

