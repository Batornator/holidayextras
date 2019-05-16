const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

describe("get Route", function () {

  const getFakeRes = () => {
    const res = {};
    const jsonFake = sinon.fake.returns(res);
    const statusFake = sinon.fake.returns(res);
    res.status = statusFake;
    res.json = jsonFake;

    return res;
  };

  it("should call Users.findAll with the correct paging params", async () => {
    const findAllStub = sinon.stub().resolves([]);
    const countStub = sinon.stub().resolves(1);
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/get", {
      "../../../store/Users": {
        findAll: findAllStub,
        count: countStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: { page: 1, resultsPerPage: 20 } }, res, () => { });
    expect(findAllStub).to.have.been.calledOnceWith(1, 20);
  });


  it("should call Users.findAll with null page number if not in params", async () => {
    const findAllStub = sinon.stub().resolves([]);
    const countStub = sinon.stub().resolves(1);
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/get", {
      "../../../store/Users": {
        findAll: findAllStub,
        count: countStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: { resultsPerPage: 20 } }, res, () => { });
    expect(findAllStub).to.have.been.calledOnceWith(null, 20);
  });


  it("should call Users.findAll with null resultsPerPage if not in params", async () => {
    const findAllStub = sinon.stub().resolves([]);
    const countStub = sinon.stub().resolves(1);
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/get", {
      "../../../store/Users": {
        findAll: findAllStub,
        count: countStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: { page: 1 } }, res, () => { });
    expect(findAllStub).to.have.been.calledOnceWith(1, null);
  });


  it("should call Users.findAll with null for both paging params if not provided", async () => {
    const findAllStub = sinon.stub().resolves([]);
    const countStub = sinon.stub().resolves(1);
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/get", {
      "../../../store/Users": {
        findAll: findAllStub,
        count: countStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: {} }, res, () => { });
    expect(findAllStub).to.have.been.calledOnceWith(null, null);
  });

  it("should call Users.count once", async () => {
    const findAllStub = sinon.stub().resolves([]);
    const countStub = sinon.stub().resolves(1);
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/get", {
      "../../../store/Users": {
        findAll: findAllStub,
        count: countStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: {} }, res, () => { });
    expect(countStub).to.have.been.calledOnce;
  });

  it("should call resolve the request with a http 200 and a successful json payload with data if successful", async () => {
    const findAllStub = sinon.stub().resolves([]);
    const countStub = sinon.stub().resolves(1);
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/get", {
      "../../../store/Users": {
        findAll: findAllStub,
        count: countStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ query: {} }, res, () => { });
    expect(findAllStub).to.have.been.calledOnceWith(null, null);
    expect(countStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWithExactly(200);
    expect(res.json).to.have.been.calledOnceWith({ success: true, users: [], totalResults: 1 });
  });

  it("should wrap errors before handing off to the error handling middleware", async () => {
    const findAllStub = sinon.stub().rejects({ code: "TEST" });
    const genericErrorStub = sinon.stub().returns("TEST ERROR");
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/get", {
      "../../../store/Users": {
        findAll: findAllStub
      },
      "../../../utilities/error/error": {
        genericError: genericErrorStub
      }
    });

    const res = getFakeRes();
    const callback = sinon.stub();

    await proxyQuiredRoute({ query: {} }, res, callback);
    expect(findAllStub).to.have.been.calledOnceWith(null, null);
    expect(genericErrorStub).to.have.been.calledOnceWith("Error retrieving users", { code: "TEST" });
    expect(callback).to.have.been.calledOnceWith("TEST ERROR");
  });
});