const User = require("./users.mongo");

async function saveUser(user) {
  await User.findOneAndUpdate({ email: user.email }, user, { upsert: true });
}

async function getUser(email) {
  return await User.findOne({ email });
}

module.exports = {
  saveUser,
  getUser,
};
