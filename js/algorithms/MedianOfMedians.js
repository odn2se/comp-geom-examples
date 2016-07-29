/**
 * Created by phand on 7/28/16.
 */


var chunkSize = 3;
var medianOfChunk = medianOf3;

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

    console.log("Quick select of " + k + "/" + list.length);

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