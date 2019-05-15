const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.should();
chai.use(sinonChai);

const { MODEL_VALIDATION_ERROR } = require("../../../../../lib/constants/errorCodes");

describe("post Route", function () {

  const getFakeRes = () => {
		const res = {};
		const jsonFake = sinon.fake.returns(res);
		const statusFake = sinon.fake.returns(res);
		res.status = statusFake;
		res.json = jsonFake;

		return res;
  };
  
  const getStubs = (saveShouldFail, shouldBeValidationError) => {
    const userModel = require("../../../../../lib/model/User");
    const saveStub = sinon.stub();

    if (saveShouldFail) {
      saveStub.rejects({ code: shouldBeValidationError ? MODEL_VALIDATION_ERROR : "TEST" })
    } else {
      saveStub.resolves( { userDetails: {} } );
    }

    const userModelStub = sinon.spy(function () {
      return sinon.createStubInstance(userModel, { save: saveStub });
    });

    const modelSaveErrorStub = sinon.stub().returns( "TEST ERROR" );
  
    const proxyQuiredRoute = proxyquire("../../../../../lib/routes/v1/user/post", {
      "../../../model/User": userModelStub,
      "../../../utilities/error/error": {
        modelSaveError: modelSaveErrorStub
      }
    });

    return {
      route: proxyQuiredRoute,
      saveStub: saveStub,
      userModelStub: userModelStub,
      modelSaveErrorStub: modelSaveErrorStub
    };
  }

  it("should create a User model with the correct properties and call its save method", async () => {
    const stubs = getStubs();
    const body = { email: "test@test.com", givenName: "Test 1", familyName: "Test 2" };

    await stubs.route( { body: body }, getFakeRes(), () => {} );
    expect(stubs.userModelStub).to.have.been.calledWithNew;
    expect(stubs.userModelStub).to.have.been.calledOnceWith(body);
    expect(stubs.saveStub).to.have.been.calledOnce;
  });


  it("should call resolve the request with a http 201 and a successful json payload with data if successful", async () => {
    const stubs = getStubs();
    const res = getFakeRes();
    const body = { email: "test@test.com", givenName: "Test 1", familyName: "Test 2" };

    await stubs.route( { body: body }, res, () => {} );
    expect(stubs.saveStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWithExactly(201);
    expect(res.json).to.have.been.calledOnceWith( { success: true, user: {} } );
  });

  it("should pass validation errors directly to the error handling middleware", async () => {
    const stubs = getStubs(true, true);
    const res = getFakeRes();
    const body = { email: "test@test.com", givenName: "Test 1", familyName: "Test 2" };
    const callback = sinon.stub();
    await stubs.route( { body: body }, res, callback );
    expect(stubs.saveStub).to.have.been.calledOnce;
    expect(callback).to.have.been.calledOnceWith( { code: MODEL_VALIDATION_ERROR } );
  });


  it("should wrap other errors before handing off to the error handling middleware", async () => {
    const stubs = getStubs(true);
    const res = getFakeRes();
    const body = { email: "test@test.com", givenName: "Test 1", familyName: "Test 2" };
    const callback = sinon.stub();
    await stubs.route( { body: body }, res, callback );

    expect(stubs.saveStub).to.have.been.calledOnce;
    expect(stubs.modelSaveErrorStub).to.have.been.calledOnceWith( "Error creating user", { code: "TEST" } );
    expect(callback).to.have.been.calledOnceWith("TEST ERROR");
  });
});