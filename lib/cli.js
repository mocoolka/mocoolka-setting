// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-setting
// LICENSE: MIT
const Minimist = require('minimist');
const service = require('../index');

const argv = Minimist(process.argv.slice(2), {
  alias: {
    p: 'path',
  },
});

const types = argv._;

let path;
if (types.indexOf('path')  === -1) {
  path = process.cwd();
} else {
  path = types['path'];
}

service(path);


