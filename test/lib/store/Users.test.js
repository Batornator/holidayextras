const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

const User = require("../../../lib/model/User");

describe("User Store", function () {

  describe ("mapToModels", () => {
    it ("should call the User Models fromDatabse function for each record", () => {
      const fromDatabaseStub = sinon.stub().returns({email: "test@test.com"});
      const proxyQuiredUsersStore = proxyquire("../../../lib/store/Users.js", {
        "../model/User": {
          fromDatabase: fromDatabaseStub
        }
      });

      const testData = [1,2,3];
      proxyQuiredUsersStore.mapToModels(testData);

      expect(fromDatabaseStub).to.have.been.calledThrice;
    });

    it("should return an array of results matching the length of the data passed in", () => {
      const fromDatabaseStub = sinon.stub().returns({email: "test@test.com"});
      const proxyQuiredUsersStore = proxyquire("../../../lib/store/Users.js", {
        "../model/User": {
          fromDatabase: fromDatabaseStub
        }
      });

      const testData = [1,2,3];
      const result = proxyQuiredUsersStore.mapToModels(testData);

      expect(result.length).to.equal(testData.length);
    });

    it("should return an array of results in the expected format", () => {
      const fromDatabaseStub = sinon.stub().returns({email: "test@test.com"});
      const proxyQuiredUsersStore = proxyquire("../../../lib/store/Users.js", {
        "../model/User": {
          fromDatabase: fromDatabaseStub
        }
      });

      const testData = [1,2,3];
      const result = proxyQuiredUsersStore.mapToModels(testData);

      expect(result).to.eql([{email: "test@test.com"}, {email: "test@test.com"}, {email: "test@test.com"}]);
    });
  });

  describe("findAll", () => {
    it("should call db.query with the appropriate sql and values", async () => {
      const fromDatabaseStub = sinon.stub().returns({email: "test@test.com"});
      const queryStub = sinon.stub().yields(null, []);
      const proxyQuiredUsersStore = proxyquire("../../../lib/store/Users.js", {
        "../model/User": {
          fromDatabase: fromDatabaseStub
        },
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      await proxyQuiredUsersStore.findAll(2, 30);
      expect(queryStub).to.have.been.calledOnceWith(
        "SELECT * FROM user LIMIT ? OFFSET ?",
        [30, 30]
      );
    });

    
    it("should call db.query with the default paging values if none are provided", async () => {
      const fromDatabaseStub = sinon.stub().returns({email: "test@test.com"});
      const queryStub = sinon.stub().yields(null, []);
      const proxyQuiredUsersStore = proxyquire("../../../lib/store/Users.js", {
        "../model/User": {
          fromDatabase: fromDatabaseStub
        },
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      await proxyQuiredUsersStore.findAll();
      expect(queryStub).to.have.been.calledOnceWith(
        "SELECT * FROM user LIMIT ? OFFSET ?",
        [20, 0]
      );
    });

    it("should gracefully handle sql errors", async () => {
      const fromDatabaseStub = sinon.stub().returns({email: "test@test.com"});
      const queryStub = sinon.stub().yields("ERROR");
      const proxyQuiredUsersStore = proxyquire("../../../lib/store/Users.js", {
        "../model/User": {
          fromDatabase: fromDatabaseStub
        },
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      try {
        await proxyQuiredUsersStore.findAll();
      } catch (e) {
        expect(e).to.not.be.null;
      }

      expect(queryStub).to.have.been.called;
    });

    it("should resolve with a call to mapToModels", async () => {
      const queryStub = sinon.stub().yields(null, [{email: "test@test.com"}]);
      const proxyQuiredUsersStore = proxyquire("../../../lib/store/Users.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });


      sinon.stub(proxyQuiredUsersStore, "mapToModels");
      proxyQuiredUsersStore.mapToModels.returns([{ id: 1 }]);
      const result = await proxyQuiredUsersStore.findAll();

      expect(proxyQuiredUsersStore.mapToModels).to.have.been.calledWith([{email: "test@test.com"}]);
      expect(result).to.eql([{ id: 1 }]);

    });
  });
});