'use strict';
module.exports = function(sequelize, DataTypes) {
  var Device = sequelize.define('Device', {
    model_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Model Name cannot be blank'
        }
      }
    },
    imei: {
      type: DataTypes.STRING,
      validate: {
        numberOfChar: function(value, next) {
          if(value && !/\d{15}/.test(value)) {
            return next('IMEI field failed validation');
          }
          next();
        }
      }
    },
    serial_number: {
      type: DataTypes.STRING, 
      validate: {
        notEmpty: {
          msg: 'Serial Number cannot be blank'
        }
      }
    },
    meid: {
      type: DataTypes.STRING
    },
    esn: {
      type: DataTypes.STRING
    },
    mac_address: {
      type: DataTypes.STRING
    },
    exfactory_date: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Ex-factory date cannot be blank'
        }
      }
    },
    po_number: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'PO Number cannot be blank'
        },
        numberOfChar: function(value, next) {
          if(!/P\d{3}-\d{10}/.test(value)) {
            return next('PO number field failed validation');
          }
          next();
        }
      }
    },
    packaging_number: {
      type: DataTypes.STRING,
      validate: {
        numberOfChar: function(value, next) {
          if(value && !/CP\d{3}-\d{14}/.test(value)) {
            return next('Packaging number field failed validation');
          }
          next();
        }
      }
    },
    sw_version: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'SW Version cannot be blank'
        }
      }
    },
    fw_version: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'FW Version cannot be blank'
        }
      }
    },
    hw_version: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    rework_date: {
      type: DataTypes.DATEONLY
    },
    so_number: {
      type: DataTypes.STRING
    },
    shipment_date: {
      type: DataTypes.DATEONLY
    },
    module_swapped: {
      type: DataTypes.BOOLEAN
    }
  }, {
    tableName: 'devices',
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Device.belongsTo(models.ReworkConfig, {
          foreignKey: 'rework_config_id'
        })
      }
    }
  });
  return Device;
};