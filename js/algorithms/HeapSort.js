/**
 * Created by phand on 7/1/16.
 */


function numericalComparator(a, b) {
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
}

function heapSort(arr, comparator) {
    console.log("Logging array to HeapSort: ", arr);

    heapify(arr, comparator);

    for (var numSorted = 0; numSorted < arr.length; numSorted++) {
        var top = arr[0];
        arr[0] = arr[arr.length - numSorted - 1];
        arr[arr.length - numSorted - 1] = top;
        bubbleDown(arr, arr.length - numSorted - 1, 0, comparator);
    }
}

function heapify(arr, comparator) {
    // In place linear time heapify operation
    var heapifyIndex = arr.length - 1;

    for (var heapifyIndex = arr.length - 1; heapifyIndex >= 0; heapifyIndex--) {
        bubbleDown(arr, arr.length, heapifyIndex, comparator);
    }
}

function bubbleDown(arr, sizeOfArr, index, comparator) {
    var ele = arr[index];
    var leftChild = ele, rightChild = ele;
    if (index * 2 + 1 < sizeOfArr)
        leftChild = arr[index * 2 + 1];
    if (index * 2 + 2 < sizeOfArr)
        rightChild = arr[index * 2 + 2];

    if (comparator(leftChild, rightChild) > 0) {
        // Left child is bigger
        if (comparator(leftChild, ele) > 0) {
            arr[index] = leftChild;
            arr[index * 2 + 1] = ele;
            bubbleDown(arr, sizeOfArr, index * 2 + 1, comparator);
        }
    } else {
        // Right child is bigger
        if (comparator(rightChild, ele) > 0) {
            arr[index] = rightChild;
            arr[index * 2 + 2] = ele;
            bubbleDown(arr, sizeOfArr, index * 2 + 2, comparator);
        }
    }
}
