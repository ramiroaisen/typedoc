"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkedPlugin = void 0;
const fs = require("fs");
const Path = require("path");
const Marked = require("marked");
const components_1 = require("../components");
const events_1 = require("../events");
const utils_1 = require("../../utils");
const highlighter_1 = require("../../utils/highlighter");
const customMarkedRenderer = new Marked.Renderer();
customMarkedRenderer.heading = (text, level, _, slugger) => {
    const slug = slugger.slug(text);
    return `
<a href="#${slug}" id="${slug}" style="color: inherit; text-decoration: none;">
  <h${level}>${text}</h${level}>
</a>
`;
};
/**
 * Implements markdown and relativeURL helpers for templates.
 * @internal
 */
let MarkedPlugin = class MarkedPlugin extends components_1.ContextAwareRendererComponent {
    constructor() {
        super(...arguments);
        /**
         * The pattern used to find references in markdown.
         */
        this.includePattern = /\[\[include:([^\]]+?)\]\]/g;
        /**
         * The pattern used to find media links.
         */
        this.mediaPattern = /media:\/\/([^ ")\]}]+)/g;
    }
    /**
     * Create a new MarkedPlugin instance.
     */
    initialize() {
        super.initialize();
        this.listenTo(this.owner, events_1.MarkdownEvent.PARSE, this.onParseMarkdown);
    }
    /**
     * Highlight the syntax of the given text using HighlightJS.
     *
     * @param text  The text that should be highlighted.
     * @param lang  The language that should be used to highlight the string.
     * @return A html string with syntax highlighting.
     */
    getHighlighted(text, lang) {
        var _a;
        lang = lang || "typescript";
        lang = lang.toLowerCase();
        if (!(0, highlighter_1.isSupportedLanguage)(lang)) {
            // Extra newline because of the progress bar
            this.application.logger.warn(`
Unsupported highlight language "${lang}" will not be highlighted. Run typedoc --help for a list of supported languages.
target code block :
\t${text.split("\n").join("\n\t")}
source files :${(_a = this.sources) === null || _a === void 0 ? void 0 : _a.map((source) => `\n\t${source.fileName}`).join()}
output file :
\t${this.outputFileName}`);
            return text;
        }
        return (0, highlighter_1.highlight)(text, lang);
    }
    /**
     * Parse the given markdown string and return the resulting html.
     *
     * @param text  The markdown string that should be parsed.
     * @returns The resulting html string.
     */
    parseMarkdown(text) {
        if (this.includes) {
            text = text.replace(this.includePattern, (_match, path) => {
                path = Path.join(this.includes, path.trim());
                if (fs.existsSync(path) && fs.statSync(path).isFile()) {
                    const contents = (0, utils_1.readFile)(path);
                    return contents;
                }
                else {
                    this.application.logger.warn("Could not find file to include: " + path);
                    return "";
                }
            });
        }
        if (this.mediaDirectory) {
            text = text.replace(this.mediaPattern, (match, path) => {
                const fileName = Path.join(this.mediaDirectory, path);
                if (fs.existsSync(fileName) &&
                    fs.statSync(fileName).isFile()) {
                    return this.getRelativeUrl("media") + "/" + path;
                }
                else {
                    this.application.logger.warn("Could not find media file: " + fileName);
                    return match;
                }
            });
        }
        const event = new events_1.MarkdownEvent(events_1.MarkdownEvent.PARSE, text, text);
        this.owner.trigger(event);
        return event.parsedText;
    }
    /**
     * Triggered before the renderer starts rendering a project.
     *
     * @param event  An event object describing the current render operation.
     */
    onBeginRenderer(event) {
        super.onBeginRenderer(event);
        Marked.setOptions(this.createMarkedOptions());
        delete this.includes;
        if (this.includeSource) {
            if (fs.existsSync(this.includeSource) &&
                fs.statSync(this.includeSource).isDirectory()) {
                this.includes = this.includeSource;
            }
            else {
                this.application.logger.warn("Could not find provided includes directory: " +
                    this.includeSource);
            }
        }
        if (this.mediaSource) {
            if (fs.existsSync(this.mediaSource) &&
                fs.statSync(this.mediaSource).isDirectory()) {
                this.mediaDirectory = Path.join(event.outputDirectory, "media");
                (0, utils_1.copySync)(this.mediaSource, this.mediaDirectory);
            }
            else {
                this.mediaDirectory = undefined;
                this.application.logger.warn("Could not find provided media directory: " +
                    this.mediaSource);
            }
        }
    }
    /**
     * Creates an object with options that are passed to the markdown parser.
     *
     * @returns The options object for the markdown parser.
     */
    createMarkedOptions() {
        var _a, _b, _c, _d;
        const markedOptions = ((_a = this.application.options.getValue("markedOptions")) !== null && _a !== void 0 ? _a : {});
        // Set some default values if they are not specified via the TypeDoc option
        (_b = markedOptions.highlight) !== null && _b !== void 0 ? _b : (markedOptions.highlight = (text, lang) => this.getHighlighted(text, lang));
        (_c = markedOptions.renderer) !== null && _c !== void 0 ? _c : (markedOptions.renderer = customMarkedRenderer);
        (_d = markedOptions.mangle) !== null && _d !== void 0 ? _d : (markedOptions.mangle = false); // See https://github.com/TypeStrong/typedoc/issues/1395
        return markedOptions;
    }
    /**
     * Triggered when {@link MarkedPlugin} parses a markdown string.
     *
     * @param event
     */
    onParseMarkdown(event) {
        event.parsedText = Marked(event.parsedText);
    }
};
__decorate([
    (0, utils_1.BindOption)("includes")
], MarkedPlugin.prototype, "includeSource", void 0);
__decorate([
    (0, utils_1.BindOption)("media")
], MarkedPlugin.prototype, "mediaSource", void 0);
__decorate([
    (0, utils_1.BindOption)("lightHighlightTheme")
], MarkedPlugin.prototype, "lightTheme", void 0);
__decorate([
    (0, utils_1.BindOption)("darkHighlightTheme")
], MarkedPlugin.prototype, "darkTheme", void 0);
MarkedPlugin = __decorate([
    (0, components_1.Component)({ name: "marked" })
], MarkedPlugin);
exports.MarkedPlugin = MarkedPlugin;
//# sourceMappingURL=MarkedPlugin.js.map