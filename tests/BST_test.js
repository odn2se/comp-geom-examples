/**
 * Created by phand on 10/5/15.
 */

module("BST Tests");

test("insert", function () {
    var bst = new BST(d3.ascending);
    bst.insert(2);
    ok(bst.insert(3));
    ok(bst.insert(2.5));
    ok(bst.insert(2.5).insert(3));

    ok(bst.contains(2.5));
    ok(!bst.contains(2.7));
});

test("delete", function () {
    var bst = new BST(d3.ascending);

    bst.insert(2);
    ok(!bst.isEmpty());
    ok(bst.delete(2));
    ok(bst.isEmpty());

    ok(bst.delete(2));
    ok(bst.isEmpty());

    bst.insert(2).insert(5).insert(3).insert(4);
    ok(bst.delete(4));
    equal(bst.size(), 3);
    ok(!bst.contains(4));

    ok(bst.delete(5));
    equal(bst.size(), 2);
    ok(!bst.contains(5));
});


test("pre order", function () {
    var bst = new BST(d3.ascending);

    bst.insert(2).insert(3).insert(1).insert(1.5);
    var str = "";
    bst.preOrder(function (d) {
        str += d + ",";
    });

    equal(str, "2,1,1.5,3,", "Pre order works");
});

test("findPrev, findNext", function () {
    var bst = new BST(d3.ascending);

    bst.insert(2).insert(3).insert(1).insert(40).insert(4);

    equal(bst.findPrev(1.5), 1, "Previous of non-existant value");
    equal(bst.findPrev(1), null, "Previous of first value");
    equal(bst.findPrev(0.75), null, "Previous of non-existant first value");
    equal(bst.findNext(40.75), null, "Previous of non-existant first value");
});