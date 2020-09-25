import DBClient from "@san/config/database";
import { expect } from 'chai';
import dbInterface from "@san/config/create-instance";
import * as sqz from "sequelize";

describe('init db', () => {
  before(() => {
    return (new DBClient(dbInterface)).getClient().then(r => {
      expect(r).to.not.be.undefined;
      expect(r).to.be.instanceof(sqz.Sequelize);
    })
  });

  it('should update test database', (done) => {
    done();
  });
});
