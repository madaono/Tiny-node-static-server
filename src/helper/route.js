const fs = require('fs');
const path = require('path');
const pug = require('pug');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig');
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');

const tplPath = path.join(__dirname, '../template/dir.pug');
const source = fs.readFileSync(tplPath,'utf-8');

module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()){
            const contentType = mime(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            // fs.readFile(filePath, (err, data) => { //这种异步的写法很慢，需要将全部的文件读取下来才会进行下一步
            //     res.end(data);
            // })
            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if (code === 200){
                rs = fs.createReadStream(filePath);
            } else {
                rs = fs.createReadStream(filePath, {start, end});
            }
            
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res); 
            }
            rs.pipe(res);
        } else if (stats.isDirectory()){
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            const dir = path.relative(config.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files
            };
            res.end(pug.render(source, data));
        }
    } catch (e){
        console.error(e);
        res.statusCode = 404;
        res.setHeader('Content-Type','text/html');
        res.end(`${filePath} is not a directory or file`);
    }
};