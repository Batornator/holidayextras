const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

const { REQUESTED_RESOURCE_NOT_FOUND } = require("../../../../../lib/constants/errorCodes");

describe("delete Route", function () {

    const getFakeRes = () => {
		const res = {};
		const jsonFake = sinon.fake.returns(res);
		const statusFake = sinon.fake.returns(res);
		res.status = statusFake;
		res.json = jsonFake;

		return res;
	};

  it("should call User.deleteById with req.params.userId", async () => {
    const deleteByIdStub = sinon.stub().resolves( { test: true } );
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/delete", {
      "../../../model/User": {
        deleteById: deleteByIdStub
      }
    });

    await proxyQuiredRoute( { params: { userId: 1 } }, getFakeRes(), () => {} );
    expect(deleteByIdStub).to.have.been.calledOnceWith(1);
  });


  it("should call resolve the request with a http 200 and a successful json payload with data if successful", async () => {
    const deleteByIdStub = sinon.stub().resolves( { id: 1 } );
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/delete", {
      "../../../model/User": {
        deleteById: deleteByIdStub
      }
    });

    const res = getFakeRes();

    await proxyQuiredRoute({params: {userId: 1}}, res, () => {});
    expect(deleteByIdStub).to.have.been.calledOnceWith(1);
    expect(res.status).to.have.been.calledOnceWithExactly(200);
    expect(res.json).to.have.been.calledOnceWith( { success: true, deleted: 1 } );
  });

  it("should pass not found errors directly to the error handling middleware", async () => {
    const deleteByIdStub = sinon.stub().rejects( { code: REQUESTED_RESOURCE_NOT_FOUND } );
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/delete", {
      "../../../model/User": {
        deleteById: deleteByIdStub
      }
    });

    const res = getFakeRes();
    const callback = sinon.stub();

    await proxyQuiredRoute({params: {userId: 1}}, res, callback);
    expect(deleteByIdStub).to.have.been.calledOnceWith(1);
    expect(callback).to.have.been.calledOnceWith({ code: REQUESTED_RESOURCE_NOT_FOUND });
  });


  it("should wrap other errors before handing off to the error handling middleware", async () => {
    const deleteByIdStub = sinon.stub().rejects( { code: "TEST" } );
    const genericErrorStub = sinon.stub().returns( "TEST ERROR" );
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/delete", {
      "../../../model/User": {
        deleteById: deleteByIdStub
      },
      "../../../utilities/error/error": {
        genericError: genericErrorStub
      }
    });

    const res = getFakeRes();
    const callback = sinon.stub();

    await proxyQuiredRoute({params: {userId: 1}}, res, callback);
    expect(deleteByIdStub).to.have.been.calledOnceWith(1);
    expect(genericErrorStub).to.have.been.calledOnceWith( "Error deleting user", { code: "TEST" } );
    expect(callback).to.have.been.calledOnceWith("TEST ERROR");
  });
});