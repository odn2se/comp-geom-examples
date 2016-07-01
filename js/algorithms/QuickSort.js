// In place quick sort implementation

function sort(arr, comparator) {
    console.log("Logging array", arr);
    qsRecurse(arr, 0, arr.length);

    return arr;
}

// right exclusive
function qsRecurse(arr, left, right) {
    // Dont need to sort anything less than or equal to size 1
    if (right - left <= 1)
        return;

    //console.log("Sorting ", arr, left, right);
    var pivot = arr[left];

    var pivotLocation = left + 1;

    for (var i = left + 1; i < right; i++) {
        var ele = arr[i];
        if (ele <= pivot) {
            // swap arr[i] and arr[pivotLocation]
            arr[i] = arr[pivotLocation];
            arr[pivotLocation] = ele;

            pivotLocation++;
        }
    }

    arr[left] = arr[pivotLocation - 1];
    arr[pivotLocation - 1] = pivot;

    qsRecurse(arr, left, pivotLocation - 1);
    qsRecurse(arr, pivotLocation, right);
}