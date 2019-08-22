const User = require('../models/user');

module.exports = async () => {
    const users = await User.find();
    return users;
}