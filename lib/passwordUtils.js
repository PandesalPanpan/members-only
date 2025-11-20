const bcrypt = require('bcryptjs');

module.exports.hashPassword = async (password) => {
    const hashedPassword = bcrypt.hash(password, 10);
    return hashedPassword
}

module.exports.validatedPassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);

    return match;
}