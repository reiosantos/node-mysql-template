import { Express, Request, Response } from "express";
import { ControllerBase } from "@san/util/ControllerBase";
import passport from "passport";

class AuthController extends ControllerBase {
  constructor(app: Express, express: any, routerPrefix: string) {
    super();
    let router: Express = new express.Router();
    // Add as many routes as you want
    router.route("/login").post(this.login);

    app.use(routerPrefix + "/auth", router);
  }

  login = (req: Request, res: Response, next: Function) => {
    // Need username/password in body
    return passport.authenticate("local", {session: false},
      (err, passportUser, info) => {
        if (passportUser) {
          const userObject = passportUser;
          userObject.token = passportUser.generateJWTToken();
          return res.json({ isError: false, data: userObject.toAuthJSON(), message: null });
        }

        return res.status(400).json(err || info);
      })(req, res, next);
  };
}

export = AuthController;
