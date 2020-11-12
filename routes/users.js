const express = require("express");
const router = express.Router();
const { userAuth } = require('../middleware/authHandler')

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(userAuth, updateUser).delete(userAuth, deleteUser);

module.exports = router;
