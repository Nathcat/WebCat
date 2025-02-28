import http from 'http';
import * as fs from 'fs';
import { error_404, static_file } from './server-handlers';

console.log("----- WebCat -----");
console.log("Copyright Nathcat 2025");
console.log("Starting server...");
let config = JSON.parse(fs.readFileSync("WebCat.conf.json").toString());
let root = (config["preProcessor"]["outDir"]!! + '/' + config["preProcessor"]["appPath"]!!) as string;
console.log("Web root is '" + root + "'");

const server = http.createServer((req, res) => {
    console.log(req.method + " " + req.url);

    let path = req.url?.split("/")!!;
    path.shift();

    if (req.url === '/') {
        if (!fs.existsSync(root + '/index.html')) {
            console.error("404: " + req.method + " " + req.url);
            error_404(res, config);
            return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(fs.readFileSync(root + "/index.html").toString());
    }
    else if (path[0] === "static") {
        static_file(res, root, path, config);
    }
    else {
        error_404(res, config);
        console.error("404: " + req.method + " " + req.url);
    }
});

server.listen(config["server"]["port"]!! as number, config["server"]["hostname"]!! as string, () => {
    console.log("Server is listening on http://" + config["server"]["hostname"] + ":" + config["server"]["port"]);
});