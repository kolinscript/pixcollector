const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Users = mongoose.model('Users');
const helpers = require('./helpers')

const user = {
    getUser: ((req, res, next) => {
        let token;
        let tokenVkId;
        const reqVkID = req.query.id;
        const {headers: {authorization}} = req;

        if (authorization && authorization.split(' ')[0] === 'token') {
            token = authorization.split(' ')[1];
            tokenVkId = jwt.verify(token, 'collector_secret').vkId;
        }

        if (token !== undefined) {
            const tokenVkId = jwt.verify(token, 'collector_secret').vkId;
            const reqVkID = req.query.id;
            if (tokenVkId === reqVkID) {
                // token, user req himself
                // update user from vk - send user
                Users.findOne({vkId: reqVkID}, (err, userDb) => {
                    if (err) { res.status(200).json({body: {error: err}}); }
                    if (userDb) { helpers.UserUpdateVkData(req, res, next, userDb.vkToken, reqVkID); }
                    else { res.status(200).json({body: {error: {text: 'found no user', code: 0}}}); }
                });
            } else {
                // token, user(2) req other user(1)
                // update user(1) from vk (optional)
                // user(2) sysAccessRights 1 or 2 (admin/moderator) - send user(1)
                // user(2) sysAccessRights 3 (casual user)
                // // if user(1) privacyVisible === 1 || 2 (public/authorized)
                // // if user(1) privacyVisible === 3 (private)
                Users.findOne({vkId: tokenVkId}, (err, userDbFromToken) => {
                    if (err) { res.status(200).json({body: {error: err}}); }
                    if (userDbFromToken) {
                        Users.findOne({vkId: reqVkID}, (err, userDbFromReq) => {
                            if (err) { res.status(200).json({body: {error: err}}); }
                            if (userDbFromReq) {
                                if ((userDbFromToken.sysAccessRights === 1) || (userDbFromToken.sysAccessRights === 2)) {
                                    helpers.UserUpdateVkData(req, res, next, userDbFromReq.vkToken, reqVkID);
                                } else if (userDbFromToken.sysAccessRights === 3) {
                                    if ((userDbFromReq.privacyVisible === 1) || (userDbFromReq.privacyVisible === 2)) {
                                        helpers.UserUpdateVkData(req, res, next, userDbFromReq.vkToken, reqVkID);
                                    } else if (userDbFromReq.privacyVisible === 3) {
                                        res.status(200).json({body: {error: {text: 'Private page, sorry.', code: 3}}});
                                    }
                                }
                            }
                            else { res.status(200).json({body: {error: {text: 'found no userDbFromReq', code: 0}}}); }
                        });
                    }
                    else { res.status(200).json({body: {error: {text: 'found no userDbFromToken', code: 0}}}); }
                });
            }
        } else {
            // no token, user(anonymous) req other user(1)
            // if user(1) privacyVisible === 1 [public] - update from vk send user
            //    user(1) privacyVisible === 2 [authorized] - send err (private)
            //    user(1) privacyVisible === 3 [nobody] - send err (private)
            Users.findOne({vkId: reqVkID}, (err, userDb) => {
                if (err) { res.status(200).json({body: {error: err}}); }
                if (userDb) {
                    if (userDb.privacyVisible === 1) {
                        helpers.UserUpdateVkData(req, res, next, userDb.vkToken, reqVkID);
                    } else if (userDb.privacyVisible === 2) {
                        res.status(200).json({body: {error: {text: 'Authorize to view this content.', code: 2}}});
                    } else if (userDb.privacyVisible === 3) {
                        res.status(200).json({body: {error: {text: 'Private page, sorry.', code: 3}}});
                    }
                }
                else { res.status(200).json({body: {error: {text: 'found no user', code: 0}}}); }
            });
        }

    }),

    getUsers: ((req, res, next) => {
        let token;
        const {headers: {authorization}} = req;
        if (authorization && authorization.split(' ')[0] === 'token') {
            token = authorization.split(' ')[1];
        }
        const tokenVkId = jwt.verify(token, 'collector_secret').vkId;

        Users.find((err, usersRaw) => {
            if (err) {
                res.status(200).json({body: {error: err}});
                return console.error(err);
            }
            if (usersRaw) {
                let users = usersRaw.map((user) => {
                    const safeUser = ({vkToken, ...rest}) => rest;
                    return safeUser(user.toAuthJSON());
                });
                Users.findOne({vkId: tokenVkId}, (err, userDbFromToken) => {
                    if (err) { res.status(200).json({body: {error: err}}); }
                    if (userDbFromToken) {
                        if ((userDbFromToken.sysAccessRights === 1) || (userDbFromToken.sysAccessRights === 2)) {
                            res.status(200).json({body: {users: users}});
                        }
                        else if (userDbFromToken.sysAccessRights === 3) {
                            users = users.filter(user => (user.privacyVisible !== 3));
                            res.status(200).json({body: {users: users}});
                        }
                    }
                    else { res.status(200).json({body: {error: {text: 'found no user', code: 0}}}); }
                });
            } else {
                res.status(200).json({body: {error: {text: 'found no user', code: 0}}});
            }
        });
    }),

    updateUser: ((req, res, next) => {
        let token;
        const {headers: {authorization}} = req;
        if (authorization && authorization.split(' ')[0] === 'token') {
            token = authorization.split(' ')[1];
        }
        const reqUser = req.body.user;
        const tokenVkId = jwt.verify(token, 'collector_secret').vkId;
        const reqVkID = reqUser.vkId;

        if (tokenVkId === reqVkID) {
            Users.findOne({
                vkId: reqVkID
            }, (err, user) => {
                if (err) {
                }
                if (user) {
                    if (reqUser.privacyVisible) {
                        user.privacyVisible = reqUser.privacyVisible;
                        user.markModified('privacyVisible');
                    }
                    if (reqUser.privacyDownloadable) {
                        user.privacyDownloadable = reqUser.privacyDownloadable;
                        user.markModified('privacyDownloadable');
                    }
                    user.save()
                        .then(() => {
                                const safeUser = ({_id, vkToken, ...rest}) => rest;
                                res.status(200).json({body: {user: safeUser(user.toAuthJSON())}});
                            }
                        );
                } else {
                }
            });
        }
    }),

    isSelfStock: ((req, res, next) => {
        let token;
        let tokenVkId;
        const reqVkID = req.query.id;
        const {headers: {authorization}} = req;
        if (authorization && authorization.split(' ')[0] === 'token') {
            token = authorization.split(' ')[1];
            tokenVkId = jwt.verify(token, 'collector_secret').vkId;
        }
        if (token !== undefined) {
            if (tokenVkId === reqVkID) {
                res.status(200).json({body: {isSelfStock: true}});
            } else {
                res.status(200).json({body: {isSelfStock: false}});
            }
        } else {
            res.status(200).json({body: {isSelfStock: false}});
        }
    })
};

module.exports = user;
