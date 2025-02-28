import { preprocessHTML } from './preprocessor';
import * as fs from 'fs';

console.log("----- WebCat Pre-processor -----");
console.log("Copyright Nathcat 2025");

let config = JSON.parse(fs.readFileSync("WebCat.conf.json").toString());
console.log("App path is '" + config["pre-processor"]["appPath"] + "'");
console.log("Out directory is '" + config["pre-processor"]["outDir"] + "'");

console.log("Starting...");

preprocessHTML(
    config["pre-processor"]["appPath"]!! as string,
    config["pre-processor"]["outDir"]!! as string
);

console.log("Finished!");
console.log("--------------------------------");