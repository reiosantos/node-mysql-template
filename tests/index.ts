import '@san/init';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);

global.databaseUrl += '_test';
global.dbSchema += '_test';
