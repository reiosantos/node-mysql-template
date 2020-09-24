import "./init";
import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as swagger from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import initControllers from "@san/controllers";
import logger, { morgan_logger } from "@san/util/logger";
import { auth } from "@san/helpers/auth.helpers";
import passport from "passport";

dotenv.config();

const app = express();
const router = express.Router();

app.use(morgan_logger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true }));
app.use(passport.initialize());
app.use(router);

const prefix = `${global.urlPrefix}${global.urlVersion}`;

let healthCheckUrls = [prefix, `${prefix}/health`];
router.route(healthCheckUrls).get((req, res) => res.json({ status: "OK" }));

router.use((req, res, next) => {
  if (healthCheckUrls.indexOf(req.url) === -1) logger.info(req.method, req.url);
  next();
});

app.use(`${prefix}/docs`, swagger.serve, swagger.setup(swaggerDocument));

// ensure all routes are authenticated except the health-check and docs
// @ts-ignore
const noAuthPaths: Array<string> = [new RegExp(`${prefix}/auth*`, 'i')];
app.all("*",
  auth.required.unless({ path: noAuthPaths }),
  (err: any, req: any, res: any, next: Function) => {
    if (err.name === "UnauthorizedError") {
      res.status(err.status).send({ isError: true, message: err.message, data: null });
      logger.error(err);
      return;
    }
    next();
  });

initControllers(app, express, prefix);

app.use((req, res) => {
  return res.status(404).json({
    isError: true,
    message: `Not Found. Use ${prefix} to access the api.`,
    data: null
  });
});

require("./config/passport");

export default app;
