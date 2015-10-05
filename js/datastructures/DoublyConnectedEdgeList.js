/**
 * Created by phand on 10/4/15.
 */

function DoublyConnectedEdgeList() {
    this.vertices = [];
    this.faces = [];
    this.edges = [];
}

function HalfEdge(origin, twin, face, next, prev) {
    this.origin = origin;
    this.twin = twin;
    this.incidentFace = face;
    this.next = next;
    this.prev = prev;
}