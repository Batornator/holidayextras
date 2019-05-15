const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

const { REQUESTED_RESOURCE_NOT_FOUND } = require("../../../../../lib/constants/errorCodes");

describe("getById Route", function () {

  const getFakeRes = () => {
    const res = {};
    const jsonFake = sinon.fake.returns(res);
    const statusFake = sinon.fake.returns(res);
    res.status = statusFake;
    res.json = jsonFake;

    return res;
  };

  it("should call User.findById with req.params.userId", async () => {
    const findByIdStub = sinon.stub().resolves({ test: true });
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/getById", {
      "../../../model/User": {
        findById: findByIdStub
      }
    });

    await proxyQuiredRoute({ params: { userId: 1 } }, getFakeRes(), () => { });
    expect(findByIdStub).to.have.been.calledOnceWith(1);
  });


  it("should call resolve the request with a http 200 and a successful json payload with data if successful", async () => {
    const findByIdStub = sinon.stub().resolves({ test: true });
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/getById", {
      "../../../model/User": {
        findById: findByIdStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({ params: { userId: 1 } }, res, () => { });
    expect(findByIdStub).to.have.been.calledOnceWith(1);
    expect(res.status).to.have.been.calledOnceWithExactly(200);
    expect(res.json).to.have.been.calledOnceWith({ success: true, user: { test: true } });
  });

  it("should pass not found errors directly to the error handling middleware", async () => {
    const findByIdStub = sinon.stub().rejects({ code: REQUESTED_RESOURCE_NOT_FOUND });
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/getById", {
      "../../../model/User": {
        findById: findByIdStub
      }
    });

    const res = getFakeRes();
    const callback = sinon.stub();

    await proxyQuiredRoute({ params: { userId: 1 } }, res, callback);
    expect(findByIdStub).to.have.been.calledOnceWith(1);
    expect(callback).to.have.been.calledOnceWith({ code: REQUESTED_RESOURCE_NOT_FOUND });
  });


  it("should wrap other errors before handing off to the error handling middleware", async () => {
    const findByIdStub = sinon.stub().rejects({ code: "TEST" });
    const genericErrorStub = sinon.stub().returns("TEST ERROR");
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/getById", {
      "../../../model/User": {
        findById: findByIdStub
      },
      "../../../utilities/error/error": {
        genericError: genericErrorStub
      }
    });

    const res = getFakeRes();
    const callback = sinon.stub();

    await proxyQuiredRoute({ params: { userId: 1 } }, res, callback);
    expect(findByIdStub).to.have.been.calledOnceWith(1);
    expect(genericErrorStub).to.have.been.calledOnceWith("Error retrieving user", { code: "TEST" });
    expect(callback).to.have.been.calledOnceWith("TEST ERROR");
  });
});