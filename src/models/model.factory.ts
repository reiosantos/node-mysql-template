import logger from "@san/util/logger";
import DBClient from "@san/config/database";


class ModelFactory {
  /**
   * Creates a modal of Type `name`
   * Returns the modal matching the name or null
   *
   * @param name
   */
  static getModel = (name: string) => {
    if (!name) return null;
    const filename = `${name}.model.ts`;

    try {
      // in case it was exported in the most recommended way
      // exports = ModelName
      return DBClient.db[name];
    } catch (e) {
      logger.error(e);
      logger.info(
        `You tried to import '${filename}' when you asked the model
         '${name}' which does not exist`
      );
      throw Error(e);
    }
  };
}

export default ModelFactory;
