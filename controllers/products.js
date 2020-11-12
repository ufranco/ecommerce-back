const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

exports.getProducts = asyncHandler(async (req, res) => {
  let query;
  const reqQuery = { ...request.query };

  const removeFields = ["select"];

  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  query = Product.find(JSON.parse(queryStr));

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
  const total = await Product.countDocuments();

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

  const products = await query;

  res.status(200).json({
    success: true,
    count: products.length,
    pagination: pagination,
    data: products,
  });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Produ8ct not found with id of ${req.params.id}`, 200)
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({
    success: true,
    msg: "Product info updated",
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = Product.findOneAndDelete(req.params.id);

  if (!product) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: {} });
});
