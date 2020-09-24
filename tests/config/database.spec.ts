import DBClient from "@san/config/database";
import { expect } from 'chai';
import dbInterface from "@san/config/create-instance";

describe('init db', () => {
  before(() => {
    return (new DBClient(dbInterface)).getClient().then(r => {
      expect(r).to.not.be.undefined;
      expect(r).to.haveOwnProperty('id');
    })
  });

  it('should update test database', async (done) => {
    done();
  });
});
