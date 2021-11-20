"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const reg_suit_core_1 = require("reg-suit-core");
const capture_screenshots_1 = require("../capture-screenshots");
describe("Visual Test", () => {
    let test = it;
    if (process.env["SKIP_VISUAL_TEST"]) {
        test = it.skip;
    }
    test("Successfully compares to baseline", async function () {
        await (0, capture_screenshots_1.captureRegressionScreenshots)();
        const reg = new reg_suit_core_1.RegSuitCore({
            configFileName: ".config/regconfig.json",
        });
        const processor = reg.createProcessor();
        const result = await processor.compare(await processor.getExpectedKey());
        (0, assert_1.deepStrictEqual)(result.comparisonResult.newItems, [], "Cannot run visual test without previously created baseline");
        (0, assert_1.deepStrictEqual)(result.comparisonResult.deletedItems, []);
        (0, assert_1.deepStrictEqual)(result.comparisonResult.failedItems, []);
    });
});
//# sourceMappingURL=visual.test.js.map