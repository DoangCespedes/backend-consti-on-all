

const bcryptjs = require('bcryptjs');

const encriptarPasswor = async (password = '') => {
    const salt = await bcryptjs.genSalt();
    return await bcryptjs.hash(password, salt);
};

module.exports = {
    encriptarPasswor,
};
