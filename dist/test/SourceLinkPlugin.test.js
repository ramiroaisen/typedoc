"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SourceLinkPlugin_1 = require("../lib/converter/plugins/SourceLinkPlugin");
const models_1 = require("../lib/models");
const assert_1 = require("assert");
describe("Repository", function () {
    describe("constructor", function () {
        it("defaults to github.com hostname", function () {
            const repository = new SourceLinkPlugin_1.Repository("", "", []);
            (0, assert_1.strictEqual)(repository.hostname, "github.com");
            (0, assert_1.strictEqual)(repository.type, models_1.RepositoryType.GitHub);
        });
        it("handles a personal GitHub HTTPS URL", function () {
            const mockRemotes = ["https://github.com/joebloggs/foobar.git"];
            const repository = new SourceLinkPlugin_1.Repository("", "", mockRemotes);
            (0, assert_1.strictEqual)(repository.hostname, "github.com");
            (0, assert_1.strictEqual)(repository.user, "joebloggs");
            (0, assert_1.strictEqual)(repository.project, "foobar");
            (0, assert_1.strictEqual)(repository.type, models_1.RepositoryType.GitHub);
        });
        it("handles an enterprise GitHub URL", function () {
            const mockRemotes = ["git@github.acme.com:joebloggs/foobar.git"];
            const repository = new SourceLinkPlugin_1.Repository("", "", mockRemotes);
            (0, assert_1.strictEqual)(repository.hostname, "github.acme.com");
            (0, assert_1.strictEqual)(repository.user, "joebloggs");
            (0, assert_1.strictEqual)(repository.project, "foobar");
            (0, assert_1.strictEqual)(repository.type, models_1.RepositoryType.GitHub);
        });
        it("handles a githubprivate.com URL", function () {
            const mockRemotes = [
                "ssh://org@bigcompany.githubprivate.com/joebloggs/foobar.git",
            ];
            const repository = new SourceLinkPlugin_1.Repository("", "", mockRemotes);
            (0, assert_1.strictEqual)(repository.hostname, "bigcompany.githubprivate.com");
            (0, assert_1.strictEqual)(repository.user, "joebloggs");
            (0, assert_1.strictEqual)(repository.project, "foobar");
            (0, assert_1.strictEqual)(repository.type, models_1.RepositoryType.GitHub);
        });
        it("handles a Bitbucket HTTPS URL", function () {
            const mockRemotes = [
                "https://joebloggs@bitbucket.org/joebloggs/foobar.git",
            ];
            const repository = new SourceLinkPlugin_1.Repository("", "", mockRemotes);
            (0, assert_1.strictEqual)(repository.hostname, "bitbucket.org");
            (0, assert_1.strictEqual)(repository.user, "joebloggs");
            (0, assert_1.strictEqual)(repository.project, "foobar");
            (0, assert_1.strictEqual)(repository.type, models_1.RepositoryType.Bitbucket);
        });
        it("handles a Bitbucket SSH URL", function () {
            const mockRemotes = ["git@bitbucket.org:joebloggs/foobar.git"];
            const repository = new SourceLinkPlugin_1.Repository("", "", mockRemotes);
            (0, assert_1.strictEqual)(repository.hostname, "bitbucket.org");
            (0, assert_1.strictEqual)(repository.user, "joebloggs");
            (0, assert_1.strictEqual)(repository.project, "foobar");
            (0, assert_1.strictEqual)(repository.type, models_1.RepositoryType.Bitbucket);
        });
        it("handles a GitLab HTTPS URL", function () {
            const mockRemotes = ["https://gitlab.com/joebloggs/foobar.git"];
            const repository = new SourceLinkPlugin_1.Repository("", "", mockRemotes);
            (0, assert_1.strictEqual)(repository.hostname, "gitlab.com");
            (0, assert_1.strictEqual)(repository.user, "joebloggs");
            (0, assert_1.strictEqual)(repository.project, "foobar");
            (0, assert_1.strictEqual)(repository.type, models_1.RepositoryType.GitLab);
        });
        it("handles a GitLab SSH URL", function () {
            const mockRemotes = ["git@gitlab.com:joebloggs/foobar.git"];
            const repository = new SourceLinkPlugin_1.Repository("", "", mockRemotes);
            (0, assert_1.strictEqual)(repository.hostname, "gitlab.com");
            (0, assert_1.strictEqual)(repository.user, "joebloggs");
            (0, assert_1.strictEqual)(repository.project, "foobar");
            (0, assert_1.strictEqual)(repository.type, models_1.RepositoryType.GitLab);
        });
    });
    describe("getURL", () => {
        const repositoryPath = "C:/Projects/foobar";
        const filePath = repositoryPath + "/src/index.ts";
        it("returns a GitHub URL", function () {
            const mockRemotes = ["https://github.com/joebloggs/foobar.git"];
            const repository = new SourceLinkPlugin_1.Repository(repositoryPath, "main", mockRemotes);
            repository.files = [filePath];
            (0, assert_1.strictEqual)(repository.getURL(filePath), "https://github.com/joebloggs/foobar/blob/main/src/index.ts");
        });
        it("returns a Bitbucket URL", function () {
            const mockRemotes = [
                "https://joebloggs@bitbucket.org/joebloggs/foobar.git",
            ];
            const repository = new SourceLinkPlugin_1.Repository(repositoryPath, "main", mockRemotes);
            repository.files = [filePath];
            (0, assert_1.strictEqual)(repository.getURL(filePath), "https://bitbucket.org/joebloggs/foobar/src/main/src/index.ts");
        });
        it("returns a GitLab URL", function () {
            const mockRemotes = ["https://gitlab.com/joebloggs/foobar.git"];
            const repository = new SourceLinkPlugin_1.Repository(repositoryPath, "main", mockRemotes);
            repository.files = [filePath];
            (0, assert_1.strictEqual)(repository.getURL(filePath), "https://gitlab.com/joebloggs/foobar/-/blob/main/src/index.ts");
        });
    });
});
//# sourceMappingURL=SourceLinkPlugin.test.js.map