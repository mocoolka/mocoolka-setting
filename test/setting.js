const { fileTools, globalTools } = require('mocoolka-tools');
const  settingManager  = require('../lib/setting');
let expect = require('chai').expect;

describe('mocoolka-setting module', function () {
  it('init', function (done) {
    settingManager.init({ rootPath: fileTools.path({ paths: [__dirname, 'files'] }) }).then(()=> {
      done();
    }).catch(error=> {
      done(error);
    });
  });

  it('getAppSetting', function (done) {
    settingManager.init({
      rootPath: fileTools.path({ paths: [__dirname, 'files'] }),
    }).then(data=> (
      settingManager.getAppSetting()
    )).then(appSetting=> {
      appSetting = appSetting.result;
      expect(appSetting.test.item1).to.be.equal('app-item1');
      expect(appSetting.test.item2).to.be.equal('app-item2');
      done();
    }).catch(error=> {
      'use strict';
      done(error);
    });
  });

  it('applySetting | getSetting', function (done) {
    settingManager.init({ rootPath: fileTools.path({ paths: [__dirname, 'files'] }) }).then(()=>(
      settingManager.applyModuleSetting({
        moduleName: 'test',
        setting: { item1: 'item1', item2: 'item2', item3: 'item3' },
      })
    )).then(testConfig=> {
      console.log(testConfig)
      expect(testConfig.item1).to.be.equal('app-item1');
      expect(testConfig.item2).to.be.equal('app-item2');
      expect(testConfig.item3).to.be.equal('item3');
      return settingManager.applyModuleSetting({
        moduleName1: 'test',
        setting: { item1: 'item1', item2: 'item2', item3: 'item3' },

      });
    }).catch(error=> {
      console.error(error);
      expect(error.mkMessage.id).to.be.equal('ERROR/E-MISS-INPUT');
      return settingManager.getModuleSetting({ moduleName: 'test' });
    }).then(testGetConfig=> {

      'use strict';
      testGetConfig = testGetConfig.result;
      expect(testGetConfig.item1).to.be.equal('app-item1');
      expect(testGetConfig.item2).to.be.equal('app-item2');
      expect(testGetConfig.item3).to.be.equal('item3');
      return settingManager.getModuleSetting
      ({ moduleName: 'test', itemName: 'item1' });
    }).then(item=> {
      'use strict';
      expect(item.result).to.be.equal('app-item1');
      return settingManager.getModuleSetting
      ({ moduleName: 'test', itemName: 'item7' });
    }).then(item=> {
      'use strict';
      expect(item.result).to.be.null;
      return settingManager.getModuleSetting
      ({ moduleName: 'test12', itemName: 'item7' });
    }).then(item=> {
      'use strict';
      expect(item.result).to.be.null;
      settingManager.getModuleSetting
      ({ moduleName1: 'test12', itemName: 'item7' }).then(data=> {

      }).catch(error=> {
        expect(error.mkMessage.id).to.be.equal('ERROR/E-MISS-INPUT');
        done();
      });
    }).catch(error=> {
      'use strict';
      done(error);
    });

  });

});
