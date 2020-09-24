import * as sqz from "sequelize";
import {DbInterface} from "@san/customTypings/models";

let defaultSequelizeOpts: sqz.Options = {
  dialect: 'mysql',
  dialectOptions: {
    multipleStatements: true
  },
  define: {
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    underscored: true,
    freezeTableName: true
  },
  query: {
    nest: true,
  }
}

if (!!global.sequelizeOptions && Object.keys(global.sequelizeOptions).length > 0 ) {
  defaultSequelizeOpts = global.sequelizeOptions;
}

const util: { getValues: Function; getValue: Function; } = {
  getValues: (results: sqz.Model[]) => {
    let jsonResults: Array<object> = [];
    results.forEach(x => jsonResults.push(x.toJSON()))
    return jsonResults;
  },
  getValue: (result: sqz.Model) => {
    if (!result) return null;
    return result.toJSON();
  }
};

const sequelizeInstance: sqz.Sequelize = new sqz.Sequelize(global.databaseUrl, defaultSequelizeOpts);

const dbInterface: DbInterface = {
  sequelize: sequelizeInstance,
  util: util
};

export default dbInterface;
