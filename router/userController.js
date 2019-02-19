const yup = require('yup');
const multer = require('multer');
const path = require('path');
const User = require('../models/user.model');
const Project = require('../models/project.model');

//yup validation schemas
const createUserSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(4),
    birthdate: yup.date()
});

const loginUserSchema = yup.object().shape({
    loginEmail: yup.string().required().email(),
    loginPassword: yup.string().required().min(4)
});

module.exports.createUser = (req, res, next) => {
    const data = req.body;
    createUserSchema.isValid(data)
        .then(valid => {
            if (!valid) {
                res.status(404).send('Invalid params');
            } else {
                User.findOne({email: data.email})
                    .then((result) => {
                        if (result != null) {
                            res.json('This email address is already taken');
                        } else {
                            const user = new User(data);
                            user.save()
                                .then(savedUser => {
                                    res.status(200).json({success: true});
                                })
                                .catch(error => {
                                    res.status(404).send({message: 'Server error'});
                                });
                        }
                    });
            }
        })
};

module.exports.deleteUser = (req, res, next) => {
    User.findByIdAndRemove(req.params.id, (err, todo) => {
        if (err) {
            res.status(400);
        } else {
            res.status(200).json('Successfully removed');
        }
    });
};

const LIMIT = 10;
module.exports.getAllUsers = (req, res, next) => {
    let name = req.query.firstName;
    let query;
    if(name) query = {$or:[{firstName: {$regex: name, $options: 'i'}},
            {lastName: {$regex: name, $options: 'i'}}]};
    const {page} = req.params;
    let currentPage = parseInt(page);
    if (!page || page <= 1 || !isFinite(page)) {
        currentPage = 0;
    } else {
        --currentPage;
    }
    const SKIP = currentPage * LIMIT;
    if(page) {
        Promise.all([
            User.find(query).countDocuments(),
            User.find(query)
                .skip(SKIP)
                .limit(LIMIT)
        ])
            .then(([total, users]) => {
                res.json({total, users})
            })
            .catch(err => {
                next(err)
            });
    } else {
        User.find(query)
            .then(users => {
                res.json(users);
            })
            .catch(error => {
                res.status(400).send(error);
            });
    }

};

module.exports.getUserById = (req, res, next) => {
    const userId = req.params.id;
    User.findById(userId)
        .then(user => {
            res.json(user);
        });
};

module.exports.login = (req, res, next) => {
    const data = req.body;
    loginUserSchema.isValid(data)
        .then(valid => {
            if (!valid) {
                res.status(404).send('Invalid params');
            } else {
                User.findOne({email: data.loginEmail, password: data.loginPassword})
                    .then((user) => {
                        if (user == null) {
                            res.status(404).send('User is not found');
                        } else {
                            res.status(200).json(user);
                        }
                    });
            }
        })
};

module.exports.getUserPhoto = (req, res, next) => {
    const {photoName} = req.params;
    if(photoName) {
        res.setHeader("Content-Type", "image/jpeg");
        const photoPath = path.join(__dirname, "..", "public", "avatars", photoName);
        res.status(200).sendFile(photoPath);
    } else {
        res.status(400).send('File not found');
    }
};

module.exports.uploadUserPhoto = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            let fileName;
            const storage = multer.diskStorage({
                destination: './public/avatars/',
                filename: (req, file, cb) => {
                    if(!file.mimetype.includes("image")) throw Error("Invalid image type");
                    fileName =`${user._id}` + '.' + `${file.originalname.split('.')[1]}`;
                    cb(null, fileName);
                }
            });
            const upload = multer({storage: storage}).any();
            upload(req, res, (err) => { 
                if (err) { 
                    return res.status(400).send(error);
                }
                user.photoPath = fileName;
                User.findOneAndUpdate({_id: user._id}, user)
                    .then(user => {
                        if (!user) {
                            return res.status(400).send('No such user');
                        }
                        res.status(200).send(fileName);
                    })
                    .catch(error => {
                        res.status(400).send(error);
                    });
            })
        })
        .catch(error => {
            res.status(400).send(error);
        });
};
