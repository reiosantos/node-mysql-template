import fs, {readdirSync} from 'fs';
import format from 'string-template';
import logger from "@san/util/logger";
import * as sqz from "sequelize";
import {DbInterface} from "@san/customTypings/models";
import path from "path";


class DBClient {
  public static db: DbInterface;
  private static instance: sqz.Sequelize;
  private static exists: boolean;

  constructor(dbInterface: DbInterface) {
    DBClient.db = dbInterface;
    DBClient.instance = dbInterface.sequelize
  }

  private init = (): DbInterface => {
    const dir = path.join(path.dirname(__dirname), 'models');

    readdirSync(dir)
      .filter((file) => {
        return (file.indexOf('.') !== 0) &&
          (file.substr(0, 5) !== 'index') &&
          (file.substr(-4) !== '.map') &&
          (file.substr(0, 13) !== 'model.factory');
      })
      .forEach((file) => {
        //noinspection TypeScriptUnresolvedFunction
        let model = require(path.join(dir, file));
        DBClient.db[model['name']] = model;
      });

    Object.keys(DBClient.db).forEach(function (modelName) {
      if ('associate' in DBClient.db[modelName]) {
        DBClient.db[modelName].associate(DBClient.db);
      }
    });
    return DBClient.db;
  }

  async getClient() {
    try {
      this.init();

      let sql = await fs.readFileSync('./resources/sql/init-my.sql');
      let sqlStr = format(sql.toString(), {
        schema: global.dbSchema
      });
      let sqlArr = sqlStr.split(';;');

      for (const query of sqlArr) {
        await DBClient.db.sequelize.query(query, {type: sqz.QueryTypes.RAW});
      }

      DBClient.instance = DBClient.db.sequelize;
      DBClient.exists = true;

      return DBClient.instance;
    } catch (e) {
      logger.error(e)
      throw Error(`Unable to connect to database: ${e}`);
    }
  }
}

export default DBClient;
