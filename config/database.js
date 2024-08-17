const { Sequelize } = require('sequelize');

//create a new instance of Sequelize
const sequelize = new Sequelize( 'u591964893_expense', 'u591964893_pankaj999', 'm?7gY5Sq]C',{
    host: '89.117.27.1',
    dialect: 'mysql'
});

module.exports = sequelize;