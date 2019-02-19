const express = require('express');
const {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    uploadUserPhoto,
    getUserPhoto,
    login
} = require('./userController');
const {
    createProject,
    getAllProject,
    getProjectById,
    closeProjectById,
    addUserToProject
} = require('./projectController');

const router = express.Router();

//USERS
router.get('/users', getAllUsers);
router.get('/users/:page', getAllUsers);
router.get('/user/:id', getUserById);
router.post('/user', createUser);
router.post('/user/avatar/:id', uploadUserPhoto);
router.get('/public/avatars/:photoName', getUserPhoto);
router.delete('/user/:id', deleteUser);

router.post('/login', login);

//PROJECTS
router.get('/projects', getAllProject);
router.get('/project/:id', getProjectById);
router.delete('/project/:id', closeProjectById);
router.post('/project', createProject);
router.get('/project/:projectId/:userId', addUserToProject);

module.exports = router;