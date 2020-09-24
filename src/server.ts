import 'module-alias/register';
import * as http from "http";
import app from "./index";
import { AddressInfo } from "net";
import DBClient from "@san/config/database";
import logger from "@san/util/logger";
import dbInterface from "@san/config/create-instance";

(async () => {
  // Only start the server if the mysql connection is active
  const client = new DBClient(dbInterface);
  await client.getClient();

  const server = http.createServer(app);

  server.listen(global.port, () => {
    const address: AddressInfo | string | null = server.address();
    if (address && typeof address !== "string") {
      logger.info(`Find me on http://localhost:${address.port}`);
    } else {
      logger.error(`Unable to start server on port ${global.port}`);
    }
  });
})();
