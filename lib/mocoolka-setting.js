// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-tools
// LICENSE: MIT

/** @module mocoolka-setting */
let { fileTools, globalTools, objectTools, errorTools, typeTools, watchFileTools }
= require('mocoolka-tools');

/**
 * This callback is displayed as part of the getModuleSetting member.
 * @callback applyModuleSettingCallback
 * @param {Object} error - Determines whether the function have error.null if no error;
 * @param {Object} data - module setting
 */

/**
 * apply application setting to module setting.it will try read app.mk-setting.json in root directory
 * merge with module setting and application setting
 * @param {Object} msg -message
 * @property {string} msg.moduleName - module name in app.mk-setting.json
 * @property {Object} [msg.moduleDefaultSetting] - default setting
 * @param {applyModuleSettingCallback} callback
 */
const applyModuleSetting = (msg, callback) => {
  try {
    if (!typeTools.isFunction(callback))
      return;
    errorTools.validateJsonSchema({ schema: settingManager.schemas.applyModuleSetting, data: msg });

    const moduleName = msg.moduleName;
    const moduleDefaultSetting = msg.moduleDefaultSetting;
    let moduleSetting = objectTools.mergeAll(false, true, moduleDefaultSetting, _getAppSetting(moduleName));
    globalTools.setGlobalItem(moduleName, moduleSetting);
    if (callback)
      callback(null, moduleSetting);
  }
  catch (ex) {
    callback(ex);
  }

};

/**
 * This callback is displayed as part of the getModuleSetting member.
 * @callback getModuleSettingCallback
 * @param {Object} error - Determines whether the function have error.null if no error;
 * @param {Object} data - module setting
 */

/**
 * get module setting
 * @param {Object} msg -message
 * @property {string} msg.moduleName - module name in app.mk-setting.json
 * @property {string} [msg.itemName] - property name in module setting  .if value is null return module setting
 * @param {getModuleSettingCallback} callback - return module setting
 */
const getModuleSetting = (msg, callback) => {
  try {
    if (!typeTools.isFunction(callback))
      return;

    errorTools.validateJsonSchema({ schema: settingManager.schemas.getModuleSetting, data: msg });

    let result;
    const moduleName = msg.moduleName;
    const itemName = msg.itemName;
    let moduleSetting = globalTools.getGlobalItem(moduleName);
    if (moduleSetting) {
      if (itemName) {
        if (moduleSetting[itemName]) {
          result = moduleSetting[itemName];
        } else {
          result = null;
        }
      }
    }

    result = moduleSetting;
    console.log(result);
    callback(null, result);
  }
  catch (ex) {
    callback(ex);
  }
};

/**
 * This callback is displayed as part of the init member.
 * @callback initCallback
 * @param {Object} error - Determines whether the function have error.null if no error;
 */

/**
 * init module
 * @param {Object} options
 * @property {string} options.rootPath - root path contain 'app.mk-setting.json'
 * @param {initCallback} callback
 */
function init(options, callback) {
  try {
    options = settingManager.initOptions || options;

    errorTools.validateJsonSchema({
      schema: settingManager.schemas.init,
      data: options,
    });

    const rootPath = options.rootPath;

    errorTools.directoryNotExist(rootPath);

    settingManager.setting.filePath = rootPath;
    let appSettingPath = fileTools.path(rootPath, settingManager.setting.fileName);
    if (fileTools.fileExist(appSettingPath)) {
      settingManager.appSetting = fileTools.openFile(appSettingPath);
      watchFileTools.watchDirectory(rootPath, function (event, f, curr, prev) {
        if (fileTools.fileExist(appSettingPath))
        settingManager.appSetting = fileTools.openFile(appSettingPath);
      }, { filter: function (name) {

          return (fileTools.getFileName(name) === settingManager.setting.fileName);
        }, interval: 5, });
    } else {
      settingManager.appSetting = {};
    }

    applyModuleSetting({
      moduleName: settingManager.moduleName,
      moduleDefaultSetting: settingManager.setting,
    }, (errors, data)=> {
      if (errors)
        callback(errors);
      settingManager.setting = data;
      callback(null);

    });
  }
  catch (ex) {
    if (callback)
       callback(ex);
  }

};

/**
 * This callback is displayed as part of the getAppSetting manager.
 * @callback getAppSettingCallback
 * @param {Object} error - Determines whether the function have error.null if no error;
 * @param {Object} data - application setting in 'app.mk-setting.json'
 */

/**
 * get application setting
 * @param {getAppSettingCallback} callback - The callback that return application setting
 */
const getAppSetting = ( callback) => {
  callback(null, _getAppSetting());
};

/**
 * get application
 * @private
 * @param {string} [nodeName] node name in 'app.mk-setting.json'.if null return application setting
 * @return {Object} module setting
 */
const _getAppSetting = (moduleName) => {
  if (moduleName) {
    if (settingManager.appSetting && settingManager.appSetting[moduleName]) {
      return settingManager.appSetting[moduleName];
    } else
      return null;
  }

  return settingManager.appSetting;
};

const settingManager = {
  moduleName: 'mocoolka-setting',
  setting: {
    fileName: 'app.mk-setting.json',
    filePath: null,
  }, actions: {
    applyModuleSetting,
    getModuleSetting,
    getAppSetting,
  },
  schemas: {
      applyModuleSetting: {
        properties: {
          moduleName: {
            type: 'string',
          },
          moduleDefaultSetting: {
            type: 'object',
            default: {},
          },
        },
        required: ['moduleName', 'moduleDefaultSetting'],
      },
      getModuleSetting: {
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
        properties: {
          rootPath: {
            type: 'string',
          },
        },
        required: ['rootPath'],
      },

    },
  appSetting: null,
  init,
};

module.exports = settingManager;
