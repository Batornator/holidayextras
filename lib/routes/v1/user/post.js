"use strict";

const User = require("../../../model/User");

const errorUtils = require("../../../utilities/error/error");
const ERROR_CODES = require("../../../constants/errorCodes");

module.exports = async (req, res, next) => {
  const { email, givenName, familyName } = req.body;
  const newUser = new User({ email, givenName, familyName });

  try {
    const createdUser = await newUser.save();

    return res.status(201).json({ success: true, user: createdUser.userDetails });
  } catch (err) {
    if (err.code === ERROR_CODES.MODEL_VALIDATION_ERROR) {
      return next(err);
    }

    return next(errorUtils.modelSaveError("Error creating user", err));
  }
};