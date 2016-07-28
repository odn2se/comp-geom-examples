/**
 * Created by phand on 7/28/16.
 */
module("Median of Medians Tests");

test("simple test", function () {
    var list = [];
    list.push(1);
    list.push(3);
    list.push(5);

    var result = findMedian(list);

    equal(result, 3);
});


test("simple test unordered", function () {
    var list = [];
    list.push(6);
    list.push(9);
    list.push(1);
    list.push(5);
    list.push(7);
    list.push(2);
    list.push(4);
    list.push(3);
    list.push(8);

    var result = findMedian(list);

    equal(result, 5);
});


test("large test (randomized)", function () {
    var list = [];

    for(var i = 0; i < 1000; i++) {
        list.push(Math.random() * 1000);
        list.push(Math.random() * 1000 + 10000);
    }
    list.push(5000);

    var result = findMedian(list);

    equal(result, 5000);
});