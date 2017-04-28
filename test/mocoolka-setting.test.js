const { fileTools, globalTools } = require('mocoolka-tools');
const settingManager = require('../lib/mocoolka-setting');
let expect = require('chai').expect;

describe('mocoolka-setting module', function () {
  it('init', function (done) {
    settingManager.initPromise({ rootPath: fileTools.path(__dirname, 'files') }).then(()=> {
      expect(globalTools.getGlobalItem(settingManager.moduleName).filePath)
        .to.be.equal(fileTools.path(__dirname, 'files'));
      done();
    }).catch(error=> {
      done(error);
    });
  });

  it('getAppSetting', function (done) {
    settingManager.initPromise({
      rootPath: fileTools.path(__dirname, 'files'),
    }).then(data=> (
      settingManager.actions.getAppSettingPromise()
    )).then(appSetting=> {
      'use strict';
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
    settingManager.initPromise({ rootPath: fileTools.path(__dirname, 'files') }).then(()=>(
      settingManager.actions.applyModuleSettingPromise({
        moduleName: 'test',
        moduleDefaultSetting: { item1: 'item1', item2: 'item2', item3: 'item3' },
      })
    )).then(testConfig=> {
      testConfig = testConfig.result;
      expect(testConfig.item1).to.be.equal('app-item1');
      expect(testConfig.item2).to.be.equal('app-item2');
      expect(testConfig.item3).to.be.equal('item3');
      let testGlobalConfig = globalTools.getGlobalItem('test');
      expect(testGlobalConfig.item1).to.be.equal('app-item1');
      expect(testGlobalConfig.item2).to.be.equal('app-item2');
      expect(testGlobalConfig.item3).to.be.equal('item3');
      return settingManager.actions.applyModuleSettingPromise({
        moduleName1: 'test',
        moduleDefaultSetting: { item1: 'item1', item2: 'item2', item3: 'item3' },
      });
    }).then(data=> {
      'use strict';

    }).catch(error=> {
      'use strict';
      expect(error.mkMessage.id).to.be.equal('VALIDATE');
      return settingManager.actions.getModuleSettingPromise({ moduleName: 'test' });
    }).then(testGetConfig=> {

      'use strict';
      testGetConfig = testGetConfig.result;
      expect(testGetConfig.item1).to.be.equal('app-item1');
      expect(testGetConfig.item2).to.be.equal('app-item2');
      expect(testGetConfig.item3).to.be.equal('item3');
      return settingManager.actions.getModuleSettingPromise
      ({ moduleName: 'test', itemName: 'item1' });
    }).then(item=> {
      'use strict';
      expect(item.result).to.be.equal('app-item1');
      return settingManager.actions.getModuleSettingPromise
      ({ moduleName: 'test', itemName: 'item7' });
    }).then(item=> {
      'use strict';
      expect(item.result).to.be.null;
      return settingManager.actions.getModuleSettingPromise
      ({ moduleName: 'test12', itemName: 'item7' });
    }).then(item=> {
      'use strict';
      expect(item.result).to.be.null;
      settingManager.actions.getModuleSettingPromise
      ({ moduleName1: 'test12', itemName: 'item7' }).then(data=> {

      }).catch(error=> {
        expect(error.mkMessage.id).to.be.equal('VALIDATE');
        done();
      });
    }).catch(error=> {
      'use strict';
      done(error);
    });

  });

});
