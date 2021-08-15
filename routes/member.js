const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");
const memberController = require("../controllers/memberController");

//------------ member ------------//
router.get("/", ensureAuthenticated, memberController.getMembers);

module.exports = router;
