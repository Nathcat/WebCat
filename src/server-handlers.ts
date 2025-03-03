import http from 'http';
import * as fs from 'fs';

export function error_404(res: http.ServerResponse, config: any): void {
    res.statusCode = 404;
    
    if (config["server"]["errorPages"] === undefined || config["server"]["errorPages"]["404"] === undefined) {
        res.end("<h1>Error 404 - <i>File not found</i></h1><p>The requested resource could not be found.</p>");
    }
    else {
        res.end(fs.readFileSync(config["preProcessor"]["outDir"] + '/' + config["preProcessor"]["appPath"] + '/' + config["server"]["errorPages"]["404"]).toString());
    }
}

export function static_file(res: http.ServerResponse, root: string, path: string[], config: any): void {
    if (path.length === 1) {
        error_404(res, config);
        return;
    }
    
    if (path[1] === "js") {
        if (!fs.existsSync(root + '/scripts/' + path.slice(2).join('/'))) {
            error_404(res, config);
            return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/javascript");
        res.end(fs.readFileSync(root + '/scripts/' + path.slice(2).join('/')).toString());
        return;
    }
    else if (path[1] === "page") {
        let fileName = path[2] + ".html";
        if (!fs.existsSync(root + "/" + fileName)) {
            error_404(res, config);
            return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(fs.readFileSync(root + '/' + fileName).toString());
        return;
    }
    
    error_404(res, config);
}