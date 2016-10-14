/**
 * Created by phand on 7/28/16.
 */
module("Median of Medians Tests");

test("simple test", function () {
    var list = [];
    list.push(1);
    list.push(3);
    list.push(5);

    var result = quickSelect(list, 1);

    equal(result, 3);
});


test("simple test unordered", function () {
    var list = [];
    list.push(9);
    list.push(6);
    list.push(1);
    list.push(5);
    list.push(7);
    list.push(2);
    list.push(3);
    list.push(8);
    list.push(4);

    var result = quickSelect(list, 4);

    equal(result, 5);
});


var largeTestSize = 100000;
test("large test (randomized)", function () {
    var list = [];

    for (var i = 0; i < largeTestSize; i++) {
        list.push(Math.random() * 1000);
        list.push(Math.random() * 1000 + 10000);
    }
    list.push(5000);

    var result = quickSelect(list, largeTestSize);

    equal(result, 5000);
});


test("large test (by sortation)", function () {
    var list = [];

    for (var i = 0; i < largeTestSize; i++) {
        list.push(Math.random() * 1000);
        list.push(Math.random() * 1000 + 10000);
    }
    list.push(5000);

    list = list.sort(d3.ascending);
    var result = list[largeTestSize];

    equal(result, 5000);
});

test("Variable test size", function () {
    var testKSize = function (k) {
        var list = [];

        for (var i = 0; i < k; i++) {
            list.push(Math.random() * 1000);
            list.push(Math.random() * 1000 + 10000);
        }
        list.push(5000);

        var result = quickSelect(list, k);

        equal(result, 5000);
    };

    var maxTestSize = 200000;
    //var maxTestSize = 2000;
    var results = [];
    for (var k = 1; k <= maxTestSize; k *= 2) {
        var t0 = performance.now();
        testKSize(k);
        var t1 = performance.now();
        results.push(t1 - t0);
    }
    console.log(results);
});