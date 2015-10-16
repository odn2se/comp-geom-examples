/**
 * Created by phand on 10/4/15.
 */

var faceId = 0, vertexId = 0;

function ptComparator(pt1, pt2) {
    if (pt1.y < pt2.y)
        return -1;
    if (pt1.y > pt2.y)
        return 1;
    else {
        if (pt1.x < pt2.x)
            return -1;
        else if (pt1.x > pt2.x)
            return 1;
        else
            return 0;
    }
}

function vertexComparator(a, b) {
    return ptComparator(a.pt, b.pt);
}

function DoublyConnectedEdgeList() {
    this.vertices = new BST(vertexComparator);
    this.faces = [];
    this.edges = [];
}

function HalfEdge(origin, face, next, prev, twin) {
    this.origin = origin;
    this.twin = twin;
    this.incidentFace = face;
    this.next = next;
    this.prev = prev;
}

function Vertex(pt) {
    this.pt = pt;
    this.incidentEdge = null;
    this.name = "v" + (++vertexId);
}

function Face(outerComp, innerComp) {
    this.outerComponent = outerComp;
    this.innerComponents = [];
    this.name = "f" + (++faceId);
}

DoublyConnectedEdgeList.prototype.getNumFaces = function () {
    return this.faces.length;
};

/*
 * outerPts is an array of pts in ccw order
 * innerPts is a two dimensional array for the holes, each in cw order
 */

DoublyConnectedEdgeList.prototype.addFace = function (outerPts, innerPts) {
    function addFirstFace(outerPts, innerPts) {
        // Add all the points to the vertices array
        var that = this;
        this.vertices.insert(new Vertex(new Point(0, 0)));
        var vertices = outerPts.map(function (a) {
            return new Vertex(a);
        });
        vertices.forEach(function (v) {
            that.vertices.insert(v);
        });

        if (typeof innerPts !== 'undefined') {
            innerPts.forEach(function (arr) {
                arr.forEach(that.vertices.insert, that.vertices);
            });
        }

        var face = new Face();
        this.faces.push(face);
        var edges = [];
        var i;
        for (i = 0; i < vertices.length; i++) {
            var origin = vertices[i];
            var dest = vertices[(i + 1) % vertices.length];

            var halfEdge = new HalfEdge(origin, face);
            edges.push(halfEdge);

            if (i === 0) {
                face.outerComponent = halfEdge;
            }
        }

        for (i = 0; i < vertices.length; i++) {
            var edge = edges[i];
            var next = edges[(i + 1) % vertices.length];
            var prev = edges[(vertices.length + i - 1) % vertices.length];

            edge.next = next;
            edge.prev = prev;

            var twin = new HalfEdge(next.origin, null, prev, next, edge);
            edge.twin = twin;
        }
    }

    if (this.faces.length === 0) {
        addFirstFace.bind(this)(outerPts, innerPts);
    } else {
        // We need to merge two DCE
    }
};

Vertex.prototype.toString = function () {
    return this.name + "@" + this.pt;
};