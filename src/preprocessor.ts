/**
 * Exports a single function used to pre-process the HTML given for
 * a user application.
 */

import { parse, HTMLElement } from 'node-html-parser';
import { TemplateMap } from './types/TemplateMap';
import * as fs from 'fs';

const isFile = (path: string) => {
    return fs.lstatSync(path).isFile();
}

/**
 * Obtain a mapping of the name of each template to it's relevant
 * HTML tree, parsed from the template root directory of the app.
 * @param templatesRoot The root directory of the app's templates, without a trailing '/'
 * @returns A mapping of template name to it's HTML tree
 */
function getTemplates(
    templatesRoot: string
): TemplateMap {
    let map: TemplateMap = {};

    console.log("Searching '" + templatesRoot + "' for templates.");
    const dirContents = fs.readdirSync(templatesRoot);
    dirContents.forEach((v: string) => {
        console.log("Found template file '" + v + "', processed name '" + v.split(".")[0] + "'.");
        map[v.split(".")[0]] = parse(fs.readFileSync(templatesRoot + '/' + v).toString());
    });

    let keys = Object.keys(map);
    for (let i = 0; i < keys.length; i++) {
        map[keys[i]] = replaceWebCatScripts(replaceTemplates(map[keys[i]], map));
    }

    return map;
}

/**
 * Replace the template tags in the given HTML tree
 * @param tree The tree to process
 * @param templates The map of templates
 * @returns A processed HTML tree with all templates replaced
 */
function replaceTemplates(tree: HTMLElement, templates: TemplateMap): HTMLElement {
    if (templates === undefined) {
        return tree;
    }

    if (templates[tree.rawTagName] !== undefined) {
        let elem = templates[tree.rawTagName];

        elem.parentNode = tree.parentNode;
        return elem;
    }

    for (let i = 0; i < tree.childNodes.length; i++) {
        tree.childNodes[i] = replaceTemplates(tree.childNodes[i] as HTMLElement, templates)!!;
    }

    return tree;
}

/**
 * Replace the WebCat script tags in the given HTML tree
 * @param tree The tree to process
 * @returns A processed HTML tree with all WebCat script tags replaced
 */
function replaceWebCatScripts(tree: HTMLElement): HTMLElement {
    if (tree.rawTagName === "webcat") {
        let attrs_raw = tree.rawAttrs.split("=");
        let attrs: Record<string, string> = {};
        for (let i = 0; i < attrs_raw.length; i += 2) {
            attrs[attrs_raw[i]] = attrs_raw[i + 1].split(/\"|\'/)[1];
        }

        if (attrs["src"] === undefined) {
            console.warn("WebCat script tag without 'src' attribute found! Will be replace with a JS warning.");
            let elem = parse("<script>console.warn('Empty WebCat script here!')</script>");
            elem.parentNode = tree.parentNode;
            return elem;
        }
        else {
            let elem = parse("<script src='/static/js/" + attrs["src"] + ".js'></script>");
            elem.parentNode = tree.parentNode;
            return elem;
        }
    }

    for (let i = 0; i < tree.childNodes.length; i++) {
        tree.childNodes[i] = replaceWebCatScripts(tree.childNodes[i] as HTMLElement)!!;
    }

    return tree;
}

/**
 * Recursively process a directory
 * @param appRoot The root directory of the application
 * @param currentPath The current path from the app root
 * @param outDir The output directory
 * @param templates The templates
 */
function preprocessDir(
    appRoot: string,
    currentPath: string,
    outDir: string,
    templates: TemplateMap
) {
    const dirContents = fs.readdirSync(appRoot + '/' + currentPath);
    dirContents.forEach((v: string) => {
        if (v === "templates" || v === "scripts") {
            return;
        }

        if (isFile(appRoot + '/' + currentPath + (currentPath === '' ? '' : '/') + v)) {
            console.log("Processing file '" + appRoot + '/' + currentPath + (currentPath === '' ? '' : '/') + v + "'");

            let tree = parse(fs.readFileSync(appRoot + '/' + currentPath + (currentPath === '' ? '' : '/') + v).toString());

            tree = replaceTemplates(tree, templates);
            tree = replaceWebCatScripts(tree);

            console.log("Writing to '" + outDir + '/' + appRoot + '/' + currentPath + (currentPath === '' ? '' : '/') + v + "'");
            
            fs.writeFileSync(outDir + '/' + appRoot + '/' + currentPath + (currentPath === '' ? '' : '/') + v, tree.toString(), { flag: "w" });
        }
        else {
            if (!fs.existsSync(outDir + '/' + appRoot + '/' + currentPath + (currentPath === '' ? '' : '/') + v)) {
                fs.mkdirSync(outDir + '/' + appRoot + '/' + currentPath + (currentPath === '' ? '' : '/') + v, { recursive: true });
            }

            preprocessDir(
                appRoot,
                currentPath + (currentPath === '' ? '' : '/') + v,
                outDir,
                templates
            );
        }
    });
}

/**
 * Pre-process the app's HTML, replacing template tags, and
 * WebCat tags.
 * @param appPath The root path of the app from the project root, without a trailing '/'.
 * @param outDir The output path for the processed application HTML, without a trailing '/'.
 */
export function preprocessHTML(
    appPath: string,
    outDir: string
): void {
    const dirContents = fs.readdirSync(appPath);
    let templates: TemplateMap = {};

    console.log("Processing templates...");

    if (dirContents.includes("templates")) {
        templates = getTemplates(appPath + '/templates');
    }
    else {
        console.warn("Templates folder '" + appPath + "/templates' does not exist! Continuing with no templates.");
    }

    console.log("Finished processing templates.");

    if (!fs.existsSync(outDir + '/' + appPath)) {
        fs.mkdirSync(outDir + '/' + appPath, { recursive: true });
    }

    console.log("Starting HTML processing");

    preprocessDir(
        appPath,
        '',
        outDir,
        templates
    );
}