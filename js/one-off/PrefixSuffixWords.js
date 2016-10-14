/**
 * Created by phand on 10/13/16.
 */

/*
 * What is the longest word that ends with the start of another?
 * e.g. BAZAAR and AARDVARK overlap is 3
 */

var tree = new SuffixTree();
var words = [];
d3.csv("data/dictionary.txt", function (data) {
    data.forEach(function (d) {
        tree.insert(d.word.slice(1));
        words.push(d.word);
    });

    var max = 0;
    for(var i = 0; i < words.length; i++) {
        var overlap = 0;
        var wordToTest = words[i].slice(0, words[i].length - 1);
        var substr = tree.longestSubstr(wordToTest);
        if(substr.arr.length > 1) {
            overlap = substr.matchedCharacters;
            if(overlap > max) {
                max = overlap;
                console.log("New max", max, substr.arr, words[i]);
            }
        }
    }
});