// Roteador principal da API — agrega todos os sub-roteadores em um só lugar.
//
// Cada grupo de rotas fica em sua própria pasta (user/, auth/) e é montado
// aqui com um prefixo. Isso mantém o código organizado conforme a API cresce.
//
// Rotas resultantes:
//   POST /api/user        → cria um novo usuário
//   GET  /api/user        → lista todos os usuários (requer autenticação)
//   POST /api/auth/login  → realiza o login e retorna o JWT

import { createRouter } from "@/tools/createAppRoute.js";
import userRoute from "./user/user.index.js";
import authRoute from "./auth/auth.index.js";

const apiRoute = createRouter()

apiRoute.route("/user", userRoute)
apiRoute.route("/auth", authRoute)

export default apiRoute
