const express = require("express");
const router = express.Router();
const { userAuth } = require('../middleware/authHandler')

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.route("/").get(getUsers);

router.route("/:id").get(getUser).put(userAuth, updateUser).delete(userAuth, deleteUser);

module.exports = router;
