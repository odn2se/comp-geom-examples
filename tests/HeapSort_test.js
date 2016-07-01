/**
 * Created by phand on 5/6/16.
 */

module("HeapSort Tests");

test("basic", function () {
    var arr = [2, 1, 3];
    arr = heapSort(arr);

    equal(arr[0], 1);
    equal(arr[1], 2);
    equal(arr[2], 3);
});

test("basic 2", function () {
    var arr = [4, 1, 3, 8, 7, 6, 2, 5];
    arr = heapSort(arr);

    for (var i = 0; i < 8; i++) {
        equal(arr[i], i + 1);
    }
});