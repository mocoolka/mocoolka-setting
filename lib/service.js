// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-setting
// LICENSE: MIT
const Setting = require('./setting.js');
const { serviceTools, moduleTools } = require('mocoolka-tools');
let service = require('../mk-setting.json').setting.service;
/**
 * mocoolka setting service
 */
class SettingService {
  /**
   * start setting service
   * @param {string} setting - service setting
   * @propertyDetail {Object} initOptions - service init options
   * @propertyDetail {string} initOptions.rootPath - root path contain 'app.mk-setting.json'
   * @propertyDetail {Object} [service] - service network config
   * @propertyDetail {Object} [service.transport] - service transport
   * @propertyDetail {Object} [service.listen] - service listen
   * @return {Promise} service started
   */

  static start(setting) {
    service = setting.service || service;
    serviceConfig.initOptions = setting.initOptions;
    return serviceTools.standServices(serviceConfig);
  }

  /**
   * check service start
   * @returns {boolean}
   */
  static exist() {
    return serviceTools.existService({
        moduleName: serviceConfig.moduleName,
        actionName: 'applyModuleSetting',
        service,
      });
  }

  /**
   * execute [Setting.applyModuleSetting](#setting-applymodulesetting) in service
   * @param {Object} message
   */
  static applyModuleSetting(message) {
    if (SettingService.exist()) {
      return serviceTools.standClientPromise({
          moduleName: serviceConfig.moduleName,
          actionName: 'applyModuleSetting',
          service,
          message,
        });
    }
  }
  /**
   * execute [Setting.getModuleSetting](#setting-getmodulesetting) in service
   * @param {Object} message
   */
  static getModuleSetting(message) {
    if (SettingService.exist()) {
      return serviceTools.standClientPromise({
          moduleName: serviceConfig.moduleName,
          actionName: 'getModuleSetting',
          service,
          message,
        });
    }
  }
  /**
   * execute [Setting.getAppSetting](#setting-getappsetting) in service
   * @param {Object} message
   */
  static getAppSetting(message) {
    if (SettingService.exist()) {
      return serviceTools.standClientPromise({
          moduleName: serviceConfig.moduleName,
          actionName: 'getModuleSetting',
          service,
          message,
        });
    }
  }
}
const serviceConfig = {
    moduleName: moduleTools.getModuleName('..'),
    actionPromises: {
        applyModuleSetting: Setting.applyModuleSetting,
        getModuleSetting: Setting.getModuleSetting,
        getAppSetting: Setting.getAppSetting,
      },
    initPromise: Setting.init,
    service,
  };

module.exports = SettingService;
