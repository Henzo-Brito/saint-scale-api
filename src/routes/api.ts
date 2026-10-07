import { createRouter } from "@/tools/createAppRoute.js";
import alertRoute from "./alert/alert.index.js";
import authRoute from "./auth/auth.index.js";
import homeRoute from "./home/home.index.js";
import scaleRoute from "./scale/scale.index.js";
import userRoute from "./user/user.index.js";

const apiRoute = createRouter();

apiRoute.route("/user", userRoute);
apiRoute.route("/auth", authRoute);
apiRoute.route("/", homeRoute);
apiRoute.route("/", alertRoute);
apiRoute.route("/", scaleRoute);

export default apiRoute;
