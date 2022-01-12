/* eslint-disable no-undef */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from "chai";
import sinon from "sinon";

describe("Example Tests", function() {
  afterEach(function() {
    sinon.restore();
  });

  describe("given some conditions", function() {
    it("will succeed - regular", function() {
      expect(true).to.be.true;
    });

    it("will succeed - as promised", function(done) {
      const fooPromise = new Promise<void>((resolve) => {
        resolve();
      });
      fooPromise.then(() => {
        done();
      });
    });

    it("will throw", function() {
      expect(function() {
        throw new Error("hello!");
      }).to.throw("hello!", "This is the message if it does not throw");
    });
  });
});
