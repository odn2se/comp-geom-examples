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