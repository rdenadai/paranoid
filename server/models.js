var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://paranoid:paranoid@localhost:5432/paranoid');

var User = sequelize.define('user', {
    uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    username: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING,
        field: 'name' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    email: {
        type: Sequelize.STRING
    },
    passwd: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = User;
