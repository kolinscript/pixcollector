const axios              = require('axios');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

const auth = {
    login: ((req, res, next) => {
        const code = req.query.code;
        const authLink = `https://oauth.vk.com/access_token` +
            `?client_id=7372433` +
            `&client_secret=XgglLIZcB7qB3nNryc8y` +
            `&redirect_uri=https://pixcollector.herokuapp.com/auth` +
            `&code=${code}`;

        axios.get(authLink)
            .then(function (responseAuth) {
                const userLink = `https://api.vk.com/` +
                    `method/users.get` +
                    `?fields=photo_100` +
                    `&access_token=${responseAuth.data.access_token}` +
                    `&v=5.103`;
                const albumLink = `https://api.vk.com/` +
                    `method/photos.getAlbums` +
                    `?owner_id=${responseAuth.data.user_id}` +
                    `&access_token=${responseAuth.data.access_token}` +
                    `&need_system=1` +
                    `&v=5.103`;

                axios.get(userLink)
                    .then(function (responseUser) {
                        const name = `${responseUser.data.response[0].first_name} ${responseUser.data.response[0].last_name}`;
                        const avatar =  responseUser.data.response[0].photo_100;

                        axios.get(albumLink)
                            .then(function (responseAlbum) {
                                const albumSize = responseAlbum.data.response.items.find(item => item.id === -15).size;

                                const countFrom = 0;
                                const countTo = albumSize;

                                const countTotal = countTo - countFrom;
                                const countTotalFloat = countTotal / 1000;
                                const integerPart = Math.floor(countTotalFloat);
                                const floatPart = integerPart === 0
                                    ? countTotal
                                    : (Math.abs(+(countTotalFloat - (Math.floor(countTotalFloat)).toFixed(3))) * 1000);

                                const reqFloatPart = floatPart;
                                const reqIntegerPart = integerPart * 1000;
                                const reqOffset = countFrom;

                                let pixArray = [];

                                if (integerPart === 0) {
                                    // single request
                                    const link = `https://api.vk.com/` +
                                        `method/photos.get` +
                                        `?owner_id=${responseAuth.data.user_id}` +
                                        `&access_token=${responseAuth.data.access_token}` +
                                        `&album_id=saved` +
                                        `&photo_sizes=1` +
                                        `&offset=${reqOffset}` +
                                        `&count=${reqFloatPart}` +
                                        `&v=5.103`;
                                    axios.get(link)
                                        .then(function (response) {
                                            const arr = [];
                                            if (response.data.response) {
                                                response.data.response.items.forEach((item) => {
                                                    // ascending flow
                                                    // S -> M -> X -> Y -> Z -> W
                                                    const sizeW = item.sizes.find(size => size.type === 'w');
                                                    const sizeZ = item.sizes.find(size => size.type === 'z');
                                                    const sizeY = item.sizes.find(size => size.type === 'y');
                                                    const sizeX = item.sizes.find(size => size.type === 'x');
                                                    const sizeM = item.sizes.find(size => size.type === 'm');
                                                    const sizeS = item.sizes.find(size => size.type === 's');

                                                    const safePix= ({ sizes, ...rest }) => rest;

                                                    if (sizeW) {
                                                        arr.push(safePix({...item, ...sizeW}));
                                                    } else if (sizeZ) {
                                                        arr.push(safePix({...item, ...sizeZ}));
                                                    } else if (sizeY) {
                                                        arr.push(safePix({...item, ...sizeY}));
                                                    } else if (sizeX) {
                                                        arr.push(safePix({...item, ...sizeX}));
                                                    } else if (sizeM) {
                                                        arr.push(safePix({...item, ...sizeM}));
                                                    } else if (sizeS) {
                                                        arr.push(safePix({...item, ...sizeS}));
                                                    }
                                                    pixArray = arr;
                                                });
                                            }
                                            const userNew = new Users({
                                                vkId: responseAuth.data.user_id,
                                                vkToken: responseAuth.data.access_token,
                                                name: name,
                                                avatar: avatar,
                                                albumSize: albumSize,
                                                pixArray: pixArray,
                                                privacyVisible: 0,
                                                privacyDownloadable: 0,
                                                sysAccessRights: 2
                                            });

                                            // save new or update existed user to db
                                            Users.findOne({vkId: responseAuth.data.user_id}, (err, user) => {
                                                if (user) {
                                                    user.vkToken = userNew.vkToken;
                                                    user.name = userNew.name;
                                                    user.avatar = userNew.avatar;
                                                    user.albumSize = userNew.albumSize;
                                                    user.pixArray = userNew.pixArray;
                                                    user.markModified('vkToken');
                                                    user.markModified('name');
                                                    user.markModified('avatar');
                                                    user.markModified('albumSize');
                                                    user.markModified('pixArray');
                                                    user.save()
                                                        .then(() => {
                                                                const safeUser = ({ _id, vkToken, ...rest }) => rest;
                                                                req.session.user = safeUser(user.toAuthJSON());
                                                                res.status(200).json( { body: { user: safeUser(user.toAuthJSON()) } });
                                                            }
                                                        );
                                                }
                                                if (!user) {
                                                    userNew.save()
                                                        .then(() => {
                                                                const safeUser = ({ _id, vkToken, ...rest }) => rest;
                                                                req.session.user = safeUser(userNew.toAuthJSON());
                                                                res.status(200).json( { body: { user: safeUser(user.toAuthJSON()) } });
                                                            }
                                                        );
                                                }
                                                if (err) return console.error(err);
                                            });
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        })
                                        .finally(function () {
                                            // always executed
                                        });
                                }
                                else if (integerPart > 0) {
                                    // multiple requests
                                    let offsetLast;
                                    let urlArray = [];
                                    for (let offset = reqOffset, count = 1000; offset < reqIntegerPart; offset = offset + 1000) {
                                        const link = `https://api.vk.com/` +
                                            `method/photos.get` +
                                            `?owner_id=${responseAuth.data.user_id}` +
                                            `&access_token=${responseAuth.data.access_token}` +
                                            `&album_id=saved` +
                                            `&photo_sizes=1` +
                                            `&offset=${offset}` +
                                            `&count=${count}` +
                                            `&v=5.103`;
                                        urlArray.push(link);
                                        offsetLast = offset + 1000;
                                    }
                                    const linkLast = `https://api.vk.com/` +
                                        `method/photos.get` +
                                        `?owner_id=${responseAuth.data.user_id}` +
                                        `&access_token=${responseAuth.data.access_token}` +
                                        `&album_id=saved` +
                                        `&photo_sizes=1` +
                                        `&offset=${offsetLast}` +
                                        `&count=${reqFloatPart}` +
                                        `&v=5.103`;

                                    urlArray.push(linkLast);

                                    const urlArrayPromises = urlArray.map((url) => {
                                        return axios.get(url);
                                    });

                                    async function photosFetcher() {
                                        try {
                                            const result = await axios.all(urlArrayPromises);
                                            const arrays = result.map(r => r.data).map(r => r.response).map(r => r.items);
                                            let photos = [];
                                            arrays.forEach((array) => {
                                                photos = photos.concat(array)
                                            });
                                            const arr = [];
                                            if (photos) {
                                                photos.forEach((item) => {
                                                    // ascending flow
                                                    // S -> M -> X -> Y -> Z -> W
                                                    const sizeW = item.sizes.find(size => size.type === 'w');
                                                    const sizeZ = item.sizes.find(size => size.type === 'z');
                                                    const sizeY = item.sizes.find(size => size.type === 'y');
                                                    const sizeX = item.sizes.find(size => size.type === 'x');
                                                    const sizeM = item.sizes.find(size => size.type === 'm');
                                                    const sizeS = item.sizes.find(size => size.type === 's');

                                                    const safePix= ({ sizes, ...rest }) => rest;

                                                    if (sizeW) {
                                                        arr.push(safePix({...item, ...sizeW}));
                                                    } else if (sizeZ) {
                                                        arr.push(safePix({...item, ...sizeZ}));
                                                    } else if (sizeY) {
                                                        arr.push(safePix({...item, ...sizeY}));
                                                    } else if (sizeX) {
                                                        arr.push(safePix({...item, ...sizeX}));
                                                    } else if (sizeM) {
                                                        arr.push(safePix({...item, ...sizeM}));
                                                    } else if (sizeS) {
                                                        arr.push(safePix({...item, ...sizeS}));
                                                    }
                                                    pixArray = arr;
                                                });
                                            }

                                            const userNew = new Users({
                                                vkId: responseAuth.data.user_id,
                                                vkToken: responseAuth.data.access_token,
                                                name: name,
                                                avatar: avatar,
                                                albumSize: albumSize,
                                                pixArray: pixArray,
                                                privacyVisible: 0,
                                                privacyDownloadable: 0,
                                                sysAccessRights: 2
                                            });

                                            // save new or update existed user to db
                                            Users.findOne({vkId: responseAuth.data.user_id}, (err, user) => {
                                                if (user) {
                                                    user.vkToken = userNew.vkToken;
                                                    user.name = userNew.name;
                                                    user.avatar = userNew.avatar;
                                                    user.albumSize = userNew.albumSize;
                                                    user.pixArray = userNew.pixArray;
                                                    user.markModified('vkToken');
                                                    user.markModified('name');
                                                    user.markModified('avatar');
                                                    user.markModified('albumSize');
                                                    user.markModified('pixArray');
                                                    user.save()
                                                        .then(() => {
                                                                const safeUser = ({ vkToken, ...rest }) => rest;
                                                                req.session.user = safeUser(user.toAuthJSON());
                                                                res.status(200).json( { body: { user: safeUser(user.toAuthJSON()) } });
                                                            }
                                                        );
                                                }
                                                if (!user) {
                                                    userNew.save()
                                                        .then(() => {
                                                                const safeUser = ({ vkToken, ...rest }) => rest;
                                                                req.session.user = safeUser(userNew.toAuthJSON());
                                                                res.status(200).json( { body: { user: safeUser(user.toAuthJSON()) } });
                                                            }
                                                        );
                                                }
                                                if (err) return console.error(err);
                                            });

                                        } catch (error) {
                                            console.error(error);
                                        }
                                    }

                                    photosFetcher();
                                }

                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    }),

    success: ((req, res, next) => {
        if (req.session.user) {
            res.status(200).json( { body: { user: req.session.user } });
        } else {
            res.status(200).json( { body: { error: 'unauthorized' } });
        }
    }),
};

module.exports = auth;