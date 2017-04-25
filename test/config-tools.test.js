const {  fileTools, globalTools } = require('mocoolka-tools');
const settingManager = require('../lib/mocoolka-setting')
let expect = require('chai').expect;

describe('mocoolka-setting module', function () {
  it('init', function () {
    settingManager.init({rootPath:fileTools.path(__dirname, 'files')},function(error){
      expect(error).to.be.null;

      expect(globalTools.getGlobalItem(settingManager.moduleName).filePath)
        .to.be.equal(fileTools.path(__dirname, 'files'))
    })
  });

it('getAppSetting', function () {
     settingManager.init({rootPath:fileTools.path(__dirname, 'files')},(error,data)=>{
      settingManager.actions.getAppSetting((error,appSetting)=>{
        expect(appSetting.test.item1).to.be.equal('app-item1');
        expect(appSetting.test.item2).to.be.equal('app-item2');
      });
    });
  });

  it('applySetting | getSetting', function () {
    settingManager.init({rootPath:fileTools.path(__dirname, 'files')},(error,data)=>{
       settingManager.actions.applyModuleSetting({moduleName:'test',
        moduleDefaultSetting:{ item1: 'item1', item2: 'item2', item3: 'item3' }}
        ,(error,testConfig)=>{
          expect(testConfig.item1).to.be.equal('app-item1');
          expect(testConfig.item2).to.be.equal('app-item2');
          expect(testConfig.item3).to.be.equal('item3');
           settingManager.actions.getModuleSetting({moduleName:'test'},(error,testGetConfig)=>{
             expect(testGetConfig.item1).to.be.equal('app-item1');
             expect(testGetConfig.item2).to.be.equal('app-item2');
             expect(testGetConfig.item3).to.be.equal('item3');

           });
          let testGlobalConfig = globalTools.getGlobalItem('test');
          expect(testGlobalConfig.item1).to.be.equal('app-item1');
          expect(testGlobalConfig.item2).to.be.equal('app-item2');
          expect(testGlobalConfig.item3).to.be.equal('item3');

        });

    })

  });

});
