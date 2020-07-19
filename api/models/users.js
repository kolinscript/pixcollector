const mongoose           = require('mongoose');
const crypto             = require('crypto');
const jwt                = require('jsonwebtoken');
const { Schema }         = mongoose;

const UsersSchema = new Schema({
    vkId: String,
    vkToken: String,
    vkTokenIF: String, // Implicit Flow access_token for user-side requests
    name: String,
    avatar: String,
    albumSize: String,
    pixArray: Array,
    privacyVisible: Number, // 1 public, 2 private - authorized, 3 private - nobody
    privacyDownloadable: Number, // 1 public, 2 private - authorized, 3 private - nobody
    sysAccessRights: Number // 1 admin, 2 moderator, 3 user
});

UsersSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    // information stored in the token, can be fetched with jwt.verify(token, secret)
    return jwt.sign({
        vkId: this.vkId,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'collector_secret');
};

UsersSchema.methods.toAuthJSON = function() {
    return {
        vkId: this.vkId,
        vkToken: this.vkToken,
        name: this.name,
        avatar: this.avatar,
        albumSize: this.albumSize,
        pixArray: this.pixArray,
        privacyVisible: this.privacyVisible,
        privacyDownloadable: this.privacyDownloadable,
        sysAccessRights: this.sysAccessRights,
        token: this.generateJWT(),
    };
};

mongoose.model('Users', UsersSchema);
