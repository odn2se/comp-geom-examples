/**
 * Created by phand on 7/28/16.
 */

/*
 * Currently Javascript does not support TCO (tail call optimization),
 * so this function doesn't work well for the lists of over a billion or so
 */

var chunkSize = 5;
var medianOfChunk = medianOf5;

function findMedian(list, comparator) {
    if (list.length === 0)
        return null;
    if (list.length === 1)
        return list[0];

    return quickSelect(list, Math.floor(list.length / 2), comparator);
}

function findMedianOfMedians(list, comparator) {
    if (list.length <= chunkSize) {
        var median = medianOfChunk(list);
        return medianOfChunk(list);
    }

    var chunks = [];
    var numChunks = Math.floor(list.length / chunkSize);
    var mediansOfChunks = [];

    for (var i = 0; i < numChunks; i++) {
        mediansOfChunks.push(medianOfChunk(list.slice(i * chunkSize, i * chunkSize + chunkSize)));
    }

    return findMedian(mediansOfChunks, comparator);
}

function quickSelect(list, k, comparator) {
    if (list.length === 1)
        return list[0];

    var medianOfMedians = findMedianOfMedians(list, comparator);

    var lessThan = [];
    var greaterThan = [];
    var singleValue = true;
    for (var i = 0; i < list.length; i++) {
        if (singleValue && list[i] !== list[0])
            singleValue = false;
        if (list[i] <= medianOfMedians)
            lessThan.push(list[i]);
        else
            greaterThan.push(list[i]);
    }

    if (singleValue)
        return list[0];

    if (lessThan.length === list.length) {
        // More than half the elements are the median
        if (k < list.length / 2)
            return quickSelect(lessThan.slice(Math.floor(list.length / 2)), k, comparator);
        else
            return medianOfMedians;
    }

    if (lessThan.length > k)
        return quickSelect(lessThan, k, comparator);
    else
        return quickSelect(greaterThan, k - lessThan.length, comparator);
}

function medianOf1(chunk) {
    return chunk[0];
}

function medianOf2(chunk) {
    if (chunk.length < 2)
        return medianOf1(chunk);
    var a = chunk[0];
    var b = chunk[1];

    return (a + b) / 2;
}

// Median of 3 in two comparisons (sortation)
function medianOf3(chunk) {
    if (chunk.length < 3)
        return medianOf2(chunk);

    var a = chunk[0];
    var b = chunk[1];
    var c = chunk[2];

    if (a < b) {
        if (b < c) {
            return b;
        } else if (a < c) {
            return c;
        } else {
            return a;
        }
    } else {
        if (a < c) {
            return a;
        } else if (b < c) {
            return c;
        } else {
            return b;
        }
    }
}

function swp(l, a, b) {
    var tmp = l[a];
    l[a] = l[b];
    l[b] = tmp;
}

function srt(l, a, b) {
    if (l[a] > l[b]) {
        swp(l, a, b);
    }
}

// Median of 4 in 5 comparisons
function medianOf4(c) {
    if (c.length < 4)
        return medianOf3(c);

    c = c.slice(0); // copy
    srt(c, 0, 1);
    srt(c, 2, 3);
    srt(c, 2, 0);
    srt(c, 1, 3);
    srt(c, 3, 2);
    // index 0 is now the smallest, index 3 is now the largest

    return (c[1] + c[2]) / 2;
}

// Median of 5 in 6 comparisons
function medianOf5(chunk) {
    if (chunk.length < 5)
        return medianOf4(chunk);

    chunk = chunk.slice(0); // copy

    srt(chunk, 0, 1);
    srt(chunk, 2, 3);
    if (chunk[2] < chunk[0]) {
        swp(chunk, 1, 3);
        chunk[2] = chunk[0];
    }

    chunk[0] = chunk[4];

    srt(chunk, 0, 1);

    if (chunk[0] < chunk[2]) {
        swp(chunk, 1, 3);
        chunk[2] = chunk[0];
    }

    return Math.min(chunk[3], chunk[0]);
}