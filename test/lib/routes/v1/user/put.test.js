const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

const { MODEL_VALIDATION_ERROR } = require("../../../../../lib/constants/errorCodes");

describe("put Route", function () {

    const getFakeRes = () => {
		const res = {};
		const jsonFake = sinon.fake.returns(res);
		const statusFake = sinon.fake.returns(res);
		res.status = statusFake;
		res.json = jsonFake;

		return res;
	};

  it("should call User.updateById with req.params.userId and the params from request body", async () => {
    const updateByIdStub = sinon.stub().resolves( { test: true } );
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/put", {
      "../../../model/User": {
        updateById: updateByIdStub
      }
    });

    const body = { email: "test@tets.com", givenName: "test1", familyName: "test2" };
    await proxyQuiredRoute( { params: { userId: 1 }, body: body}, getFakeRes(), () => {} );
    expect(updateByIdStub).to.have.been.calledOnceWith(1, body);
  });


  it("should call resolve the request with a http 200 and a successful json payload with data if successful", async () => {
    const updateByIdStub = sinon.stub().resolves( { userDetails: {} } );
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/put", {
      "../../../model/User": {
        updateById: updateByIdStub
      }
    });
    
    const body = { email: "test@tets.com", givenName: "test1", familyName: "test2" };
    const res = getFakeRes();

    await proxyQuiredRoute( { params: { userId: 1 }, body: body}, res, () => {} );
    expect(updateByIdStub).to.have.been.calledOnceWith(1, body);
    expect(res.status).to.have.been.calledOnceWithExactly(200);
    expect(res.json).to.have.been.calledOnceWith( { success: true, user: {} } );
  });

  it("should pass validation errors directly to the error handling middleware", async () => {
    const updateByIdStub = sinon.stub().rejects( { code: MODEL_VALIDATION_ERROR } );
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/put", {
      "../../../model/User": {
        updateById: updateByIdStub
      }
    });
    
    const body = { email: "test@tets.com", givenName: "test1", familyName: "test2" };
    const res = getFakeRes();
    const callback = sinon.stub();

    await proxyQuiredRoute( { params: { userId: 1 }, body: body}, res, callback );
    expect(updateByIdStub).to.have.been.calledOnceWith(1, body);
    expect(callback).to.have.been.calledOnceWith({ code: MODEL_VALIDATION_ERROR }); 
 });


  it("should wrap other errors before handing off to the error handling middleware", async () => {
    const updateByIdStub = sinon.stub().rejects( { code: "TEST" } );
    const modelSaveErrorStub = sinon.stub().returns( "TEST ERROR" );
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/put", {
      "../../../model/User": {
        updateById: updateByIdStub
      },
      "../../../utilities/error/error": {
        modelSaveError: modelSaveErrorStub
      }
    });
    
    const body = { email: "test@tets.com", givenName: "test1", familyName: "test2" };
    const res = getFakeRes();
    const callback = sinon.stub();

    await proxyQuiredRoute( { params: { userId: 1 }, body: body}, res, callback );
    expect(updateByIdStub).to.have.been.calledOnceWith(1, body);
    expect(modelSaveErrorStub).to.have.been.calledOnceWith( "Error updating user", { code: "TEST" } );
    expect(callback).to.have.been.calledOnceWith("TEST ERROR");
  });
});