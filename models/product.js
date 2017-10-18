'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    product_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    cogs: {
      type: DataTypes.FLOAT(12, 8),
      validate: {
        notEmpty: true
      }
    },
    selling_price: {
      type: DataTypes.FLOAT(12, 8),
      validate: {
        notEmpty: true
      }
    },
    slope: {
      type: DataTypes.FLOAT(9, 8),
      validate: {
        notEmpty: true
      }
    },
    mpd: {
      type: DataTypes.FLOAT(3, 2),
      validate: {
        notEmpty: true
      }
    },
    cellular_type: {
      type: DataTypes.STRING
    },
    territories_operators: {
      type: DataTypes.STRING
    },
    spq: {
      type: DataTypes.INTEGER
    },
    moq: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'products',
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Product;
};