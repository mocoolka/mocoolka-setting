// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-tools
// LICENSE: MIT

let { fileTools, moduleTools, objectTools, errorTools,  watchTools, typeTools }
  = require('mocoolka-tools');
const setting = require('../mk-setting.json').setting;
let moduleSetting=objectTools.clone(setting);
/**
 * Mocoolka Setting manage module init
 */
class Setting {

  /**
   * Apply application setting to module setting.
   *
   * Read **app.mk-setting.json** root property that equal module name and
   * merge into  module setting
   * @param {Object} msg -message
   * @propertyDetail {string} moduleName - module name that is  same as root property name in  app.mk-setting.json
   * @propertyDetail {Object} [setting] - module setting
   * @return {Promise}
   * @resolve
   * @param {Object} result - merged module setting
   */
  static applyModuleSetting  (msg) {
    return new Promise(function (resolve, reject) {
      try {
        errorTools.validateJsonSchema
        ({ schema: schemas.applyModuleSetting, data: msg });

        const moduleName = msg.moduleName;
        if (msg.setting)
          appSettingInstance[moduleName] = msg.setting;
        Setting._initAppSettingInstance();
        let result = appSettingInstance[moduleName];
        if (!typeTools.isObject(result))
          result = {};
        resolve(result);
      }
      catch (error) {
        reject(error);
      }

    });
  };

  /**
   * get module setting
   * @param {Object} msg -message
   * @propertyDetail {string} moduleName - module name in app.mk-setting.json
   * @propertyDetail {string} [itemName] - property name in module setting  .if value is null return module setting
   * @return {Promise}
   * @resolve
   * @param {Object} result
   * @propertyDetail {*} result - module setting value
   */
  static getModuleSetting  (msg) {
    return new Promise(function (resolve, reject) {
      try {

        errorTools.validateJsonSchema({ schema: schemas.getModuleSetting, data: msg });

        let result;
        const moduleName = msg.moduleName;
        const itemName = msg.itemName;
        let moduleSettingInstance = appSettingInstance[moduleName];
        if (moduleSettingInstance) {
          if (itemName) {
            if (moduleSettingInstance[itemName]) {
              result = moduleSettingInstance[itemName];
            } else {
              result = null;
            }
          } else {
            result = moduleSettingInstance;
          }
        } else {
          result = null;
        }

        resolve({ result: result });
      }
      catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * init module
   * @param {Object} options
   * @propertyDetail {string} rootPath - root path contain 'app.mk-setting.json'
   * @return {Promise}
   */
  static init  (options) {
    return new Promise(function (resolve, reject) {
      try {
        errorTools.validateJsonSchema({
          schema: schemas.init,
          data: options,
        });
        const rootPath = options.rootPath;
        const fileName = moduleSetting.fileName;
        //errorTools.directoryNotExist(rootPath);
        moduleSetting.filePath = rootPath;
        let appSettingPath = fileTools.path({ paths: [rootPath, moduleSetting.fileName] });
        if (fileTools.fileExist(appSettingPath)) {
          appSetting = fileTools.openFile({ path: appSettingPath });
          watchTools.watchDirectory(rootPath, function (event, f, curr, prev) {
            if (fileTools.fileExist(appSettingPath)) {
              appSetting = fileTools.openFile(appSettingPath);
              Setting._initAppSettingInstance();
            }
          }, {

            filter: function (name) {
              return (fileTools.getFileName(name) === fileName);
            }, interval: 5,
          });
        } else {
          appSetting = {};
        }

        Setting.applyModuleSetting({
          moduleName: moduleTools.getModuleName(fileTools.path({paths:[__dirname,'..']})),
          setting: moduleSetting,
        }).then(data=> {

          moduleSetting = data;
          resolve();
        }).catch(error=> {
          reject(error);
        });
        Setting._initAppSettingInstance();
      }
      catch (error) {
        reject(error);
      }
    });
  }

  static _initAppSettingInstance() {
    appSettingInstance = objectTools.merge
    ([appSettingInstance, appSetting]);
  }
  /**
   * get application setting
   * @return  {Promise}
   * @resolve {Object}
   * @param {Object} result -app setting
   */
  static getAppSetting()  {
    return new Promise(function (resolve, reject) {
      try {
        resolve({ result: Setting._getAppSetting() });
      }
      catch (error) {
        reject(error);
      }
    });
  };

  /**
   * get application
   * @private
   * @param {string} [nodeName] node name in 'app.mk-setting.json'.if null return application setting
   * @return {Object} module setting
   */
  static _getAppSetting  (moduleName)  {
    if (moduleName) {
      if (appSettingInstance && appSettingInstance[moduleName]) {
        return appSettingInstance[moduleName];
      } else
        return null;
    }

    return appSettingInstance;
  };
}
const schemas = {
  applyModuleSetting: {
    type:'object',
    properties: {
      moduleName: {
        type: 'string',
      },
      setting: {
        type: 'object',
        default: {},
      },
    },
    required: ['moduleName', 'setting'],
  },
  getModuleSetting: {
    type:'object',
    properties: {
      moduleName: {
        type: 'string',
      },
      itemName: {
        type: 'string',
      },
    },
    required: ['moduleName'],
  },
  init: {
    type:'object',
    properties: {
      rootPath: {
        type: 'string',
      },
    },
    required: ['rootPath'],
  },

};
let appSetting = {};
let appSettingInstance = {};

module.exports =  Setting;

