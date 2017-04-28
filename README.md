# mocoolka-setting
[![npm package](https://img.shields.io/npm/v/mocoolka-setting.svg)](https://www.npmjs.com/package/mocoolka-setting) 
[![license](https://img.shields.io/npm/l/mocoolka-setting.svg)](LICENSE.md)
[![Build Status](https://secure.travis-ci.org/mocoolka/mocoolka-setting.png?branch=master)](http://travis-ci.org/mocoolka/mocoolka-setting)
[![codecov](https://codecov.io/gh/mocoolka/mocoolka-setting/branch/master/graph/badge.svg)](https://codecov.io/gh/mocoolka/mocoolka-setting)

Mocoolka-setting is base module for mocoolka application.It will reading application setting to every sub module.



## Install

```bash
$ npm install mocoolka-setting
```

## Usage

edit app.mk-setting.json on root 
```bash
{
  "testModule":{
    "item1":"app-item1",
    "item2":"app-item2",
    "itemArray":{"array1":{
      "item1":"app-item1",
      "item2":"app-item2"
    },
      "array2": {
        "item1": "app-item1",
        "item2": "app-item2"
      }
    }
  }
}
 ```

start micro service 

 ```bash
 const settingService = require('mocoolka-setting');
 settingService(__dirname);
 ```

merge module default setting and app module setting.
 ```bash
serviceTools.standClientPromise('mocoolka-setting',
  'applyModuleSettingPromise', { moduleName: 'test', moduleDefaultSetting: testSetting }).then(data=> {
  console.log(data);
}).catch(error=> {
  console.error(error);
});
 ```


## Docs

[link to Docs!](https://htmlpreview.github.io/?https://raw.githubusercontent.com/mocoolka/mocoolka-setting/master/docs/index.html)

## License
Licensed under the MIT, version 2.0. (see [MIT](LICENSE.md)).
