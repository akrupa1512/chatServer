const mongoose = require('mongoose');

require('../models/user.model');
require('../models/project.model');
require('../models/task.model');

mongoose.connect(
    'mongodb://localhost/projects',
    {useNewUrlParser: true},
    (error, test) => {
        if (error) {
            process.exit(1);
        }
        console.log('Database connected successfully');
    });

mongoose.set('debug', true);

module.exports = mongoose;