const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

exports.getUsers = asyncHandler(async (req, res) => {
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ["select"];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  query = User.find(JSON.parse(queryStr));
  
  let fields = req.query.select ? req.query.select.split(",")
  : 
  [];

  fields.push('-password');
  query = query.select(fields.join(" "));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
  } else {
    query = query.sort("username");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await User.countDocuments();

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit,
    };
  }

  query = query.skip(startIndex).limit(limit);

  const users = await query;

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: pagination,
    data: users,
  });

});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${request.params.id}`, 200)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });

});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({
    success: true,
    msg: "User info updated",
  });

});

exports.deleteUser = asyncHandler( async (req, res) => {
  const data = User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({
    success: true,
    data: {},
  });

});
