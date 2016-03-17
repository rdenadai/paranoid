var Sequelize = require('sequelize')
var sequelize = new Sequelize('paranoid', 'paranoid', 'paranoid', {'dialect': 'sqlite', 'storage': 'paranoid.db'});

var Config = sequelize.define('config', {
    uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    configuration: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = Config;
