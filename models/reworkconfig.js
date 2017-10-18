'use strict';
module.exports = function(sequelize, DataTypes) {
  var ReworkConfig = sequelize.define('ReworkConfig', {
    script: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    sw_version: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    fw_version: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    notes: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'rework_configs',
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        ReworkConfig.hasMany(models.Device, {
          foreignKey: 'rework_config_id'
        })
      }
    }
  });
  return ReworkConfig;
};