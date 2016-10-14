/**
 * Created by phand on 10/13/16.
 */

/*
 * A generalized suffix tree
 */

var TERMINATOR = "$";

function SuffixTree() {
    this.root = new Node();
}

function Node() {
    this.children = {};
}

function Leaf() {
    this.data = [];
}

SuffixTree.prototype.contains = function (str) {
    var res = this.root.findDeepest(str);

    return res.leftover === '' && res.node.getTerminated().length > 0;
};

SuffixTree.prototype.findPattern = function (str) {
    var res = this.root.findDeepest(str);

    if (res.leftover !== '')
        return [];
    else
        return Array.from(res.node.accumulateTerminated());
};

SuffixTree.prototype.insert = function (str) {
    var helper = function insertHelper(str, fullStr, root) {
        var deepest = root.findDeepest(str);
        var lastNode = deepest.node;
        var leftover = deepest.leftover;

        while (leftover.length > 0) {
            var char = leftover[0];
            lastNode.children[char] = new Node();
            lastNode = lastNode.children[char];
            leftover = leftover.slice(1);
        }

        if (!(TERMINATOR in lastNode.children))
            lastNode.children[TERMINATOR] = new Leaf();

        lastNode.children[TERMINATOR].data.push(fullStr);
    };

    for (var i = 0; i < str.length; i++) {
        helper(str.slice(i), str, this.root);
    }
};

Node.prototype.getTerminated = function () {
    if (!(TERMINATOR in this.children))
        return [];
    return this.children[TERMINATOR].data;
}

Node.prototype.findDeepest = function (str) {
    if (str === '')
        return {node: this, leftover: ''};

    var char = str[0];

    if (!(char in this.children)) {
        return {node: this, leftover: str};
    }

    var rest = str.slice(1);
    return this.children[char].findDeepest(rest);
};

Node.prototype.accumulateTerminated = function() {
    var s = new Set(this.getTerminated());

    for (var key in this.children) {
        if (this.children.hasOwnProperty(key) && key !== TERMINATOR) {
            this.children[key].accumulateTerminated().forEach(s.add, s);
        }
    }

    return s;
}