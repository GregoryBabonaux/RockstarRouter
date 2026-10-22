import { test } from "node:test"; import assert from "node:assert";
import { search } from "../src/routes/search.js";
test("search finds by name", () => { assert.equal(search("ana").length >= 1, true); });
