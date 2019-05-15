const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

// const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
//   mysql: {
//     createPool: sinon.stub().returns({
//       query: sinon.stub(),
//       getConnection: sinon.stub.yields({
//         beginTransaction: sinon.stub.yields({})
//       })
//     }),

//   }
// });

describe("mysql utility", () => {
  it("should create a new mysql pool", () => {
    const createPoolStub = sinon.stub().returns({});
    proxyquire("../../../../lib/utilities/database/mysql.js", {
      mysql: {
        createPool: createPoolStub
      }
    });

    expect(createPoolStub).to.have.been.calledOnce;
  })

  describe("_beginTransaction", () => {
    it("should call the pool getConnection method", () => {
      const getConnectionStub = sinon.stub().yields(null, {
        beginTransaction: sinon.stub().yields(null, {})
      });
      const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
        mysql: {
          createPool: sinon.stub().returns({
            getConnection: getConnectionStub
          })
        }
      });

      mysqlUtil._beginTransaction()
        .then((result) => {
          expect(getConnectionStub).to.have.been.calledOnce;
        });
    });

    it("should call the connections beginTransaction method and resolve with the connection", () => {
      const beginTransactionStub = sinon.stub().yields(null, {});
      const getConnectionStub = sinon.stub().yields(null, {
        beginTransaction: beginTransactionStub
      });
      const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
        mysql: {
          createPool: sinon.stub().returns({
            getConnection: getConnectionStub
          })
        }
      });

      mysqlUtil._beginTransaction()
        .then((result) => {
          expect(getConnectionStub).to.have.been.calledOnce;
          expect(beginTransactionStub).to.have.been.calledOnce;
          expect(result).to.eql({
            beginTransaction: beginTransactionStub
          });
        });
    });

    it("should handle errors in getConnection", () => {
      const getConnectionStub = sinon.stub().yields("ERROR");
      const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
        mysql: {
          createPool: sinon.stub().returns({
            getConnection: getConnectionStub
          })
        }
      });

      mysqlUtil._beginTransaction()
        .then((result) => {
          expect(result).to.be.undefined;
        })
        .catch((err) => {
          expect(err).to.not.be.null;
        });
    });

    it("should handle errors in beginTransaction", () => {
      const beginTransactionStub = sinon.stub().yields("ERROR");
      const getConnectionStub = sinon.stub().yields(null, {
        beginTransaction: beginTransactionStub
      });
      const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
        mysql: {
          createPool: sinon.stub().returns({
            getConnection: getConnectionStub
          })
        }
      });

      mysqlUtil._beginTransaction()
        .then((result) => {
          expect(result).to.be.undefined;
        })
        .catch((err) => {
          expect(err).to.not.be.null;
        });
    });
  });

  describe("_commitTransaction", () => {
    it("should call the passed in connections commit method", () => {
      const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
        mysql: {
          createPool: sinon.stub().returns({})
        }
      });

      const commitStub = sinon.stub().yields();

      mysqlUtil._commitTransaction({ commit: commitStub })
        .then(() => {
          expect(commitStub).to.have.been.calledOnce;
        });
    });

    it("should handle errors committing", () => {
      const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
        mysql: {
          createPool: sinon.stub().returns({})
        }
      });

      const commitStub = sinon.stub().yields("ERROR");

      mysqlUtil._commitTransaction({ commit: commitStub })
        .catch((err) => {
          expect(commitStub).to.have.been.calledOnce;
          expect(err).to.not.be.null;
          expect(err).to.equal("ERROR");
        });
    });
  });

  describe("_rollbackTransaction", () => {
    it("should call the passed in connections rollback method", () => {
      const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
        mysql: {
          createPool: sinon.stub().returns({})
        }
      });

      const rollbackStub = sinon.stub().yields();

      mysqlUtil._rollbackTransaction({ rollback: rollbackStub })
        .then(() => {
          expect(rollbackStub).to.have.been.calledOnce;
        });
    });

    it("should handle errors rolling back", () => {
      const mysqlUtil = proxyquire("../../../../lib/utilities/database/mysql.js", {
        mysql: {
          createPool: sinon.stub().returns({})
        }
      });

      const rollbackStub = sinon.stub().yields("ERROR");

      mysqlUtil._rollbackTransaction({ rollback: rollbackStub })
        .catch((err) => {
          expect(rollbackStub).to.have.been.calledOnce;
          expect(err).to.not.be.null;
          expect(err).to.equal("ERROR");
        });
    });
  });
});