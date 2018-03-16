require('./check-versions')();

process.env.NODE_ENV = 'production';

var ora = require('ora');
var chalk = require('chalk');
var config = require('../config');
var webpackConfig = require('./webpack.prod.conf');
var shell = require('shelljs');

var spinner = ora('deploying to production...');
spinner.start();

shell.cd('dist');
shell.exec('chmod -R 0755 .');
shell.exec('scp -r -F C:\\Users\\Vince\\.ssh\\config . root@static.divinitor.com:/var/www/reference.dn.divinitor.com/prod',
    {}, (code, out, err) => {
        console.log(out);
        if (err) console.log(err);
        if (code !== 0) {
            spinner.stop();
            console.log(chalk.red('  Deploy failed with errors.\n'));
            shell.exit(1);
        } else {
            spinner.stop();
            console.log(chalk.cyan('  Deployment succeeded.\n'));
        }
    }
);
