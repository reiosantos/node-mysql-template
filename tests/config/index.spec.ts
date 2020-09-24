import { expect } from "chai";

describe('config', () => {

  it('should init values', () => {
    expect(global.env).to.not.be.undefined;
    expect(global.port).to.not.be.undefined;
  });
});
