// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-setting
// LICENSE: MIT
/** @module mocoolka-setting-service */
const settingManager = require('./lib/mocoolka-setting.js');
const { serviceTools } = require('mocoolka-tools');

/**
 * start setting service
 * @param {string} rootPath - root path contain 'app.mk-setting.json'
 */
const startSettingService = (rootPath)=> {
  serviceTools.standServices(
    {
      settingManager: {
        module: settingManager,
        options: {
          rootPath,
        },
      },
    }
  );
};

module.exports = startSettingService;
