const axios              = require('axios');
const mongoose           = require('mongoose');
const jwt                = require('jsonwebtoken');
const Users              = mongoose.model('Users');

const user = {
    getUser: ((req, res, next) => {
        const { headers: { authorization } } = req;
        let token;
        let tokenVkId;
        if(authorization && authorization.split(' ')[0] === 'token') {
            token = authorization.split(' ')[1];
            tokenVkId = jwt.verify(token, 'collector_secret').vkId;
        }
        const reqVkID = req.query.id;

        console.log('token:____', token);
        console.log('tokenVkId:____', tokenVkId);
        console.log('reqVkID:____', reqVkID);

        Users.findOne({
            vkId: reqVkID
        }, (err, userRoot) => {
            if (err) {
                res.status(200).json( { body: { error: err } });
                return console.error(err);
            }
            if (userRoot) {
                const safeUser = ({ vkToken, ...rest }) => rest;
                res.status(200).json( { body: { user: safeUser(userRoot.toAuthJSON()) } });
                // const userLink = `https://api.vk.com/` +
                //     `method/users.get` +
                //     `?fields=photo_50` +
                //     `&access_token=${userRoot.vkToken}` +
                //     `&v=5.103`;
                // const albumLink = `https://api.vk.com/` +
                //     `method/photos.getAlbums` +
                //     `?owner_id=${userRoot.vkId}` +
                //     `&access_token=${userRoot.vkToken}` +
                //     `&need_system=1` +
                //     `&v=5.103`;
                //
                // axios.get(userLink)
                //     .then(function (responseUser) {
                //         console.log('responseUser: ', responseUser);
                //         const name = `${responseUser.data.response[0].first_name} ${responseUser.data.response[0].last_name}`;
                //         const avatar =  responseUser.data.response[0].photo_50;
                //
                //         axios.get(albumLink)
                //             .then(function (responseAlbum) {
                //                 const albumSize = responseAlbum.data.response.items.find(item => item.id === -15).size;
                //
                //                 const countFrom = 0;
                //                 const countTo = albumSize;
                //
                //                 const countTotal = countTo - countFrom;
                //                 const countTotalFloat = countTotal / 1000;
                //                 const integerPart = Math.floor(countTotalFloat);
                //                 const floatPart = integerPart === 0
                //                     ? countTotal
                //                     : (Math.abs(+(countTotalFloat - (Math.floor(countTotalFloat)).toFixed(3))) * 1000);
                //
                //                 const reqFloatPart = floatPart;
                //                 const reqIntegerPart = integerPart * 1000;
                //                 const reqOffset = countFrom;
                //
                //                 let pixArray = [];
                //
                //                 if (integerPart === 0) {
                //                     // single request
                //                     const link = `https://api.vk.com/` +
                //                         `method/photos.get` +
                //                         `?owner_id=${userRoot.vkId}` +
                //                         `&access_token=${userRoot.vkToken}` +
                //                         `&album_id=saved` +
                //                         `&photo_sizes=1` +
                //                         `&offset=${reqOffset}` +
                //                         `&count=${reqFloatPart}` +
                //                         `&v=5.103`;
                //                     axios.get(link)
                //                         .then(function (response) {
                //                             const arr = [];
                //                             if (response.data.response) {
                //                                 response.data.response.items.forEach((item) => {
                //                                     // ascending flow
                //                                     // S -> M -> X -> Y -> Z -> W
                //                                     const sizeW = item.sizes.find(size => size.type === 'w');
                //                                     const sizeZ = item.sizes.find(size => size.type === 'z');
                //                                     const sizeY = item.sizes.find(size => size.type === 'y');
                //                                     const sizeX = item.sizes.find(size => size.type === 'x');
                //                                     const sizeM = item.sizes.find(size => size.type === 'm');
                //                                     const sizeS = item.sizes.find(size => size.type === 's');
                //                                     if (sizeW) {
                //                                         arr.push(sizeW);
                //                                     } else if (sizeZ) {
                //                                         arr.push(sizeZ);
                //                                     } else if (sizeY) {
                //                                         arr.push(sizeY);
                //                                     } else if (sizeX) {
                //                                         arr.push(sizeX);
                //                                     } else if (sizeM) {
                //                                         arr.push(sizeM);
                //                                     } else if (sizeS) {
                //                                         arr.push(sizeS);
                //                                     }
                //                                     pixArray = arr;
                //                                 });
                //                             }
                //                             const userNew = new Users({
                //                                 vkId: userRoot.vkId,
                //                                 vkToken: userRoot.vkToken,
                //                                 name: name,
                //                                 avatar: avatar,
                //                                 albumSize: albumSize,
                //                                 pixArray: pixArray
                //                             });
                //
                //                             // save new or update existed user to db
                //                             userRoot.vkToken = userNew.vkToken;
                //                             userRoot.name = userNew.name;
                //                             userRoot.avatar = userNew.avatar;
                //                             userRoot.albumSize = userNew.albumSize;
                //                             userRoot.pixArray = userNew.pixArray;
                //                             userRoot.markModified('vkToken');
                //                             userRoot.markModified('name');
                //                             userRoot.markModified('avatar');
                //                             userRoot.markModified('albumSize');
                //                             userRoot.markModified('pixArray');
                //                             userRoot.save()
                //                                 .then(() => {
                //                                         const safeUser = ({ vkToken, ...rest }) => rest;
                //                                         res.status(200).json( { body: { user: safeUser(userRoot.toAuthJSON()) } });
                //                                     }
                //                                 );
                //                         })
                //                         .catch(function (error) {
                //                             console.log(error);
                //                         })
                //                         .finally(function () {
                //                             // always executed
                //                         });
                //                 }
                //                 else if (integerPart > 0) {
                //                     // multiple requests
                //                     let offsetLast;
                //                     let urlArray = [];
                //                     for (let offset = reqOffset, count = 1000; offset < reqIntegerPart; offset = offset + 1000) {
                //                         const link = `https://api.vk.com/` +
                //                             `method/photos.get` +
                //                             `?owner_id=${userRoot.vkId}` +
                //                             `&access_token=${userRoot.vkToken}` +
                //                             `&album_id=saved` +
                //                             `&photo_sizes=1` +
                //                             `&offset=${offset}` +
                //                             `&count=${count}` +
                //                             `&v=5.103`;
                //                         urlArray.push(link);
                //                         offsetLast = offset + 1000;
                //                     }
                //                     const linkLast = `https://api.vk.com/` +
                //                         `method/photos.get` +
                //                         `?owner_id=${userRoot.vkId}` +
                //                         `&access_token=${userRoot.vkToken}` +
                //                         `&album_id=saved` +
                //                         `&photo_sizes=1` +
                //                         `&offset=${offsetLast}` +
                //                         `&count=${reqFloatPart}` +
                //                         `&v=5.103`;
                //
                //                     urlArray.push(linkLast);
                //
                //                     const urlArrayPromises = urlArray.map((url) => {
                //                         return axios.get(url);
                //                     });
                //
                //                     async function photosFetcher() {
                //                         try {
                //                             const result = await axios.all(urlArrayPromises);
                //                             const arrays = result.map(r => r.data).map(r => r.response).map(r => r.items);
                //                             let photos = [];
                //                             arrays.forEach((array) => {
                //                                 photos = photos.concat(array)
                //                             });
                //                             const arr = [];
                //                             if (photos) {
                //                                 photos.forEach((item) => {
                //                                     // ascending flow
                //                                     // S -> M -> X -> Y -> Z -> W
                //                                     const sizeW = item.sizes.find(size => size.type === 'w');
                //                                     const sizeZ = item.sizes.find(size => size.type === 'z');
                //                                     const sizeY = item.sizes.find(size => size.type === 'y');
                //                                     const sizeX = item.sizes.find(size => size.type === 'x');
                //                                     const sizeM = item.sizes.find(size => size.type === 'm');
                //                                     const sizeS = item.sizes.find(size => size.type === 's');
                //                                     if (sizeW) {
                //                                         arr.push(sizeW);
                //                                     } else if (sizeZ) {
                //                                         arr.push(sizeZ);
                //                                     } else if (sizeY) {
                //                                         arr.push(sizeY);
                //                                     } else if (sizeX) {
                //                                         arr.push(sizeX);
                //                                     } else if (sizeM) {
                //                                         arr.push(sizeM);
                //                                     } else if (sizeS) {
                //                                         arr.push(sizeS);
                //                                     }
                //                                     pixArray = arr;
                //                                 });
                //                             }
                //
                //                             const userNew = new Users({
                //                                 vkId: userRoot.vkId,
                //                                 vkToken: userRoot.vkToken,
                //                                 name: name,
                //                                 avatar: avatar,
                //                                 albumSize: albumSize,
                //                                 pixArray: pixArray
                //                             });
                //
                //                             // save new or update existed user to db
                //                             userRoot.vkToken = userNew.vkToken;
                //                             userRoot.name = userNew.name;
                //                             userRoot.avatar = userNew.avatar;
                //                             userRoot.albumSize = userNew.albumSize;
                //                             userRoot.pixArray = userNew.pixArray;
                //                             userRoot.markModified('vkToken');
                //                             userRoot.markModified('name');
                //                             userRoot.markModified('avatar');
                //                             userRoot.markModified('albumSize');
                //                             userRoot.markModified('pixArray');
                //                             userRoot.save()
                //                                 .then(() => {
                //                                         const safeUser = ({ vkToken, ...rest }) => rest;
                //                                         res.status(200).json( { body: { user: safeUser(userRoot.toAuthJSON()) } });
                //                                     }
                //                                 );
                //
                //                         } catch (error) {
                //                             console.error(error);
                //                         }
                //                     }
                //
                //                     photosFetcher();
                //                 }
                //
                //             })
                //             .catch(function (error) {
                //                 console.log(error);
                //             });
                //     })
                //     .catch(function (error) {
                //         console.log(error);
                //     });
            } else {
                res.status(200).json( { body: { error: 'found no user' } });
            }
        });
    }),

    getUsers: ((req, res, next) => {
        Users.find( (err, usersRaw) => {
            if (err) {
                res.status(200).json( { body: { error: err } });
                return console.error(err);
            }
            if (usersRaw) {
                const users = usersRaw.map((user) => {
                    const safeUser = ({ vkToken, ...rest }) => rest;
                    return safeUser(user.toAuthJSON());
                });
                res.status(200).json( { body: { users: users } });
            } else {
                res.status(200).json( { body: { error: 'found no users' } });
            }
        });
    }),

    updateUser: ((req, res, next) => {
        let token;
        const { headers: { authorization } } = req;
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
                if (err) {}
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
                                const safeUser = ({ _id, vkToken, ...rest }) => rest;
                                res.status(200).json({ body: { user: safeUser(user.toAuthJSON()) } });
                            }
                        );
                }
                else {}
            });
        }
    }),

    isSelfStock: ((req, res, next) => {
        let token;
        const { headers: { authorization } } = req;
        if (authorization && authorization.split(' ')[0] === 'token') {
            token = authorization.split(' ')[1];
        }
        const tokenVkId = jwt.verify(token, 'collector_secret').vkId;
        const reqVkID = req.query.id;
        if (tokenVkId === reqVkID) {
            res.status(200).json({ body: { isSelfStock: true } });
        } else {
            res.status(200).json({ body: { isSelfStock: false } });
        }
    })
};

module.exports = user;