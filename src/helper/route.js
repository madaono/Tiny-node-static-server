const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()){
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            // fs.readFile(filePath, (err, data) => { //这种异步的写法很慢，需要将全部的文件读取下来才会进行下一步
            //     res.end(data);
            // })
            fs.createReadStream(filePath.pipe(res));
        } else if (stats.isDirectory()){
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            res.end(files.join(','));
        }
    } catch (e){
        console.error(e);
        res.statusCode = 404;
        res.setHeader('Content-Type','text/html');
        res.end(`${filePath} is not a directory or file`);
    }
}