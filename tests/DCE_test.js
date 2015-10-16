/**
 * Created by phand on 10/12/15.
 */

module("Data Structure Tests");


test("create face", function () {
    var dce = new DoublyConnectedEdgeList([new Point(1, 1), new Point(0, 1), new Point(0, 0)]);

    equal(dce.getNumFaces(), 1);
    equal(dce.getNumHalfEdges(), 6);
});

test("face with internal only", function () {
    var dce = new DoublyConnectedEdgeList(null, [new Point(1, 1), new Point(0, 1), new Point(0, 0)]);

});

test("add two faces", function () {
    var dce = new DoublyConnectedEdgeList([new Point(2, 2), new Point(0, 2), new Point(0, 0), new Point(2, 0)]);
    var dce2 = new DoublyConnectedEdgeList([new Point(3, 3), new Point(1, 3), new Point(1, 1), new Point(3, 1)]);
    dce.merge(dce2);

    equal(dce.getNumFaces(), 2, "Expecting two faces");
});