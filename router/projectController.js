const yup = require('yup');
const Project = require('../models/project.model');
const User = require('../models/user.model');

const createProjectSchema = yup.object().shape({
    name: yup.string().required(),
    author: yup.string().required()
});

module.exports.createProject = (req, res, next) => {
    const data = req.body;
    createProjectSchema.isValid(data)
        .then(valid => {
            if (!valid) {
                res.status(404).send('Invalid params');
            } else {
                const project = new Project(data);
                project.users.push(data.author);
                project.save()
                    .then(savedProject => {
                        Project.findById(savedProject._id)
                            .populate({path: 'author', select: 'firstName lastName'})
                            .then(project => {
                                res.status(200).json(project);
                            });
                    })
                    .catch(error => {
                        res.status(404).send({message: 'Server error'});
                    });
            }
        });
};

module.exports.getAllProject = (req, res, next) => {
    Project.find()
        .sort([['createdDay', 'desc']])
        .populate({path: 'author', select: 'firstName lastName'})
        .then(projects => {
            res.json(projects);
        })
};

module.exports.getProjectById = (req, res, next) => {
    setTimeout(() => Project.findById(req.params.id)
        .populate({path: 'users', select: 'firstName lastName email photoPath'})
        .populate({path: 'author', select: 'firstName lastName'})
        .then(project => {
            res.json(project);
        }), 1500);
};

module.exports.closeProjectById = (req, res, next) => {
    Project.findByIdAndUpdate(req.params.id, {active: false}, {new: true})
        .populate({path: 'users', select: 'firstName lastName email photoPath'})
        .populate({path: 'author', select: 'firstName lastName'})
        .then(project => {
            res.json(project);
        })
        .catch(error => {
            res.status(404).send({message: 'Server error'});
        });
};

module.exports.addUserToProject = (req, res,  next) => {
    console.log(req.params);
    const {userId, projectId} = req.params;
    User.findById(userId, "firstName lastName email photoPath")
        .then(user => {
            Project.findByIdAndUpdate(projectId,{"$push": {"users": userId}})
                .then((project) => {
                    res.status(200).send(user);
                })
        })
        .catch(error => {
            res.status(404).send(error);
        });
};

module.exports.deactivateProject = (req, res, next) => {

};