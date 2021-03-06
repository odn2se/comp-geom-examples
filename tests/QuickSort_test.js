/**
 * Created by phand on 5/3/16.
 */

module("QuickSort Tests");

test("basic", function () {
    var arr = [2, 1, 3];
    sort(arr);

    equal(arr[0], 1);
    equal(arr[1], 2);
    equal(arr[2], 3);
});


test("basic 2", function () {
    var arr = [4, 1, 3, 8, 7, 6, 2, 5];
    sort(arr);

    for (var i = 0; i < 8; i++) {
        equal(arr[i], i + 1);
    }
});


test("pivot right", function () {
    var arr = [4, 1, 2, 3];
    sort(arr);

    for (var i = 0; i < 4; i++) {
        equal(arr[i], i + 1);
    }
});