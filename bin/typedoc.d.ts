/// <reference path="../src/lib/fs.extra/fs.extra.d.ts" />
/// <reference path="../src/lib/handlebars/handlebars.d.ts" />
/// <reference path="../src/lib/highlight.js/highlight.js.d.ts" />
/// <reference path="../src/lib/marked/marked.d.ts" />
/// <reference path="../src/lib/minimatch/minimatch.d.ts" />
/// <reference path="../src/lib/node/node.d.ts" />
/// <reference path="../src/lib/typescript/typescript.d.ts" />
declare module TypeScript {
    var typescriptPath: string;
}
declare var Handlebars: any;
declare var Marked: any;
declare var HighlightJS: any;
declare var Minimatch: any;
declare var Util: any;
declare var VM: any;
declare var Path: any;
declare var FS: any;
declare var dirname: any;
declare var file: any;
declare module TypeScript {
    class SourceFile {
        public scriptSnapshot: IScriptSnapshot;
        public byteOrderMark: ByteOrderMark;
        constructor(scriptSnapshot: IScriptSnapshot, byteOrderMark: ByteOrderMark);
    }
    class DiagnosticsLogger implements ILogger {
        public ioHost: IIO;
        constructor(ioHost: IIO);
        public information(): boolean;
        public debug(): boolean;
        public warning(): boolean;
        public error(): boolean;
        public fatal(): boolean;
        public log(s: string): void;
    }
    class FileLogger implements ILogger {
        public ioHost: IIO;
        public fileName: string;
        constructor(ioHost: IIO);
        public information(): boolean;
        public debug(): boolean;
        public warning(): boolean;
        public error(): boolean;
        public fatal(): boolean;
        public log(s: string): void;
    }
    class BatchCompiler implements IReferenceResolverHost {
        public ioHost: IIO;
        public compilerVersion: string;
        public inputFiles: string[];
        public compilationSettings: ImmutableCompilationSettings;
        public resolvedFiles: IResolvedFile[];
        public fileNameToSourceFile: StringHashTable<SourceFile>;
        public hasErrors: boolean;
        public logger: ILogger;
        constructor(ioHost: IIO);
        public batchCompile(): void;
        public resolve(): void;
        public compile(): void;
        public parseOptions(): boolean;
        public setLocale(locale: string): boolean;
        public setLanguageAndTerritory(language: string, territory: string): boolean;
        public watchFiles(): void;
        public getSourceFile(fileName: string): SourceFile;
        public getDefaultLibraryFilePath(): string;
        public getScriptSnapshot(fileName: string): IScriptSnapshot;
        public resolveRelativePath(path: string, directory: string): string;
        public fileExistsCache: IIndexable<boolean>;
        public fileExists(path: string): boolean;
        public getParentDirectory(path: string): string;
        public addDiagnostic(diagnostic: Diagnostic): void;
        public tryWriteOutputFiles(outputFiles: OutputFile[]): boolean;
        public writeFile(fileName: string, contents: string, writeByteOrderMark: boolean): void;
        public directoryExists(path: string): boolean;
        public resolvePathCache: IIndexable<string>;
        public resolvePath(path: string): string;
    }
}
declare module TypeDoc {
    interface IListener {
        handler: Function;
        scope: any;
        priority: number;
    }
    interface IListenerRegistry {
        [event: string]: IListener[];
    }
    class Event {
        public isPropagationStopped: boolean;
        public isDefaultPrevented: boolean;
        public stopPropagation(): void;
        public preventDefault(): void;
    }
    class EventDispatcher {
        private listeners;
        public dispatch(event: string, ...args: any[]): void;
        public on(event: string, handler: Function, scope?: any, priority?: number): void;
        public off(event?: string, handler?: Function, scope?: any): void;
    }
}
declare module TypeDoc {
    /**
    * The version number of TypeDoc.
    */
    var VERSION: string;
    /**
    * List of known log levels. Used to specify the urgency of a log message.
    *
    * @see [[Application.log]]
    */
    enum LogLevel {
        Verbose = 0,
        Info = 1,
        Warn = 2,
        Error = 3,
    }
    /**
    * An interface of the application class.
    *
    * All classes should expect this interface allowing other third parties
    * to use their own implementation.
    */
    interface IApplication {
        /**
        * The settings used by the dispatcher and the renderer.
        */
        settings: Settings;
        /**
        * Print a log message.
        *
        * @param message  The message itself.
        * @param level  The urgency of the log message.
        */
        log(message: string, level?: LogLevel): any;
    }
    /**
    * The default TypeDoc main application class.
    *
    * This class holds the two main components of TypeDoc, the [[Dispatcher]] and
    * the [[Renderer]]. When running TypeDoc, first the [[Dispatcher]] is invoked which
    * generates a [[ProjectReflection]] from the passed in source files. The
    * [[ProjectReflection]] is a hierarchical model representation of the TypeScript
    * project. Afterwards the model is passed to the [[Renderer]] which uses an instance
    * of [[BaseTheme]] to generate the final documentation.
    *
    * Both the [[Dispatcher]] and the [[Renderer]] are subclasses of the [[EventDispatcher]]
    * and emit a series of events while processing the project. Subscribe to these Events
    * to control the application flow or alter the output.
    */
    class Application implements IApplication {
        /**
        * The settings used by the dispatcher and the renderer.
        */
        public settings: Settings;
        /**
        * The dispatcher used to create the declaration reflections.
        */
        public dispatcher: Factories.Dispatcher;
        /**
        * The renderer used to generate the documentation output.
        */
        public renderer: Output.Renderer;
        /**
        * Has an error been raised through the log method?
        */
        public hasErrors: boolean;
        /**
        * Create a new Application instance.
        *
        * @param settings  The settings used by the dispatcher and the renderer.
        */
        constructor(settings?: Settings);
        /**
        * Run TypeDoc from the command line.
        */
        public runFromCommandline(): void;
        /**
        * Print a log message.
        *
        * @param message  The message itself.
        * @param level    The urgency of the log message.
        */
        public log(message: string, level?: LogLevel): void;
        /**
        * Run the documentation generator for the given set of files.
        *
        * @param inputFiles  A list of source files whose documentation should be generated.
        * @param outputDirectory  The path of the directory the documentation should be written to.
        */
        public generate(inputFiles: string[], outputDirectory: string): void;
    }
}
declare module TypeDoc {
    /**
    * Holds all settings used by TypeDoc.
    */
    class Settings {
        /**
        * The settings used by the TypeScript compiler.
        */
        public compiler: TypeScript.CompilationSettings;
        /**
        * The list of source files that should be processed.
        */
        public inputFiles: string[];
        /**
        * The path of the output directory.
        */
        public outputDirectory: string;
        /**
        * The human readable name of the project. Used within the templates to set the title of the document.
        */
        public name: string;
        /**
        * A pattern for files that should be excluded when a path is specified as source.
        */
        public excludePattern: string;
        /**
        * Should declaration files be documented?
        */
        public includeDeclarations: boolean;
        /**
        * Does the user want to display the help message?
        */
        public needsHelp: boolean;
        /**
        * Does the user want to know the version number?
        */
        public shouldPrintVersionOnly: boolean;
        /**
        * Should verbose messages be printed?
        */
        public verbose: boolean;
        /**
        * Create a new Settings instance.
        */
        constructor();
        /**
        * Read the settings from command line arguments.
        */
        public readFromCommandline(application: IApplication): boolean;
        /**
        * Expand the list of input files.
        *
        * Searches for directories in the input files list and replaces them with a
        * listing of all TypeScript files within them. One may use the exlclude option
        * to filter out files aith a pattern.
        */
        public expandInputFiles(): void;
        /**
        * Create and initialize an instance of OptionsParser to read command line arguments.
        *
        * This function partially contains the options found in [[TypeScript.BatchCompiler.parseOptions]].
        * When updating the TypeScript compiler, new options should be copied over here.
        *
        * @returns An initialized OptionsParser instance.
        */
        private createOptionsParser();
    }
}
declare module TypeDoc.Factories {
    class BasePath {
        public basePath: string;
        public add(fileName: string): void;
        public trim(fileName: string): string;
        static normalize(path: string): string;
    }
}
declare module TypeDoc.Factories {
    interface IScriptSnapshot {
        getText(start: number, end: number): string;
        getLineNumber(position: number): number;
    }
    /**
    *
    */
    class Compiler extends TypeScript.BatchCompiler {
        public idMap: {
            [id: number]: Models.DeclarationReflection;
        };
        private snapshots;
        /**
        * Create a new compiler instance.
        */
        constructor(settings: TypeScript.CompilationSettings);
        public run(): TypeScript.Document[];
        public compile(): TypeScript.Document[];
        /**
        * Return the snapshot of the given filename.
        *
        * @param fileName  The filename of the snapshot.
        */
        public getSnapshot(fileName: string): IScriptSnapshot;
        public getDefaultLibraryFilePath(): string;
    }
}
declare module TypeDoc.Factories {
    /**
    * Create a type instance for the given symbol.
    *
    * @param symbol  The TypeScript symbol the type should point to.
    */
    function createType(symbol: TypeScript.PullTypeSymbol): Models.BaseType;
    /**
    * The central dispatcher receives documents from the compiler and emits
    * events for all discovered declarations.
    *
    * Factories should listen to the events emitted by the dispatcher. Each event
    * contains a state object describing the current state the dispatcher is in. Factories
    * can alter the state or stop it from being further processed.
    *
    * While the compiler is active, it passes documents to the dispatcher. Each document
    * will create an ´enterDocument´ event. By stopping the generated state, factories can
    * prevent entire documents from being processed.
    *
    * The dispatcher will iterate over all declarations and its children in the document
    * and yields a child state for them. For each of this states an ´enterDeclaration´ event
    * will be emitted. By stopping the child state, factories can prevent declarations from
    * being processed.
    *
    * - enterDocument
    *   - enterDeclaration
    *   - mergeReflection / createReflection
    *   - process
    *   - **Recursion**
    */
    class Dispatcher extends EventDispatcher {
        /**
        * The project instance this dispatcher should push the created reflections to.
        */
        public application: IApplication;
        /**
        * A list of known factories.
        */
        static FACTORIES: any[];
        /**
        * Create a new Dispatcher instance.
        *
        * @param application  The target project instance.
        */
        constructor(application: IApplication);
        /**
        * Compile the given list of source files and generate a reflection for them.
        *
        * @param inputFiles  A list of source files.
        * @returns The generated root reflection.
        */
        public compile(inputFiles: string[]): Models.ProjectReflection;
        /**
        * Process the given state.
        *
        * @param state  The state that should be processed.
        */
        public processState(state: DeclarationState): void;
        /**
        * Ensure that the given state holds a reflection.
        *
        * Reflections should always be created through this function as the dispatcher
        * will hold an array of created reflections for the final resolving phase.
        *
        * @param state  The state the reflection should be created for.
        * @return       TRUE if a new reflection has been created, FALSE if the
        *               state already holds a reflection.
        */
        public ensureReflection(state: DeclarationState): boolean;
        /**
        * Print debug information of the given declaration to the console.
        *
        * @param declaration  The declaration that should be printed.
        * @param indent  Used internally to indent child declarations.
        */
        static explainDeclaration(declaration: TypeScript.PullDecl, indent?: string): void;
        /**
        * Return a string that explains the given flag bit mask.
        *
        * @param flags  A bit mask containing TypeScript.PullElementFlags bits.
        * @returns A string describing the given bit mask.
        */
        static flagsToString(flags: any): string;
    }
}
declare module TypeDoc.Factories {
    class ProjectResolution extends Event {
        public compiler: Compiler;
        public project: Models.ProjectReflection;
        constructor(compiler: Compiler, project: Models.ProjectReflection);
    }
    class ReflectionResolution extends ProjectResolution {
        public reflection: Models.DeclarationReflection;
        constructor(compiler: Compiler, project: Models.ProjectReflection, reflection?: Models.DeclarationReflection);
    }
}
declare module TypeDoc.Factories {
    /**
    * A handler that analyzes the AST and extracts data not represented by declarations.
    */
    class AstHandler {
        /**
        * The ast walker factory.
        */
        private factory;
        /**
        * Create a new AstHandler instance.
        *
        * Handlers are created automatically if they are registered in the static Dispatcher.FACTORIES array.
        *
        * @param dispatcher  The dispatcher this handler should be attached to.
        */
        constructor(dispatcher: Dispatcher);
        /**
        * Triggered when the dispatcher has finished processing a typescript declaration.
        *
        * @param state  The state that describes the current declaration and reflection.
        */
        public onLeaveDeclaration(state: DeclarationState): void;
    }
}
declare module TypeDoc.Factories {
    /**
    * A handler that parses javadoc comments and attaches [[Models.Comment]] instances to
    * the generated reflections.
    */
    class CommentHandler {
        /**
        * Create a new CommentHandler instance.
        *
        * @param dispatcher  The dispatcher this handler should be attached to.
        */
        constructor(dispatcher: Dispatcher);
        /**
        * Triggered when the dispatcher processes a declaration.
        *
        * Invokes the comment parser.
        *
        * @param state  The state that describes the current declaration and reflection.
        */
        private onProcess(state);
        /**
        * Triggered when the dispatcher resolves a reflection.
        *
        * Cleans up comment tags related to signatures like @param or @return
        * and moves their data to the corresponding parameter reflections.
        *
        * This hook also copies over the comment of function implementations to their
        * signatures.
        *
        * @param res
        */
        private onResolveReflection(res);
        /**
        * Test whether the given TypeScript comment instance is a doc comment.
        *
        * @param comment  The TypeScript comment that should be tested.
        * @returns True when the comment is a doc comment, otherwise false.
        */
        static isDocComment(comment: TypeScript.Comment): boolean;
        /**
        * Remove all tags with the given name from the given comment instance.
        *
        * @param comment  The comment that should be modified.
        * @param tagName  The name of the that that should be removed.
        */
        static removeTags(comment: Models.Comment, tagName: string): void;
        /**
        * Find all doc comments associated with the declaration of the given state
        * and return their plain text.
        *
        * Variable declarations need a special treatment, their comments are stored with the
        * surrounding VariableStatement ast element. Their ast hierarchy looks like this:
        * > VariableStatement &#8594; VariableDeclaration &#8594; SeparatedList &#8594; VariableDeclarator
        *
        * This reflect the possibility of JavaScript to define multiple variables with a single ```var```
        * statement. We therefore have to check whether the VariableStatement contains only one variable
        * and then can assign the comment of the VariableStatement to the VariableDeclarator declaration.
        *
        * @param state  The state containing the declaration whose comments should be extracted.
        * @returns A list of all doc comments associated with the state.
        */
        static findComments(state: DeclarationState): string[];
        /**
        * Parse the given doc comment string.
        *
        * @param text     The doc comment string that should be parsed.
        * @param comment  The [[Models.Comment]] instance the parsed results should be stored into.
        * @returns        A populated [[Models.Comment]] instance.
        */
        static parseDocComment(text: string, comment?: Models.Comment): Models.Comment;
    }
}
declare module TypeDoc.Factories {
    class DynamicModuleHandler {
        private basePath;
        constructor(dispatcher: Dispatcher);
        private onProcess(state);
        private onResolveReflection(res);
    }
}
declare module TypeDoc.Factories {
    /**
    * A handler that sorts and groups the found reflections in the resolving phase.
    *
    * The handler sets the ´groups´ property of all reflections.
    */
    class GroupHandler {
        private dispatcher;
        /**
        * Define the sort order of reflections.
        */
        static WEIGHTS: TypeScript.PullElementKind[];
        /**
        * Define the singular name of individual reflection kinds.
        */
        static SINGULARS: {};
        /**
        * Define the plural name of individual reflection kinds.
        */
        static PLURALS: {};
        /**
        * Create a new GroupHandler instance.
        *
        * @param dispatcher  The dispatcher this handler should be attached to.
        */
        constructor(dispatcher: Dispatcher);
        /**
        * Triggered once after all documents have been read and the dispatcher
        * leaves the resolving phase.
        */
        private onLeaveResolve(resolution);
        /**
        * Create a grouped representation of the given list of reflections.
        *
        * Reflections are grouped by kind and sorted by weight and name.
        *
        * @param reflections  The reflections that should be grouped.
        * @returns An array containing all children of the given reflection grouped by their kind.
        */
        static getReflectionGroups(reflections: Models.DeclarationReflection[]): Models.ReflectionGroup[];
        /**
        * Transform the internal typescript kind identifier into a human readable version.
        *
        * @param kind  The original typescript kind identifier.
        * @returns A human readable version of the given typescript kind identifier.
        */
        private static getKindString(kind);
        /**
        * Return the singular name of a internal typescript kind identifier.
        *
        * @param kind The original internal typescript kind identifier.
        * @returns The singular name of the given internal typescript kind identifier
        */
        static getKindSingular(kind: TypeScript.PullElementKind): string;
        /**
        * Return the plural name of a internal typescript kind identifier.
        *
        * @param kind The original internal typescript kind identifier.
        * @returns The plural name of the given internal typescript kind identifier
        */
        static getKindPlural(kind: TypeScript.PullElementKind): string;
        /**
        * Callback used to sort reflections by weight defined by ´GroupHandler.WEIGHTS´ and name.
        *
        * @param a The left reflection to sort.
        * @param b The right reflection to sort.
        * @returns The sorting weight.
        */
        static sortCallback(a: Models.DeclarationReflection, b: Models.DeclarationReflection): number;
    }
}
declare module TypeDoc.Factories {
    class InheritanceHandler {
        private dispatcher;
        constructor(dispatcher: Dispatcher);
        public onMergeReflection(state: DeclarationState): void;
        public onCreateReflection(state: DeclarationState): void;
        public onEnterDeclaration(state: DeclarationState): void;
        public onLeaveDeclaration(state: DeclarationState): void;
    }
}
declare module TypeDoc.Factories {
    /**
    * A factory that filters declarations that should be ignored and prevents
    * the creation of reflections for them.
    *
    * TypeDoc currently ignores all type aliases, object literals, object types and
    * implicit variables. Furthermore declaration files are ignored.
    */
    class NullHandler {
        private dispatcher;
        constructor(dispatcher: Dispatcher);
        public onEnterDocument(state: DocumentState): void;
        public onEnterDeclaration(state: DeclarationState): void;
    }
}
declare module TypeDoc.Factories {
    /**
    * A handler that tries to find the package.json and readme.md files of the
    * current project.
    *
    * The handler traverses the file tree upwards for each file processed by the processor
    * and records the nearest package info files it can find. Within the resolve files, the
    * contents of the found files will be read and appended to the ProjectReflection.
    */
    class PackageHandler {
        private dispatcher;
        /**
        * The file name of the found readme.md file.
        */
        private readmeFile;
        /**
        * The file name of the found package.json file.
        */
        private packageFile;
        /**
        * List of directories the handler already inspected.
        */
        private visited;
        /**
        * Create a new PackageHandler instance.
        *
        * Handlers are created automatically if they are registered in the static Dispatcher.FACTORIES array.
        *
        * @param dispatcher  The dispatcher this handler should be attached to.
        */
        constructor(dispatcher: Dispatcher);
        /**
        * Triggered when the dispatcher begins processing a typescript document.
        *
        * @param state  The state that describes the current declaration and reflection.
        */
        public onEnterDocument(state: DocumentState): void;
        /**
        * Triggered once after all documents have been read and the dispatcher
        * enters the resolving phase.
        */
        public onEnterResolve(resolution: ProjectResolution): void;
    }
}
declare module TypeDoc.Factories {
    /**
    * A factory that copies basic values from declarations to reflections.
    *
    * This factory sets the following values on reflection models:
    *  - flags
    *  - kind
    *  - type
    *  - definition
    *  - isOptional
    *  - defaultValue
    */
    class ReflectionHandler {
        private dispatcher;
        /**
        * A list of fags that should be exported to the flagsArray property.
        */
        static RELEVANT_FLAGS: TypeScript.PullElementFlags[];
        /**
        * A list of fags that should be exported to the flagsArray property for parameter reflections.
        */
        static RELEVANT_PARAMETER_FLAGS: TypeScript.PullElementFlags[];
        constructor(dispatcher: Dispatcher);
        private onCreateReflection(state);
        private onMergeReflection(state);
        /**
        * Triggered by the dispatcher for each reflection in the resolving phase.
        *
        * @param reflection  The final generated reflection.
        */
        private onResolveReflection(res);
    }
}
declare module TypeDoc.Factories {
    /**
    * A factory that creates signature reflections.
    */
    class ResolveHandler {
        private dispatcher;
        constructor(dispatcher: Dispatcher);
        public onEnterDeclaration(state: DeclarationState): void;
    }
}
declare module TypeDoc.Factories {
    /**
    * A factory that creates signature reflections.
    */
    class SignatureHandler {
        private dispatcher;
        constructor(dispatcher: Dispatcher);
        private onEnterDeclaration(state);
        private onProcess(state);
        static isMethodOverwrite(state: any): boolean;
    }
}
declare module TypeDoc.Factories {
    class SourceHandler {
        private dispatcher;
        private basePath;
        private fileMappings;
        constructor(dispatcher: Dispatcher);
        public onEnterDocument(state: DocumentState): void;
        public onProcess(state: DeclarationState): void;
        public onEnterResolve(res: ProjectResolution): void;
        public onResolveReflection(res: ReflectionResolution): void;
        public onLeaveResolve(res: ProjectResolution): void;
    }
}
declare module TypeDoc.Factories {
    /**
    * A factory that converts all instances of LateResolvingType to their renderable equivalents.
    */
    class TypeHandler {
        constructor(dispatcher: Dispatcher);
        public onResolveReflection(resolution: ReflectionResolution): void;
        private resolveTypes(types, compiler);
        private resolveType(type, compiler);
        /**
        * Return the simplified type hierarchy for the given reflection.
        *
        * @TODO Type hierarchies for interfaces with multiple parent interfaces.
        *
        * @param reflection The reflection whose type hierarchy should be generated.
        * @returns The root of the generated type hierarchy.
        */
        static buildTypeHierarchy(reflection: Models.DeclarationReflection): Models.IDeclarationHierarchy;
    }
}
declare module TypeDoc.Factories {
    /**
    * Base class of all states.
    *
    * States store the current declaration and its matching reflection while
    * being processed by the dispatcher. Factories can alter the state and
    * stop it from being further processed.
    * For each child declaration the dispatcher will create a child {DeclarationState}
    * state. The root state is always an instance of {DocumentState}.
    */
    class BaseState extends Event {
        /**
        * The parent state of this state.
        */
        public parentState: BaseState;
        /**
        * The TypeScript declaration that should be reflected by this state.
        */
        public declaration: TypeScript.PullDecl;
        /**
        * The TypeScript declaration that should be reflected by this state.
        */
        public originalDeclaration: TypeScript.PullDecl;
        /**
        * The reflection created for the declaration of this state.
        */
        public reflection: Models.BaseReflection;
        /**
        * Create a new BaseState instance.
        */
        constructor(parentState: BaseState, declaration: TypeScript.PullDecl, reflection?: Models.BaseReflection);
        /**
        * Check whether the given flag is set on the declaration of this state.
        *
        * @param flag   The flag that should be looked for.
        */
        public hasFlag(flag: number): boolean;
        /**
        * @param kind  The kind to test for.
        */
        public kindOf(kind: TypeScript.PullElementKind): boolean;
        /**
        * @param kind  An array of kinds to test for.
        */
        public kindOf(kind: TypeScript.PullElementKind[]): boolean;
        public getName(): string;
        /**
        * Return the root state of this state.
        *
        * The root state is always an instance of {DocumentState}.
        */
        public getDocumentState(): DocumentState;
        /**
        * Return the snapshot of the given filename.
        *
        * @param fileName  The filename of the snapshot.
        */
        public getSnapshot(fileName: string): IScriptSnapshot;
        /**
        * Create a child state of this state with the given declaration.
        *
        * This state must hold an reflection when creating a child state, an error will
        * be thrown otherwise. If the reflection of this state contains a child with
        * the name of the given declaration, the reflection of the child state will be
        * populated with it.
        *
        * @param declaration  The declaration that is encapsulated by the child state.
        */
        public createChildState(declaration: TypeScript.PullDecl): DeclarationState;
        static getName(declaration: TypeScript.PullDecl): string;
    }
}
declare module TypeDoc.Factories {
    /**
    */
    class DeclarationState extends BaseState {
        public reflection: Models.DeclarationReflection;
        public flattenedName: string;
        public isSignature: boolean;
        public isInherited: boolean;
        public isFlattened: boolean;
        /**
        * @inherit
        */
        public createChildState(declaration: TypeScript.PullDecl): DeclarationState;
        /**
        * Create a child state of this state with the given declaration.
        */
        public createSignatureState(): DeclarationState;
        public createInheritanceState(declaration: TypeScript.PullDecl): DeclarationState;
    }
}
declare module TypeDoc.Factories {
    /**
    * Root state containing the TypeScript document that is processed.
    */
    class DocumentState extends BaseState {
        /**
        * The dispatcher that has created this state.
        */
        public dispatcher: Dispatcher;
        /**
        * The TypeScript document all following declarations are derived from.
        */
        public document: TypeScript.Document;
        /**
        * The project the reflections should be stored to.
        */
        public reflection: Models.ProjectReflection;
        public compiler: Compiler;
        /**
        * Create a new DocumentState instance.
        *
        * @param dispatcher  The dispatcher that has created this state.
        * @param document    The TypeScript document that contains the declarations.
        */
        constructor(dispatcher: Dispatcher, document: TypeScript.Document, project: Models.ProjectReflection, compiler: Compiler);
    }
}
declare module TypeDoc.Models {
    /**
    * A model that represents a javadoc comment.
    *
    * Instances of this model are created by the [[CommentHandler]]. You can retrieve comments
    * through the [[BaseReflection.comment]] property.
    */
    class Comment {
        /**
        * The abstract of the comment. TypeDoc interprets the first paragraph of a comment
        * as the abstract.
        */
        public shortText: string;
        /**
        * The full body text of the comment. Excludes the [[shortText]].
        */
        public text: string;
        /**
        * The text of the ```@returns``` tag if present.
        */
        public returns: string;
        /**
        * All associated javadoc tags.
        */
        public tags: CommentTag[];
        /**
        * Creates a new Comment instance.
        */
        constructor(shortText?: string, text?: string);
        /**
        * Test whether this comment contains a tag with the given name.
        *
        * @param tagName  The name of the tag to look for.
        * @returns TRUE when this comment contains a tag with the given name, otherwise FALSE.
        */
        public hasTag(tagName: string): boolean;
        /**
        * Return the first tag with the given name.
        *
        * You can optionally pass a parameter name that should be searched to.
        *
        * @param tagName  The name of the tag to look for.
        * @param paramName  An optional parameter name to look for.
        * @returns The found tag or NULL.
        */
        public getTag(tagName: string, paramName?: string): CommentTag;
    }
}
declare module TypeDoc.Models {
    /**
    * A model that represents a single javadoc comment tag.
    *
    * Tags are stored in the [[Comment.tags]] property.
    */
    class CommentTag {
        /**
        * The name of this tag.
        */
        public tagName: string;
        /**
        * The name of the related parameter when this is a ```@param``` tag.
        */
        public paramName: string;
        /**
        * The actual body text of this tag.
        */
        public text: string;
        /**
        * Create a new CommentTag instance.
        */
        constructor(tagName: string, paramName?: string, text?: string);
    }
}
declare module TypeDoc.Models {
    /**
    * Base class for all reflection classes.
    *
    * While generating a documentation, TypeDoc generates an instance of [[ProjectReflection]]
    * as the root for all reflections within the project. All other reflections are represented
    * by the [[DeclarationReflection]] class.
    *
    * This base class exposes the basic properties one may use to traverse the reflection tree.
    * You can use the [[children]] and [[parent]] properties to walk the tree. The [[groups]] property
    * contains a list of all children grouped and sorted for being rendered.
    */
    class BaseReflection {
        /**
        * The reflection this reflection is a child of.
        */
        public parent: BaseReflection;
        /**
        * The children of this reflection.
        */
        public children: DeclarationReflection[];
        /**
        * All children grouped by their kind.
        */
        public groups: ReflectionGroup[];
        /**
        * The symbol name of this reflection.
        */
        public name: string;
        /**
        * The parsed documentation comment attached to this reflection.
        */
        public comment: Comment;
        /**
        * The url of this reflection in the generated documentation.
        */
        public url: string;
        /**
        * Is the url pointing to an individual document?
        *
        * When FALSE, the url points to an anchor tag on a page of a different reflection.
        */
        public hasOwnDocument: boolean;
        /**
        * Url safe alias for this reflection.
        *
        * @see [[BaseReflection.getAlias]]
        */
        private alias;
        /**
        * Return the full name of this reflection.
        *
        * The full name contains the name of this reflection and the names of all parent reflections.
        *
        * @param separator  Separator used to join the names of the reflections.
        * @returns The full name of this reflection.
        */
        public getFullName(separator?: string): string;
        /**
        * @param name  The name of the child to look for. Might contain a hierarchy.
        */
        public getChildByName(name: string): DeclarationReflection;
        /**
        * @param names  The name hierarchy of the child to look for.
        */
        public getChildByName(names: string[]): DeclarationReflection;
        /**
        * Return a list of all children of a certain kind.
        *
        * @param kind  The desired kind of children.
        * @returns     An array containing all children with the desired kind.
        */
        public getChildrenByKind(kind: TypeScript.PullElementKind): DeclarationReflection[];
        /**
        * Return an url safe alias for this reflection.
        */
        public getAlias(): string;
        /**
        * @param name  The name to look for. Might contain a hierarchy.
        */
        public findReflectionByName(name: string): DeclarationReflection;
        /**
        * @param names  The name hierarchy to look for.
        */
        public findReflectionByName(names: string[]): DeclarationReflection;
        /**
        * Return a string representation of this reflection.
        */
        public toString(): string;
        /**
        * Return a string representation of this reflection and all of its children.
        *
        * @param indent  Used internally to indent child reflections.
        */
        public toReflectionString(indent?: string): string;
    }
}
declare module TypeDoc.Models {
    /**
    * Alias to TypeScript.PullElementKind
    *
    * @resolve
    */
    var Kind: typeof TypeScript.PullElementKind;
    /**
    * Alias to TypeScript.PullElementFlags
    *
    * @resolve
    */
    var Flags: typeof TypeScript.PullElementFlags;
    /**
    * Stores hierarchical type data.
    *
    * @see [[DeclarationReflection.typeHierarchy]]
    */
    interface IDeclarationHierarchy {
        /**
        * The type represented by this node in the hierarchy.
        */
        type: BaseType;
        /**
        * A list of a children of this node.
        */
        children?: IDeclarationHierarchy[];
        /**
        * Is this the entry within the type hierarchy of the target type?
        */
        isTarget?: boolean;
    }
    /**
    * Represents references of reflections to their defining source files.
    *
    * @see [[DeclarationReflection.sources]]
    */
    interface IDeclarationSource {
        /**
        * A reference to the corresponding file instance.
        */
        file?: SourceFile;
        /**
        * The filename of the source file.
        */
        fileName: string;
        /**
        * The number of the line that emitted the declaration.
        */
        line: number;
    }
    /**
    * A reflection that represents a single declaration emitted by the TypeScript compiler.
    *
    * All parts of a project are represented by DeclarationReflection instances. The actual
    * kind of a reflection is stored in its ´kind´ member.
    */
    class DeclarationReflection extends BaseReflection {
        /**
        * The definition of the underlying symbol.
        *
        * This is a string representation of the declaration which can be used
        * in templates, when no other presentation of this declaration is available.
        */
        public definition: string;
        /**
        * A list of function signatures attached to this declaration.
        *
        * TypeDoc creates one declaration per function that may contain ore or more
        * signature reflections.
        */
        public signatures: DeclarationReflection[];
        /**
        * The type of the reflection.
        *
        * If the reflection represents a variable or a property, this is the value type.<br />
        * If the reflection represents a signature, this is the return type.
        */
        public type: BaseType;
        /**
        * A list of all types this reflection extends (e.g. the parent classes).
        */
        public extendedTypes: BaseType[];
        /**
        * A list of all types that extend this reflection (e.g. the subclasses).
        */
        public extendedBy: BaseType[];
        /**
        * A bitmask containing the flags of this reflection as returned by the compiler.
        */
        public flags: TypeScript.PullElementFlags;
        /**
        * An array representation of the flags bitmask, containing only the flags relevant for documentation.
        */
        public flagsArray: any;
        /**
        * The kind of this reflection as returned by the compiler.
        */
        public kind: TypeScript.PullElementKind;
        /**
        * The human readable string representation of the kind of this reflection.
        */
        public kindString: string;
        /**
        * A list of all source files that contributed to this reflection.
        */
        public sources: IDeclarationSource[];
        /**
        * The default value of this reflection.
        *
        * Applies to function parameters.
        */
        public defaultValue: string;
        /**
        * Whether this reflection is an optional component or not.
        *
        * Applies to function parameters and object members.
        */
        public isOptional: boolean;
        /**
        * Is this a private member?
        */
        public isPrivate: boolean;
        /**
        * Is this a static member?
        */
        public isStatic: boolean;
        /**
        * Is this member exported?
        */
        public isExported: boolean;
        /**
        * Contains a simplified representation of the type hierarchy suitable for being
        * rendered in templates.
        */
        public typeHierarchy: IDeclarationHierarchy;
        /**
        * A type that points to the reflection that has been overwritten by this reflection.
        *
        * Applies to interface and class members.
        */
        public overwrites: BaseType;
        /**
        * A type that points to the reflection this reflection has been inherited from.
        *
        * Applies to interface and class members.
        */
        public inheritedFrom: BaseType;
        /**
        * A list of generated css classes that should be applied to representations of this
        * reflection in the generated markup.
        */
        public cssClasses: string;
        /**
        * @param kind  The kind to test for.
        */
        public kindOf(kind: TypeScript.PullElementKind): boolean;
        /**
        * @param kind  An array of kinds to test for.
        */
        public kindOf(kind: TypeScript.PullElementKind[]): boolean;
        /**
        * Return a string representation of this reflection.
        */
        public toString(): string;
        /**
        * Return a string representation of this reflection and all of its children.
        *
        * @param indent  Used internally to indent child reflections.
        */
        public toReflectionString(indent?: string): string;
        /**
        * Return a string representation of the given value based upon the given enumeration.
        *
        * @param value        The value that contains the bit mask that should be explained.
        * @param enumeration  The enumeration the bits in the value correspond to.
        * @param separator    A string used to concat the found flags.
        * @returns            A string representation of the given value.
        */
        static flagsToString(value: number, enumeration: any, separator?: string): string;
    }
}
declare module TypeDoc.Models {
    /**
    * A reflection that represents the root of the project.
    *
    * The project reflection acts as a global index, one may receive all reflections
    * and source files of the processed project through this reflection.
    */
    class ProjectReflection extends BaseReflection {
        /**
        * A list of all reflections within the project.
        */
        public reflections: DeclarationReflection[];
        /**
        * The root directory of the project.
        */
        public directory: SourceDirectory;
        /**
        * A list of all source files within the project.
        */
        public files: SourceFile[];
        /**
        * The name of the project.
        *
        * The name can be passed as a commandline argument or it is read from the package info.
        */
        public name: string;
        /**
        * The contents of the readme.md file of the project when found.
        */
        public readme: string;
        /**
        * The parsed data of the package.json file of the project when found.
        */
        public packageInfo: any;
        /**
        * Create a new ProjectReflection instance.
        *
        * @param name  The name of the project.
        */
        constructor(name: string);
        /**
        * Return a list of all reflections in this project of a certain kind.
        *
        * @param kind  The desired kind of reflection.
        * @returns     An array containing all reflections with the desired kind.
        */
        public getReflectionsByKind(kind: TypeScript.PullElementKind): DeclarationReflection[];
        /**
        * @param name  The name to look for. Might contain a hierarchy.
        */
        public findReflectionByName(name: string): DeclarationReflection;
        /**
        * @param names  The name hierarchy to look for.
        */
        public findReflectionByName(names: string[]): DeclarationReflection;
    }
}
declare module TypeDoc.Models {
    /**
    * A group of reflections. All reflections in a group are of the same kind.
    *
    * Reflection groups are created by the ´GroupHandler´ in the resolving phase
    * of the dispatcher. The main purpose of groups is to be able to more easily
    * render human readable children lists in templates.
    */
    class ReflectionGroup {
        /**
        * The title, a string representation of the typescript kind, of this group.
        */
        public title: string;
        /**
        * The original typescript kind of the children of this group.
        */
        public kind: TypeScript.PullElementKind;
        /**
        * All reflections of this group.
        */
        public children: DeclarationReflection[];
        /**
        * A list of generated css classes that should be applied to representations of this
        * group in the generated markup.
        */
        public cssClasses: string;
        /**
        * Do all children of this group have a separate document?
        *
        * A bound representation of the ´ReflectionGroup.getAllChildrenHaveOwnDocument´
        * that can be used within templates.
        */
        public allChildrenHaveOwnDocument: Function;
        /**
        * Are all children inherited members?
        */
        public allChildrenAreInherited: boolean;
        /**
        * Are all children private members?
        */
        public allChildrenArePrivate: boolean;
        /**
        * Are any children exported declarations?
        */
        public someChildrenAreExported: boolean;
        /**
        * Create a new ReflectionGroup instance.
        *
        * @param title The title of this group.
        * @param kind  The original typescript kind of the children of this group.
        */
        constructor(title: string, kind: TypeScript.PullElementKind);
        /**
        * Do all children of this group have a separate document?
        */
        private getAllChildrenHaveOwnDocument();
    }
}
declare module TypeDoc.Models {
    class SourceDirectory {
        public name: string;
        public dirName: string;
        public url: string;
        public parent: SourceDirectory;
        public directories: {
            [name: string]: SourceDirectory;
        };
        public files: SourceFile[];
        public groups: ReflectionGroup[];
        constructor(name?: string, parent?: SourceDirectory);
        public toString(indent?: string): string;
        public getAllReflections(): DeclarationReflection[];
    }
}
declare module TypeDoc.Models {
    class SourceFile {
        public name: string;
        public fileName: string;
        public url: string;
        public parent: SourceDirectory;
        public reflections: DeclarationReflection[];
        public groups: ReflectionGroup[];
        constructor(fileName: string);
    }
}
declare module TypeDoc.Models {
    class NavigationItem {
        public title: string;
        public url: string;
        public parent: NavigationItem;
        public children: NavigationItem[];
        public cssClasses: string;
        public isCurrent: boolean;
        public isInPath: boolean;
        public isPrimary: boolean;
        constructor(title?: string, url?: string, parent?: NavigationItem);
    }
}
declare module TypeDoc.Models {
    class RenderOutput extends Event {
        public target: RenderTarget;
        public filename: string;
        public url: string;
        public project: any;
        public model: any;
        public template: (context: any) => string;
        public templateName: string;
        public navigation: NavigationItem;
        public secondary: NavigationItem[];
        public contents: string;
        constructor(target: RenderTarget);
    }
}
declare module TypeDoc.Models {
    class RenderTarget extends Event {
        public project: ProjectReflection;
        public dirname: string;
        public urls: UrlMapping[];
    }
}
declare module TypeDoc.Models {
    /**
    *
    */
    class UrlMapping {
        public url: string;
        public model: any;
        public template: string;
        constructor(url: string, model: any, template: string);
    }
}
declare module TypeDoc.Models {
    class BaseType {
        public toString(): string;
    }
}
declare module TypeDoc.Models {
    class LateResolvingType extends BaseType {
        public declaration: TypeScript.PullDecl;
        public symbol: TypeScript.PullTypeSymbol;
        constructor(declaration: TypeScript.PullDecl);
        constructor(symbol: TypeScript.PullTypeSymbol);
    }
}
declare module TypeDoc.Models {
    class NamedType extends BaseType {
        public name: string;
        constructor(name: string);
        public toString(): string;
    }
}
declare module TypeDoc.Models {
    class ReflectionType extends BaseType {
        public reflection: DeclarationReflection;
        public isArray: boolean;
        constructor(reflection: DeclarationReflection, isArray: boolean);
        public toString(): string;
    }
}
declare module TypeDoc.Models {
    class StringConstantType extends BaseType {
        public value: string;
        constructor(value: string);
        public toString(): string;
    }
}
declare module TypeDoc.Output {
    class BasePlugin {
        public renderer: Renderer;
        constructor(renderer: Renderer);
    }
}
declare module TypeDoc.Output {
    class BaseTheme {
        public renderer: Renderer;
        public basePath: string;
        constructor(renderer: Renderer, basePath: string);
        public initialize(): void;
        public isOutputDirectory(dirname: string): boolean;
        public getUrls(project: Models.ProjectReflection): Models.UrlMapping[];
        public getNavigation(project: Models.ProjectReflection): Models.NavigationItem;
    }
}
declare module TypeDoc.Output {
    interface IHandlebarTemplate {
        (context?: any, options?: any): string;
    }
    class Renderer extends EventDispatcher {
        public application: IApplication;
        public plugins: BasePlugin[];
        public theme: BaseTheme;
        public ioHost: TypeScript.IIO;
        private templates;
        static PLUGIN_CLASSES: any[];
        constructor(application: IApplication);
        public setTheme(dirname: string): void;
        public getDefaultTheme(): any;
        public getTemplate(fileName: string): IHandlebarTemplate;
        public render(project: Models.ProjectReflection, outputDirectory: string): any;
        private renderTarget(target);
    }
}
declare module TypeDoc.Output {
    class AssetsPlugin extends BasePlugin {
        constructor(renderer: Renderer);
        private onRendererBeginTarget(target);
    }
}
declare module TypeDoc.Output {
    class LayoutPlugin extends BasePlugin {
        constructor(renderer: Renderer);
        private onRendererEndOutput(output);
    }
}
declare module TypeDoc.Output {
    /**
    * A plugin that exposes the markdown and relativeURL helper to handlebars.
    *
    * Templates should parse all comments with the markdown handler so authors can
    * easily format their documentation. TypeDoc uses the Marked (https://github.com/chjj/marked)
    * markdown parser and HighlightJS (https://github.com/isagalaev/highlight.js) to highlight
    * code blocks within markdown sections. Additionally this plugin allows to link to other symbols
    * using double angle brackets.
    *
    * You can use the markdown helper anywhere in the templates to convert content to html:
    *
    * ```handlebars
    * {{#markdown}}{{{comment.text}}}{{/markdown}}
    * ```
    *
    * The relativeURL helper simply transforms an absolute url into a relative url:
    *
    * ```handlebars
    * {{#relativeURL url}}
    * ```
    */
    class MarkedPlugin extends BasePlugin {
        /**
        * The project that is currently processed.
        */
        private project;
        /**
        * The reflection that is currently processed.
        */
        private reflection;
        /**
        * The current url that is currently generated.
        */
        private location;
        /**
        * Create a new MarkedPlugin instance.
        *
        * @param renderer  The renderer this plugin should be attached to.
        */
        constructor(renderer: Renderer);
        /**
        * Transform the given absolute to a relative path.
        *
        * @param absolute  The absolute path to transform.
        * @returns A path relative to the document currently processed.
        */
        public getRelativeUrl(absolute: string): any;
        /**
        * Parse the given markdown string and return the resulting html.
        *
        * @param text  The markdown string that should be parsed.
        * @returns The resulting html string.
        */
        public parseMarkdown(text: string): string;
        /**
        * Find all references to symbols within the given text and transform them into a link.
        *
        * The references must be surrounded with double angle brackets. When the reference could
        * not be found, the original text containing the brackets will be returned.
        *
        * This function is aware of the current context and will try to find the symbol within the
        * current reflection. It will walk up the reflection chain till the symbol is found or the
        * root reflection is reached. As a last resort the function will search the entire project
        * for the given symbol.
        *
        * @param text  The text that should be parsed.
        * @returns The text with symbol references replaced by links.
        */
        public parseReferences(text: string): string;
        /**
        * Triggered when the renderer begins processing a project.
        *
        * @param target  Defines the current target context of the renderer.
        */
        private onRendererBeginTarget(target);
        /**
        * Triggered when the renderer begins processing a single output file.
        *
        * @param output  Defines the current output context of the renderer.
        */
        private onRendererBeginOutput(output);
    }
}
declare module TypeDoc.Output {
    class NavigationPlugin extends BasePlugin {
        public navigation: Models.NavigationItem;
        public location: string;
        constructor(renderer: Renderer);
        private onRendererBeginTarget(target);
        private onRendererBeginOutput(output);
    }
}
declare module TypeDoc.Output {
    class PartialsPlugin extends BasePlugin {
        constructor(renderer: Renderer);
        private onRendererBeginTarget(target);
    }
}
declare module TypeDoc {
    /**
    *
    * @param file
    * @returns {TypeScript.FileInformation}
    */
    function readFile(file: any): string;
}
declare module TypeScript {
    interface IFindFileResult {
        fileInformation: FileInformation;
        path: string;
    }
    interface IFileWatcher {
        close(): void;
    }
    interface IIO {
        readFile(path: string, codepage: number): FileInformation;
        appendFile(path: string, contents: string): void;
        writeFile(path: string, contents: string, writeByteOrderMark: boolean): void;
        deleteFile(path: string): void;
        dir(path: string, re?: RegExp, options?: {
            recursive?: boolean;
        }): string[];
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        createDirectory(path: string): void;
        resolvePath(path: string): string;
        dirName(path: string): string;
        findFile(rootPath: string, partialFilePath: string): IFindFileResult;
        print(str: string): void;
        printLine(str: string): void;
        arguments: string[];
        stderr: ITextWriter;
        stdout: ITextWriter;
        watchFile(fileName: string, callback: (x: string) => void): IFileWatcher;
        run(source: string, fileName: string): void;
        getExecutingFilePath(): string;
        quit(exitCode?: number): void;
    }
    module IOUtils {
        function writeFileAndFolderStructure(ioHost: IIO, fileName: string, contents: string, writeByteOrderMark: boolean): void;
        function throwIOError(message: string, error: Error): void;
        function combine(prefix: string, suffix: string): string;
        class BufferedTextWriter implements ITextWriter {
            public writer: {
                Write: (str: string) => void;
                Close: () => void;
            };
            public capacity: number;
            public buffer: string;
            constructor(writer: {
                Write: (str: string) => void;
                Close: () => void;
            }, capacity?: number);
            public Write(str: string): void;
            public WriteLine(str: string): void;
            public Close(): void;
        }
    }
    var IO: IIO;
}
declare module TypeScript {
    interface IOptions {
        name?: string;
        flag?: boolean;
        short?: string;
        usage?: {
            locCode: string;
            args: string[];
        };
        set?: (s: string) => void;
        type?: string;
        experimental?: boolean;
    }
    class OptionsParser {
        public host: IIO;
        public version: string;
        private DEFAULT_SHORT_FLAG;
        private DEFAULT_LONG_FLAG;
        private printedVersion;
        private findOption(arg);
        public unnamed: string[];
        public options: IOptions[];
        constructor(host: IIO, version: string);
        public printUsage(): void;
        public printVersion(): void;
        public option(name: string, config: IOptions, short?: string): void;
        public flag(name: string, config: IOptions, short?: string): void;
        public parseString(argString: string): void;
        public parse(args: string[]): void;
    }
}
