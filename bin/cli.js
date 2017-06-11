
let { SettingService } = require('../index.js');
const { fileTools,  consoleTools, errorTools }
  = require('mocoolka-tools');
let alias = {
    path: 'p',
    help: 'h',
  };
let defaultValue = {
    path: '.',
  };
let input = consoleTools.parseArgs({
    argv: process.argv,
    alias,
    default: defaultValue,
  });
let config = {};
let configPath = input.path;

let showHelp = input.help;

/*
 * Display help text
 */

if (showHelp) {
  console.log(fileTools.openFile({ path: fileTools.path({ paths: [__dirname, 'help.txt'] }) }));
  process.exit();
}

let rootPath = fileTools.path({ paths: [process.cwd(), configPath] });

SettingService.start({ initOptions: { rootPath } }).then(()=> {
  console.log(`service started ` );

}).catch(error=> {
  console.error(error);
  process.exit();
});;

