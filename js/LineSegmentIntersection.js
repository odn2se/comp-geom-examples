/*
 * 
 * Input an array of line segments
 *
 * From "Computational Geometry" Section 2.1
 */
function findIntersections(lineSegments) {
    var eventQueue = new BST(compareEvents);
    var statusStructure = new BST(null);

    var intersections = [];

    lineSegments.forEach(function (segment) {
        var topPt = comparePts(segment.pt1, segment.pt2) < 0 ? segment.pt1 : segment.pt2;
        var btPt = comparePts(segment.pt1, segment.pt2) < 0 ? segment.pt2 : segment.pt1;
        eventQueue.insert(new SegmentStartEvent(topPt, segment));
        eventQueue.insert(new SegmentEndEvent(btPt, segment));
        console.log("Inserted segment %o", segment);
    });

    console.log("EventQueue is %o", eventQueue);

    eventQueue.inOrder(printVisitor);

    while (!eventQueue.isEmpty()) {
        var maxEvent = eventQueue.findMin();
        console.debug("Removing %o from event queue", maxEvent);
        eventQueue.delete(maxEvent);
        handleEventPoint(maxEvent);
    }

    return intersections;

    function handleEventPoint(p) {
        var nextNeighbor, prevNeighbor;
        console.debug("Handling event point %o", p);
        if (p.type === 'SegmentStart') {
            //if (statusStructure.compare == null)
            statusStructure.compare = compareSegmentsAtPt(p.pt);
            statusStructure.insert(p.segment);

            console.log("Size of status is %d", statusStructure.size());

            nextNeighbor = statusStructure.findNext(p.segment);
            prevNeighbor = statusStructure.findPrev(p.segment);

            // Find the intersections between this new segment and the segments to the left and right
            findNewEventPoint(p.segment, nextNeighbor, p.pt);
            findNewEventPoint(prevNeighbor, p.segment, p.pt);

            console.debug("Inserted %o, next neighbor is now %o, prev neighbor is now %o", p.segment, nextNeighbor, prevNeighbor);

            console.log("X vals at pt from BST: %o", statusStructure);
            statusStructure.inOrder(function (seg) {
                console.log("%o: %f", seg.name, seg.x(p.pt));
            });
        } else if (p.type === 'SegmentEnd') {
            console.debug("Removing %o from status structure", p);
            nextNeighbor = statusStructure.findNext(p.segment);
            prevNeighbor = statusStructure.findPrev(p.segment);
            statusStructure.delete(p.segment);
        } else if (p.type === 'SegmentIntersection') {
            intersections.push(p);
            console.debug("Intersection between %o and %o", p.s1, p.s2);
            statusStructure.delete(p.s1);
            statusStructure.delete(p.s2);
            statusStructure.compare = compareSegmentsAtPt(p.pt);
            statusStructure.insert(p.s1);
            statusStructure.insert(p.s2);
            var s1next = statusStructure.findNext(p.s1);
            var sl, sll, sr, srr;
            if (s1next == p.s2) {
                console.debug("s1 (%o) is the left segment now", p.s1);
                sl = p.s1;
                sr = p.s2;
            } else {
                console.debug("s1 (%o) is the right segment now", p.s1);
                sr = p.s1;
                sl = p.s2;
            }
            sll = statusStructure.findPrev(sl);
            srr = statusStructure.findNext(sr);

            findNewEventPoint(sll, sl, p.pt);
            findNewEventPoint(sr, srr, p.pt);
        }
    }

    function findNewEventPoint(sl, sr, pt) {
        if (sl === null || sr === null)
            return;
        var interX = (sr.intercept - sl.intercept) / (sl.slope - sr.slope);
        var interY = sl.y(interX);

        if (sl.containsY(interY) && sr.containsY(interY)) {
            console.debug("sl and sr intersect %o %o", sl, sr);
            if (interY > pt.y || (interY == pt.y && interX > pt.x)) {
                console.debug("Intersection is below the sweep line, adding to event queue");
                eventQueue.insert(new SegmentIntersection(new Point(interX, interY), sl, sr));
            }
        } else {
            console.debug("sl and sr dont intersect %o %o at %f, %f", sl, sr, interX, interY);
        }
    }
}
function compareSegmentsAtPt(p) {
    return function (s1, s2) {
        if (s1 == s2)
            return 0;

        var s1x = s1.x(p);
        s1x = Math.round(s1x * 10000) / 10000;
        var s2x = s2.x(p);
        s2x = Math.round(s2x * 10000) / 10000;

        if (s1x < s2x)
            return -1;
        else if (s1x > s2x)
            return 1;
        else {
            // Equal - compare their slopes to see who is on the left immediately BELOW the point
            if (s1.slope < 0 && s2.slope < 0) {
                if (s1.slope < s2.slope)
                    return 1;
                else
                    return 0;
            } else if (s2.slope < 0 && s1.slope >= 0) {
                return 1;
            } else if (s1.slope < 0 && s2.slope >= 0) {
                return -1;
            } else {
                if (s1.slope < s2.slope)
                    return 1;
                else
                    return -1;
            }
        }
    };
}

function comparePts(pt1, pt2) {
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

function compareEvents(a, b) {
    return comparePts(a.pt, b.pt);
}

/*
 * Event types
 */
function SegmentStartEvent(pt, segment) {
    this.pt = pt;
    this.segment = segment;
    this.type = "SegmentStart";
}

function SegmentIntersection(pt, s1, s2) {
    this.pt = pt;
    this.type = "SegmentIntersection";
    this.s1 = s1;
    this.s2 = s2;
}

function SegmentEndEvent(pt, segment) {
    this.pt = pt;
    this.type = "SegmentEnd";
    this.segment = segment;
}