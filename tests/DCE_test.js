/**
 * Created by phand on 10/12/15.
 */

module("Data Structure Tests");


test("create face", function () {
    var dce = new DoublyConnectedEdgeList();

    dce.addFace([new Point(1, 1), new Point(0, 1), new Point(0, 0)]);

    equal(dce.getNumFaces(), 1);
});

test("face with internal only", function () {
    var dce = new DoublyConnectedEdgeList();

    dce.addFace(null, [new Point(1, 1), new Point(0, 1), new Point(0, 0)]);
});