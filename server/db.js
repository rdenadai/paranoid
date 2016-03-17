var Sequelize = require('sequelize')
const sjcl = require('./utils/sjcl.js');
var sequelize = new Sequelize('postgres://paranoid:paranoid@localhost:5432/paranoid');

var User = require('./models.js');
const hash_key = require('./enc.js');

User.sync({force: true}).then(function () {
  // Table created
  User.create({
    username: 'user_1',
    name: 'User 1',
    email: 'user_2@gmail.com',
    passwd: sjcl.hash.sha256.hash('user_1_ok').toString()
  });

  User.create({
    username: 'user_2',
    name: 'User 2',
    email: 'user_2@gmail.com',
    passwd: sjcl.hash.sha256.hash('user_2_ok').toString()
  });

  return true;
});
