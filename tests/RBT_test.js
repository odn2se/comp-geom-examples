
module("RBT Tests");

test("insert", function () {
    var rbt = new RBT(d3.ascending);
    rbt.insert(2);
    ok(rbt.insert(3));

    ok(rbt.contains(3));
});


test("insert rebalance", function () {
    var rbt = new RBT(d3.ascending);
    rbt.insert(2);
    ok(rbt.insert(3));
    ok(rbt.insert(4));

    ok(rbt.contains(4));
    equal(rbt.height(), 2);
});