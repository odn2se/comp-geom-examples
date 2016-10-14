/**
 * Created by phand on 10/13/16.
 */

module("Suffix Tree Tests");

test("simple", function () {
    var tree = new SuffixTree();

    tree.insert("hello");
    tree.insert("world");

    ok(tree.contains("hello"));
    ok(tree.contains("world"));
});

QUnit.test("simple_2", function (assert) {
    var tree = new SuffixTree();

    tree.insert("hello");
    tree.insert("help");
    ok(tree.contains("hello"));
    ok(tree.contains("help"));
    assert.notOk(tree.contains("hell"));
});

QUnit.test("find_pattern", function (assert) {
    var tree = new SuffixTree();

    tree.insert("aardvark");
    tree.insert("hark");

    console.log(tree);
    var arr = tree.findPattern("ark");
    ok(arr.includes("aardvark"));
    ok(arr.includes("hark"));

    arr = tree.findPattern("hark");
    ok(arr.includes("hark"));
    assert.notOk(arr.includes("aardvark"));

    arr = tree.findPattern("aard");
    ok(arr.includes("aardvark"));
    assert.notOk(arr.includes("hark"));
    equal(arr.length, 1);
});