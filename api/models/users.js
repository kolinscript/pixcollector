const mongoose           = require('mongoose');
const crypto             = require('crypto');
const jwt                = require('jsonwebtoken');
const { Schema }         = mongoose;

const UsersSchema = new Schema({
    vkId: String,
    vkToken: String,
    name: String,
    avatar: String,
    albumSize: String,
    pixArray: Array
});

UsersSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    // information stored in the token, can be fetched with jwt.verify(token, secret)
    return jwt.sign({
        vkId: this.vkId,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'pix');
};

UsersSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        vkId: this.vkId,
        vkToken: this.vkToken,
        name: this.name,
        avatar: this.avatar,
        albumSize: this.albumSize,
        pixArray: this.pixArray,
        token: this.generateJWT(),
    };
};

mongoose.model('Users', UsersSchema);