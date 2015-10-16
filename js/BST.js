/**
 * Created by phand on 9/28/15.
 */

function BST(compare) {
    this.compare = compare;
    this.root = null;
}

function Node(val, parent) {
    this.value = val;
    this.parent = parent;
    this.left = null;
    this.right = null;
}

Node.prototype.toString = function () {
    return "[Node " + this.value + "]";
};


function printVisitor(d) {
    console.log("%o", d);
}


BST.prototype.inOrder = function (visitor) {
    function inOrderRecurse(node, visitor) {
        if (node === null)
            return;

        inOrderRecurse(node.left, visitor);
        visitor(node.value);
        inOrderRecurse(node.right, visitor);
    }

    inOrderRecurse(this.root, visitor);
};

BST.prototype.preOrder = function (visitor) {
    function preOrderRecurse(node, visitor) {
        if (node === null)
            return;

        visitor(node.value);
        preOrderRecurse(node.left, visitor);
        preOrderRecurse(node.right, visitor);
    }

    preOrderRecurse(this.root, visitor);
};

BST.prototype.size = function () {
    var size = 0;
    this.inOrder(function (d) {
        size++;
    });
    return size;
};

BST.prototype.isEmpty = function () {
    return this.size() === 0;
};

BST.prototype.insert = function (d) {
    function insertRecurse(bst, node, d) {
        var comp = bst.compare(node.value, d);

        if (comp === 0) {
            //console.debug("BST already contains value %o", d);
            return;
        } else if (comp > 0) {
            if (node.left === null)
                node.left = new Node(d, node);
            else
                insertRecurse(bst, node.left, d);
        } else {
            if (node.right === null)
                node.right = new Node(d, node);
            else
                insertRecurse(bst, node.right, d);
        }
    }

    var size = this.size();
    console.debug("Adding %o into BST", d.toString(), size);
    if (this.root === null) {
        this.root = new Node(d, null);
    } else {
        insertRecurse(this, this.root, d);
    }

    return this;
};

function searchRecurse(bst, node, d) {
    if (node === null)
        return null;

    var comp = bst.compare(node.value, d);

    if (comp === 0)
        return node;
    else if (comp < 0)
        return searchRecurse(bst, node.right, d);
    else if (comp > 0)
        return searchRecurse(bst, node.left, d);

}

BST.prototype.contains = function (d) {
    return searchRecurse(this, this.root, d) !== null;
};

BST.prototype.findMin = function () {
    if (this.root === null)
        return null;

    return findMin(this.root).value;
};

BST.prototype.findMax = function () {
    if (this.root === null)
        return null;

    return findMax(this.root).value;
};

function findMin(node) {
    if (node.left === null)
        return node;
    return findMin(node.left);
}

function findMax(node) {
    if (node.right === null)
        return node;
    return findMax(node.right);
}

BST.prototype.delete = function (d) {
    function replaceNode(bst, node, newNode) {
        // console.debug("Replacing node %o with %o", node, newNode);

        if (node.parent === null)
            bst.root = newNode;
        else if (node.parent.right === node)
            node.parent.right = newNode;
        else
            node.parent.left = newNode;

        if (newNode !== null)
            newNode.parent = node.parent;

    }

    function deleteRecurse(bst, node, d) {
        if (node === null) {
            // console.debug("Value %o not found", d);
            return false;
        }

        var comp = bst.compare(node.value, d);
        if (comp === 0) {
            if (node.left !== null && node.right !== null) {
                var leftMostRightNode = findMin(node.right);
                node.value = leftMostRightNode.value;
                deleteRecurse(bst, node.right, leftMostRightNode.value);
            } else if (node.left === null) {
                replaceNode(bst, node, node.right);
            } else {
                replaceNode(bst, node, node.left);
            }
        } else if (comp < 0) {
            deleteRecurse(bst, node.right, d);
        } else {
            deleteRecurse(bst, node.left, d);
        }
    }

    deleteRecurse(this, this.root, d);
    return this;
};

BST.prototype.findPrev = function (d) {
    var node = searchRecurse(this, this.root, d);

    if (node === null)
        return null;

    function findLeftParent(node) {
        if (node.parent === null)
            return null;

        if (node.parent.right === node)
            return node.parent;
        else
            return findLeftParent(node.parent);
    }

    if (node.left !== null) {
        // Find the least element in the right node
        return findMax(node.left).value;
    } else {
        // Look up to the parents until we find a right parent
        var leftParent = findLeftParent(node);
        if (leftParent === null) {
            // console.debug("Node %o is the min in the BST", d);
            return null;
        } else
            return leftParent.value;
    }
};

BST.prototype.findNext = function (d) {
    var node = searchRecurse(this, this.root, d);

    if (node === null) {
        //  console.debug("%o is not in the BST", d);
        return null;
    }

    function findRightParent(node) {
        if (node.parent === null)
            return null;

        if (node.parent.left === node)
            return node.parent;
        else
            return findRightParent(node.parent);
    }

    if (node.right !== null) {
        // Find the least element in the right node
        return findMin(node.right).value;
    } else {
        // Look up to the parents until we find a right parent
        var rightParent = findRightParent(node);
        if (rightParent === null) {
            // console.debug("Node %o is the max in the BST", d);
            return null;
        } else
            return rightParent.value;
    }
};

BST.prototype.toString = function() {
    return "BST";
};