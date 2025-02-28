import { preprocessHTML } from './preprocessor';
import * as fs from 'fs';

console.log("----- WebCat Pre-processor -----");
console.log("Copyright Nathcat 2025");

let config = JSON.parse(fs.readFileSync("WebCat.conf.json").toString());
console.log("App path is '" + config["preProcessor"]["appPath"] + "'");
console.log("Out directory is '" + config["preProcessor"]["outDir"] + "'");

console.log("Starting...");

preprocessHTML(
    config["preProcessor"]["appPath"]!! as string,
    config["preProcessor"]["outDir"]!! as string
);

console.log("Finished!");
console.log("--------------------------------");