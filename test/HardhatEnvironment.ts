import assert from "assert";

describe("Hardhat Runtime Environment", function () {
    it("should have a config field", function () {
      assert.notEqual(hre.config, undefined);
    });
  });
    