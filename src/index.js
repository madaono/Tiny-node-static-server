const yargs = require('yargs');
const Server = require('./app');

const argv = yargs
    .usage('anywhere [options]')
    .option('p', {
        alias: 'port',
        describe: 'port',
        default: 3000
    })
    .option('h',{
        alias: 'hostname',
        describe: 'host',
        default: '127.0.0.1'
    })
    .option('d',{
        alias: 'root',
        describe: 'root path',
        default: process.cwd()
    })
    .version()
    .alias('v','version')
    .help()
    .argv;


    const server = new Server(argv);
    server.start();