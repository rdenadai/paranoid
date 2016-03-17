var Sequelize = require('sequelize')
var sequelize = new Sequelize('paranoid', 'paranoid', 'paranoid', {'dialect': 'sqlite', 'storage': 'paranoid.db'});

var Config = require('./models/config.js');

Config.sync({force: true}).then(function () {
    // Table created
    return Config.create({
        configuration: '{}'
    });
});
