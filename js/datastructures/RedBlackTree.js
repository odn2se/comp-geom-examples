/**
 * Created by phand on 4/25/16.
 */

function RBT(compare) {
    this.compare = compare;
    this.root = null;
}

var RED = true;
var BLACK = false;

function Node(val, parent, color) {
    this.value = val;
    this.parent = parent;
    this.left = null;
    this.right = null;
    this.color = color;
}

//  A helper method to find the uncle of a node
Node.prototype.uncle = function () {
    if (this.parent === null || this.parent.parent === null)
        return null;
    if (this.parent.parent.left === this.parent)
        return this.parent.parent.right;
    if (this.parent.parent.right === this.parent)
        return this.parent.parent.left;
};

RBT.prototype.insert = function (d, replaceFn) {
    function insertRecurse(bst, node, d) {
        var comp = bst.compare(node.value, d);

        if (comp === 0) {
            //console.debug("BST already contains value %o", d);
            if (typeof replaceFn !== 'undefined')
                node.value = replaceFn(node.value, d);

            return node;
        } else if (comp > 0) {
            if (node.left === null) {
                node.left = new Node(d, node, RED);
                return node.left;
            }
            else
                return insertRecurse(bst, node.left, d);
        } else {
            if (node.right === null) {
                node.right = new Node(d, node, RED);
                return node.right;
            } else
                return insertRecurse(bst, node.right, d);
        }
    }

    var size = this.size();
    console.debug("Adding %o into BST", d.toString(), size);

    var justInserted;
    if (this.root === null) {
        this.root = new Node(d, null);
        justInserted = this.root;
    } else {
        justInserted = insertRecurse(this, this.root, d);
    }

    // 5 Cases of Reb-Black Tree
    if (justInserted === this.root) {
        // This is the root of the tree. We require the root to be black, so we repaint
        justInserted.color = BLACK;
        return this;
    } else if (justInserted.parent.color === BLACK) {
        // Still a valid tree
        return this;
    } else if (justInserted.parent.color === RED && justInserted.uncle() === RED) {
        // Both the parent and uncle are RED

    }

    return this;
};

function searchRecurse(bst, node, d) {
    if (node === null)
        return null;

    var comp = bst.compare(node.value, d);

    if (comp === 0)
        return node;
    else if (comp < 0) {
        if (node.right === null)
            return node;
        return searchRecurse(bst, node.right, d);
    }
    else if (comp > 0) {
        if (node.left === null)
            return node;
        return searchRecurse(bst, node.left, d);
    }

}

// Copy some methods from BST
RBT.prototype.inOrder = BST.prototype.inOrder;
RBT.prototype.size = BST.prototype.size;
RBT.prototype.contains = BST.prototype.contains;