const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

const User = require("../../../lib/model/User");

describe("User Model", function () {

  it("should assign the properties passed in appropriately", () => {
    const user1 = new User({
      email: "test@test.com",
      givenName: "test1",
      familyName: "test2"
    });

    const user2CreateDate = new Date();
    const user2 = new User({
      id: 1,
      email: "test2@test.com",
      givenName: "test3",
      familyName: "test4",
      created: user2CreateDate
    });

    expect(user1.id).to.be.null;
    expect(user1.email).to.equal("test@test.com");
    expect(user1.givenName).to.equal("test1");
    expect(user1.familyName).to.equal("test2");
    expect(user1.created).to.be.null;

    expect(user2.id).to.equal(1);
    expect(user2.email).to.equal("test2@test.com");
    expect(user2.givenName).to.equal("test3");
    expect(user2.familyName).to.equal("test4");
    expect(user2.created).to.equal(user2CreateDate);
  });

  describe("get userDetails", function () {
    it("should be return all populate fields on the model", () => {
      const user1 = new User({
        email: "test@test.com",
        givenName: "test1",
        familyName: "test2"
      });

      const user2CreateDate = new Date();
      const user2 = new User({
        id: 1,
        email: "test2@test.com",
        givenName: "test3",
        familyName: "test4",
        created: user2CreateDate
      });

      user1Details = user1.userDetails;
      user2Details = user2.userDetails;

      expect(user1Details.id).to.be.null;
      expect(user1Details.email).to.equal("test@test.com");
      expect(user1Details.givenName).to.equal("test1");
      expect(user1Details.familyName).to.equal("test2");
      expect(user1Details.created).to.be.null;

      expect(user2Details.id).to.equal(1);
      expect(user2Details.email).to.equal("test2@test.com");
      expect(user2Details.givenName).to.equal("test3");
      expect(user2Details.familyName).to.equal("test4");
      expect(user2Details.created).to.equal(user2CreateDate);
    });
  });

  describe("fromDatabase", () => {
    it("should populate a new model from database fields", () => {
      const createdDate = new Date();
      const user = User.fromDatabase({
        id: 1,
        email: "test@test.com",
        given_name: "test1",
        family_name: "test2",
        created_at: createdDate
      });

      expect(user.id).to.equal(1);
      expect(user.email).to.equal("test@test.com");
      expect(user.givenName).to.equal("test1");
      expect(user.familyName).to.equal("test2");
      expect(user.created).to.equal(createdDate);
    })
  });

  describe("validateUpdate", () => {
    it("should fail if email is blank", () => {
      const validateResult = User.validateUpdate({ email: "", givenName: "test", familyName: "test" });
      expect(validateResult).to.not.be.null;
    });

    it("should fail if email is not in the correct format", () => {
      const validateResult = User.validateUpdate({ email: "abc23352", givenName: "test", familyName: "test" });
      expect(validateResult).to.not.be.null;
    });

    it("should fail if givenName is blank", () => {
      const validateResult = User.validateUpdate({ email: "test@test.com", givenName: "", familyName: "test" });
      expect(validateResult).to.not.be.null;
    });

    it("should fail if familyName is blank", () => {
      const validateResult = User.validateUpdate({ email: "test@test.com", givenName: "test", familyName: "" });
      expect(validateResult).to.not.be.null;
    });

    it("should allow nulls for each field", () => {
      const validateResult = User.validateUpdate({ email: null, givenName: null, familyName: null });
      expect(validateResult).to.be.null;
    });

    it("should pass if all values are provided and email is in xxx@xxx format", () => {
      const validateResult = User.validateUpdate({ email: "test@test.com", givenName: "test", familyName: "test" });
      expect(validateResult).to.be.null;
    });
  });

  describe("validate", () => {
    it("should fail if email is blank", () => {
      const user = new User({ email: "", givenName: "test", familyName: "test" })
      const validateResult = user.validate();
      expect(validateResult).to.not.be.null;

      const user2 = new User({ email: null, givenName: "test", familyName: "test" })
      const validateResult2 = user2.validate();
      expect(validateResult2).to.not.be.null;
    });

    it("should fail if email is not in the correct format", () => {
      const user = new User({ email: "aaa2421", givenName: "test", familyName: "test" })
      const validateResult = user.validate();
      expect(validateResult).to.not.be.null;
    });

    it("should fail if givenName is blank", () => {
      const user = new User({ email: "test@test.com", givenName: "", familyName: "test" })
      const validateResult = user.validate();
      expect(validateResult).to.not.be.null;

      const user2 = new User({ email: "test@test.com", givenName: null, familyName: "test" })
      const validateResult2 = user2.validate();
      expect(validateResult2).to.not.be.null;
    });

    it("should fail if familyName is blank or null", () => {
      const user = new User({ email: "test@test.com", givenName: "test", familyName: "" })
      const validateResult = user.validate();
      expect(validateResult).to.not.be.null;

      const user2 = new User({ email: "test@test.com", givenName: "test", familyName: null })
      const validateResult2 = user2.validate();
      expect(validateResult2).to.not.be.null;
    });

    it("should pass if all values are provided and email is in xxx@xxx format", () => {

      const user = new User({ email: "test@test.com", givenName: "test", familyName: "test" })
      const validateResult = user.validate();
      expect(validateResult).to.be.null;
    });
  });

  describe("save", () => {
    it("should reject with an error if validation fails", async () => {
      const queryStub = sinon.stub().yields(null, { insertId: 1 });
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      const user = new proxyQuiredUser();
      try {
        await user.save();
      } catch (e) {
        expect(e).to.not.be.null;
      }

      expect(queryStub).to.not.have.been.called;

    });

    it("should call db.query with the appropriate sql and values", async () => {
      const queryStub = sinon.stub().yields(null, { insertId: 1 });
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      sinon.stub(proxyQuiredUser, "findById");
      proxyQuiredUser.findById.resolves({});

      const user = new proxyQuiredUser({ email: "test@test.com", givenName: "test1", familyName: "test2" });

      await user.save();
      expect(queryStub).to.have.been.calledOnceWith(
        "INSERT INTO user (email, given_name, family_name) VALUES (?, ?, ?)",
        ["test@test.com", "test1", "test2"]
      );
    });
    it("should call findById with the inserted ID if successful", async () => {
      const queryStub = sinon.stub().yields(null, { insertId: 1 });
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      sinon.stub(proxyQuiredUser, "findById");
      proxyQuiredUser.findById.resolves({});

      const user = new proxyQuiredUser({ email: "test@test.com", givenName: "test1", familyName: "test2" });

      await user.save();
      expect(proxyQuiredUser.findById).to.have.been.calledOnceWith(1);

    });

    it("should gracefully handle insert errors", async () => {
      const queryStub = sinon.stub().yields("ERROR");
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      sinon.stub(proxyQuiredUser, "findById");
      proxyQuiredUser.findById.resolves({});

      const user = new proxyQuiredUser({ email: "test@test.com", givenName: "test1", familyName: "test2" });

      try {
        await user.save();
      } catch (e) {
        expect(e).to.not.be.null;
      }
      expect(proxyQuiredUser.findById).to.not.have.been.called;
    });

    it("should gracefully handle findById errors", async () => {
      const queryStub = sinon.stub().yields(null, { insertId: 1 });
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      sinon.stub(proxyQuiredUser, "findById");
      proxyQuiredUser.findById.rejects("error");

      const user = new proxyQuiredUser({ email: "test@test.com", givenName: "test1", familyName: "test2" });

      try {
        await user.save();
      } catch (e) {
        expect(e).to.not.be.null;
      }
      expect(proxyQuiredUser.findById).to.have.been.called;

    });
  });

  describe("findById", () => {
    it("should call db.query with the appropriate sql and values", async () => {
      const queryStub = sinon.stub().yields(null, [{ id: 1 }]);
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      await proxyQuiredUser.findById(1);
      expect(queryStub).to.have.been.calledOnceWith(
        "SELECT * FROM user WHERE id = ?",
        [1]
      );
    });

    it("should reject with a not found if there are no results", async () => {
      const queryStub = sinon.stub().yields(null, []);
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      try {
        await proxyQuiredUser.findById(1);
      } catch (e) {
        expect(e.code).to.equal("REQUESTED_RESOURCE_NOT_FOUND");
      }

      expect(queryStub).to.have.been.called;

    });

    it("should gracefully handle sql errors", async () => {
      const queryStub = sinon.stub().yields("ERROR");
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      try {
        await proxyQuiredUser.findById(1);
      } catch (e) {
        expect(e).to.not.be.null;
      }

      expect(queryStub).to.have.been.called;
    });

    it("should resolve with a call to fromDatabase", async () => {
      const queryStub = sinon.stub().yields(null, [{ id: 1 }]);
      const proxyQuiredUser = proxyquire("../../../lib/model/User.js", {
        "../utilities/database/mysql": {
          query: queryStub
        }
      });

      sinon.stub(proxyQuiredUser, "fromDatabase");
      proxyQuiredUser.fromDatabase.returns({ id: 1 });
      const result = await proxyQuiredUser.findById(1);

      expect(proxyQuiredUser.fromDatabase).to.have.been.calledWith({ id: 1 });
      expect(result).to.eql({ id: 1 });

    });
  });
});