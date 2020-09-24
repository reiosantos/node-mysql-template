import * as sqz from "sequelize";
import UserModel from "../models/user.model";

export interface DbInterface {
  [key: string]: any
  sequelize: sqz.Sequelize
  util: {
    getValues: Function;
    getValue: Function;
  },
  // Define all models here
  user?: UserModel
}
