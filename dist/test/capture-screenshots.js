"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureScreenshots = exports.captureRegressionScreenshots = void 0;
const fs = require("fs");
const glob_1 = require("glob");
const os_1 = require("os");
const path_1 = require("path");
const puppeteer = require("puppeteer");
const __1 = require("..");
const utils_1 = require("../lib/utils");
const concurrency = 10;
const src = (0, path_1.join)(__dirname, "../../src/test/renderer/testProject/src");
const baseDirectory = (0, path_1.join)(__dirname, "../../dist/tmp/capture");
const outputDirectory = (0, path_1.join)(__dirname, "../../dist/tmp/__screenshots__");
const globPattern = "**/*.html";
const viewport = { width: 1024, height: 768 };
class PQueue {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.queued = [];
    }
    add(action) {
        this.queued.push(action);
    }
    run() {
        return new Promise((resolve, reject) => {
            const queue = [];
            const doReject = (err) => {
                this.queued.length = 0;
                queue.length = 0;
                reject(err);
            };
            const tick = () => {
                while (queue.length < this.concurrency) {
                    const next = this.queued.shift();
                    if (next) {
                        const nextPromise = Promise.resolve().then(next);
                        queue.push(nextPromise);
                        nextPromise.then(() => {
                            queue.splice(queue.indexOf(nextPromise), 1);
                            tick();
                        }, doReject);
                    }
                    else {
                        break;
                    }
                }
                if (queue.length === 0) {
                    resolve();
                }
            };
            tick();
        });
    }
}
async function captureRegressionScreenshots() {
    const app = new __1.Application();
    app.options.addReader(new __1.TSConfigReader());
    app.bootstrap({
        logger: "console",
        readme: (0, path_1.join)(src, "..", "README.md"),
        gaSite: "foo.com",
        name: "typedoc",
        disableSources: true,
        cleanOutputDir: true,
        tsconfig: (0, path_1.join)(src, "..", "tsconfig.json"),
        plugin: [],
        entryPoints: [src],
        entryPointStrategy: __1.EntryPointStrategy.Expand,
    });
    const project = app.convert();
    if (!project)
        throw new Error("Failed to convert.");
    await (0, utils_1.remove)(outputDirectory);
    await app.generateDocs(project, baseDirectory);
    await captureScreenshots(baseDirectory, outputDirectory);
}
exports.captureRegressionScreenshots = captureRegressionScreenshots;
async function captureScreenshots(baseDirectory, outputDirectory) {
    const browser = await puppeteer.launch({
        args: (0, os_1.platform)() === "win32"
            ? []
            : ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const queue = new PQueue(concurrency);
    for (const file of (0, glob_1.sync)(globPattern, { cwd: baseDirectory })) {
        queue.add(async () => {
            const absPath = (0, path_1.resolve)(baseDirectory, file);
            const outputPath = (0, path_1.resolve)(outputDirectory, file.replace(".html", ""));
            fs.mkdirSync((0, path_1.dirname)(outputPath), { recursive: true });
            const page = await browser.newPage();
            await page.setViewport(viewport);
            await page.goto(`file://${absPath}`, {
                waitUntil: "domcontentloaded", // 'load' 'networkidle0' 'networkidle2'
            });
            await new Promise((res) => setTimeout(() => res(), 100));
            await page.screenshot({
                path: outputPath + "-light.png",
                fullPage: true,
            });
            await page.evaluate('document.body.classList.add("dark")');
            await new Promise((res) => setTimeout(() => res(), 100));
            await page.screenshot({
                path: outputPath + "-dark.png",
                fullPage: true,
            });
            await page.close();
        });
    }
    await queue.run();
    await browser.close();
}
exports.captureScreenshots = captureScreenshots;
if (require.main == module) {
    captureRegressionScreenshots().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=capture-screenshots.js.map