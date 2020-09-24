import logger from "@san/util/logger";

export abstract class ControllerBase {
  errorHandler(err: any, res: any) {
    logger.error(err);
    res.status(err.status || 500).json({ isError: true, message: err.message || err, data: null });
  }
}
