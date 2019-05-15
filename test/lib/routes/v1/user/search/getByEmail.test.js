const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

describe("getById Route", function () {

  const getFakeRes = () => {
    const res = {};
    const jsonFake = sinon.fake.returns(res);
    const statusFake = sinon.fake.returns(res);
    res.status = statusFake;
    res.json = jsonFake;

    return res;
  };

  it("should throw an error if email is not in the querystring", async () => {
    const findByEmailStub = sinon.stub().resolves([]);
    const genericErrorStub = sinon.stub().returns("TEST ERROR");
    const proxyQuiredRoute = proxyquire("../../../../../../lib/routes/v1/user/search/getByEmail", {
      "../../../../store/Users": {
        findByEmail: findByEmailStub
      },
      "../../../../utilities/error/error": {
        genericError: genericErrorStub
      }
    });

    const res = getFakeRes();
    const callback = sinon.stub();
    try {
      await proxyQuiredRoute({ query: { page: 1, resultsPerPage: 20 } }, res, callback);
    } catch (e) {
      expect(e).to.not.be.null;
      expect(genericErrorStub).to.have.been.calledOnceWith("Email is a required parameter");
      expect(callback).to.have.been.calledOnceWith("TEST ERROR");
    }

    expect(findByEmailStub).to.not.have.been.called;
  });

  it("should call Users.findByEmailByEmail with email and the correct paging params", async () => {
    const findByEmailStub = sinon.stub().resolves([]);
    const proxyQuiredRoute = proxyquire("../../../../../../lib/routes/v1/user/search/getByEmail", {
      "../../../../store/Users": {
        findByEmail: findByEmailStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: { email: "test@test.com", page: 1, resultsPerPage: 20 } }, res, () => { });
    expect(findByEmailStub).to.have.been.calledOnceWith("test@test.com", 1, 20);
  });


  it("should call Users.findByEmail with null page number if not in params", async () => {
    const findByEmailStub = sinon.stub().resolves([]);
    const proxyQuiredRoute = proxyquire("../../../../../../lib/routes/v1/user/search/getByEmail", {
      "../../../../store/Users": {
        findByEmail: findByEmailStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: { email: "test@test.com", resultsPerPage: 20 } }, res, () => { });
    expect(findByEmailStub).to.have.been.calledOnceWith("test@test.com", null, 20);
  });


  it("should call Users.findByEmail with null resultsPerPage if not in params", async () => {
    const findByEmailStub = sinon.stub().resolves([]);
    const proxyQuiredRoute = proxyquire("../../../../../../lib/routes/v1/user/search/getByEmail", {
      "../../../../store/Users": {
        findByEmail: findByEmailStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: { email: "test@test.com", page: 1 } }, res, () => { });
    expect(findByEmailStub).to.have.been.calledOnceWith("test@test.com", 1, null);
  });


  it("should call Users.findByEmail with null for both paging params if not provided", async () => {
    const findByEmailStub = sinon.stub().resolves([]);
    const proxyQuiredRoute = proxyquire("../../../../../../lib/routes/v1/user/search/getByEmail", {
      "../../../../store/Users": {
        findByEmail: findByEmailStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: { email: "test@test.com" } }, res, () => { });
    expect(findByEmailStub).to.have.been.calledOnceWith("test@test.com", null, null);
  });

  it("should call resolve the request with a http 200 and a successful json payload with data if successful", async () => {
    const findByEmailStub = sinon.stub().resolves([]);
    const proxyQuiredRoute = proxyquire("../../../../../../lib/routes/v1/user/search/getByEmail", {
      "../../../../store/Users": {
        findByEmail: findByEmailStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: { email: "test@test.com" } }, res, () => { });
    expect(findByEmailStub).to.have.been.calledOnceWith("test@test.com", null, null);
    expect(res.status).to.have.been.calledOnceWithExactly(200);
    expect(res.json).to.have.been.calledOnceWith({ success: true, users: [] });
  });

  it("should wrap errors before handing off to the error handling middleware", async () => {
    const findByEmailStub = sinon.stub().rejects({ code: "TEST" });
    const genericErrorStub = sinon.stub().returns("TEST ERROR");
    const proxyQuiredRoute = proxyquire("../../../../../../lib/routes/v1/user/search/getByEmail", {
      "../../../../store/Users": {
        findByEmail: findByEmailStub
      },
      "../../../../utilities/error/error": {
        genericError: genericErrorStub
      }
    });

    const res = getFakeRes();
    const callback = sinon.stub();

    await proxyQuiredRoute({ query: { email: "test@test.com" } }, res, callback);
    expect(findByEmailStub).to.have.been.calledOnceWith("test@test.com", null, null);
    expect(genericErrorStub).to.have.been.calledOnceWith("Error retrieving users", { code: "TEST" });
    expect(callback).to.have.been.calledOnceWith("TEST ERROR");
  });
});