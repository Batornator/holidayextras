"use strict";

const User = require("../../../model/User");

const errorUtils = require("../../../utilities/error/error");
const ERROR_CODES = require("../../../constants/errorCodes");

module.exports = async (req, res, next) => {
  try {
    const deleted = await User.deleteById(req.params.userId);

    return res.status(200).json({ success: true, deleted: deleted.id });
  } catch (err) {
    if (err.code === ERROR_CODES.REQUESTED_RESOURCE_NOT_FOUND) {
      return next(err);
    }

    return next(errorUtils.genericError("Error deleting user", err));
  }
};