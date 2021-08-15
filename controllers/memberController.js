//------------ User Model ------------//
const User = require("../models/User");

exports.getMembers = async (req, res) => {
  const members = await User.find({});

  console.log("users: ", members);

  res.render("d_member", { name: req.user.name, members: members });
};
