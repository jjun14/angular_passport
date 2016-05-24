var bcrypt = require('bcrypt-nodejs');

var createHash = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = createHash;