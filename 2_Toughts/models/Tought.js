const { DataTypes } = require('sequelize');

const db = require('../db/conn.js');

// User model
const User = require('./User');

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
});

// Relationship
User.hasMany(Tought);
Tought.belongsTo(User);

module.exports = Tought;