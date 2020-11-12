const Review = require("../models/Review");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

exports.getReviews = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select"];
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  query = Review.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Review.countDocuments();

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

  const reviews = await reviews;

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination: pagination,
    data: reviews,
  });
});

exports.getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 200)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({
    success: true,
    msg: "Review info updated",
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const data = Review.findByIdAndDelete(req.params.id);

  if (!data) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
