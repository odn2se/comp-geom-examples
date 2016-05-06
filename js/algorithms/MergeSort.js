/**
 * Created by phand on 5/6/16.
 */

function mergeSort(arr, comparator) {
    console.log("Logging array", arr);
    return msRecurse(arr);
}

function msRecurse(arr) {
    if (arr.length <= 1)
        return arr;

    var mid = Math.floor(arr.length / 2);
    var left = arr.slice(0, mid);
    var right = arr.slice(mid);
    var leftSorted = msRecurse(left);
    var rightSorted = msRecurse(right);

    var merged = [];
    var leftIndex = 0, rightIndex = 0;
    while (leftIndex < leftSorted.length || rightIndex < rightSorted.length) {
        if (leftIndex == leftSorted.length)
            merged.push(rightSorted[rightIndex++]);
        else if (rightIndex == rightSorted.length)
            merged.push(leftSorted[leftIndex++]);
        else {
            if (leftSorted[leftIndex] < rightSorted[rightIndex])
                merged.push(leftSorted[leftIndex++]);
            else
                merged.push(rightSorted[rightIndex++]);
        }
    }

    return merged;
}