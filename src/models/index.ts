import ModelFactory from "@san/models/model.factory";
import {Model} from "sequelize";


class ModelWrapper extends Model {
  validatePassword: any;

  static getModel(name: string) {
    const model = ModelFactory.getModel(name);
    Object.assign(this, model);
    return this;
  }
}

export default ModelWrapper;
