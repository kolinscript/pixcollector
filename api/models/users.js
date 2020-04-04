const mongoose           = require('mongoose');
const crypto             = require('crypto');
const jwt                = require('jsonwebtoken');
const { Schema }         = mongoose;

const UsersSchema = new Schema({
    vkId: String,
    albumSize: String,
    hash: String,
    salt: String,
});

UsersSchema.methods.setVkToken = function(vkToken) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(vkToken, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validateVkToken = function(vkToken) {
    const hash = crypto.pbkdf2Sync(vkToken, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    // информация которую мы храним в токене и можем из него получать
    return jwt.sign({
        vkId: this.vkId,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};

UsersSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        vkId: this.vkId,
        albumSize: this.albumSize,
        token: this.generateJWT(),
    };
};

mongoose.model('Users', UsersSchema);