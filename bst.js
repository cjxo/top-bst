/*
 * What is a binary search tree (BST)? 
 * - It is an organized binary tree. 
 * - Each node in the tree consists of a left node, a right node, a key, and some data.
 * - A BST satisfies the following property:
 *   - Suppose x is a node in the BST. If y is a node in x's left subtree, then y.key <= x.key.
 *     Else if y is a node in x's right subtree, then y.key >= x.key. Easy.
 *
 */

function Node(data) {
    let left = null;
    let right = null;
    let parent = null;
    return {
        left, right, parent, data
    };
}

function Tree(initArray=[]) {
    let root = null;

    if (initArray.length) {
        buildTree(initArray);
    }

    function asSortedUniqueValues(array) {
        const sorted = array.toSorted((a, b) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });

        
        const uniqueSorted = [];
        let previousValue = NaN;
        sorted.forEach(element => {
            if (element !== previousValue) {
                uniqueSorted.push(element);
            }

            previousValue = element;
        });

        return uniqueSorted;
    }

    // this is bugged. fix this
    function actuallyBuildBST(sortedUniqueArray, low, high) {
        let midpoint = Math.floor((low + high) / 2);
        if ((low > high) || (midpoint >= sortedUniqueArray.length)) {
            return null;
        }

        let newNode = Node(sortedUniqueArray[midpoint]);

        newNode.left = actuallyBuildBST(sortedUniqueArray, low, midpoint - 1);
        if (newNode.left) {
            newNode.left.parent = newNode;
        }

        newNode.right = actuallyBuildBST(sortedUniqueArray, midpoint + 1, high);
        if (newNode.right) {
            newNode.right.parent = newNode;
        }

        return newNode;
    }

    function buildTree(array) {
        root = actuallyBuildBST(asSortedUniqueValues(array), 0, array.length - 1);
        return root;
    }

    function find(value) {
        let currentNode = root;
        while (currentNode && (currentNode.data !== value)) {
            if (value < currentNode.data) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        return currentNode;
    }

    function levelOrder(callback) {
        if (root) {
            let returedArray = [];
            let nodeQueue = [];

            nodeQueue.push(root);
            while (nodeQueue.length) {
                const dequeued = nodeQueue[0];
                nodeQueue.splice(0, 1);

                if (callback) {
                    callback(dequeued.data);
                } else {
                    returedArray.push(dequeued.data);
                }

                if (dequeued.left) {
                    nodeQueue.push(dequeued.left);
                }

                if (dequeued.right) {
                    nodeQueue.push(dequeued.right);
                } 
            }

            if (!callback) {
                return returedArray;
            }
        }
    }

    function inOrder(callback) {
        let returedArray = [];
        if (root) {
            let stack = [null];
            let currentNode = root;
            let byebye = false;
            while (!byebye) {
                while (currentNode.left) {
                    stack.push(currentNode);
                    currentNode = currentNode.left;
                }
                
                while (true) {
                    if (callback) {
                        callback(currentNode.data);
                    } else {
                        returedArray.push(currentNode.data);
                    }

                    if (currentNode.right) {
                        currentNode = currentNode.right;
                        break;
                    }
                    
                    currentNode = stack.pop();
                    if (currentNode === null) {
                        byebye = true;
                        break;
                    }
                }
            }
        }

        if (!callback) {
            return returedArray;
        }
    }

    function preOrder(callback) {
        let returedArray = [];

        if (root) {
            let stack = [root];

            while (stack.length) {
                let currentNode = stack.pop();

                // Print the current node
                if (callback) {
                    callback(currentNode.data);
                } else {
                    returedArray.push(currentNode.data);
                }
               
                // we save the right subtree root because we will visit the left subtree root first.
                if (currentNode.right) {
                    stack.push(currentNode.right);
                }
                
                // now push this into stack so in the next iteration, we deal with this.
                if (currentNode.left) {
                    stack.push(currentNode.left);
                }
            }
        } 

        if (!callback) {
            return returedArray;
        }
    }
    
    function postOrder(callback) {
        let returedArray = [];
        // lol
        (function inner(subtree) {
            if (subtree) {
                inner(subtree.left);
                inner(subtree.right);

                if (callback) {
                    callback(subtree.data);
                } else {
                    returedArray.push(subtree.data);
                }
            }
        })(root);
        
        return (returedArray);
    }

    function depth(node) {
        let currentNode = root;
        let depthResult = 0;
        while (currentNode && (currentNode.data !== node.data)) {
            if (currentNode.data < node.data) {
                currentNode = currentNode.right;
            } else if (currentNode.data > node.data) {
                currentNode = currentNode.left;
            }
            ++depthResult;
        }

        return depthResult;
    }
    
    function height(node) {
        if (node === null) {
            return 0;
        }

        const l = height(node.left);
        const r = height(node.right);

        if (l > r) {
            return l + 1;
        } else {
            return r + 1;
        }
    }

    function isBalanced() {
        let result = true;
        if (root) {
            const l = height(root.left);
            const r = height(root.right);

            if (Math.abs(l - r) <= 1) {
                result = true;
            } else {
                result = false;
            }
        }

        return(result);
    }

    function insertItem(value) {
        if (find(value) !== null) return;

        let newNode = Node(value);
        let currentNode = root;
        let parentOfNewNode = newNode;

        while (currentNode) {
            parentOfNewNode = currentNode;
            if (newNode.data < currentNode.data) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        newNode.parent = parentOfNewNode;
        if (parentOfNewNode === null) {
            root = newNode;
        } else if (newNode.data < parentOfNewNode.data) {
            parentOfNewNode.left = newNode;
        } else {
            parentOfNewNode.right = newNode;
        }
        
        rebalance();
    }

    function transplant(u, v) {
        if (u.parent === null) {
            root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }

        if (v !== null) {
            v.parent = u.parent;
        }
    }
   
    function minimum(node) {
        while (node.left) {
            node = node.left;
        }

        return node;
    }

    function deleteItem(value) {
        // Ok so this is quite complicated. Lets break this down
        // Lets say, we have a node z to delete. We have three cases to consider
        // 1. If z has no children, then we simply remove z and modify its parent 
        //    to replace z as null.
        // 2. If z has one child, then replace z with that child by modifying z's parent pointing to that child.
        // 3. If z has two children find z's successor y (successor is simply the next node to visit after z while doing inOrder),
        //    which belongs to z's right subtree. Then, replace z with y. z's right subtree becomes y's right subtree. Same for left.
        //    y's left subtree is empty. Why? because y = minimum(z.right), and minimum works by traversing the left subtree of z.right
        //    until we reach null. y's right child moves into y's original position.
        //      - if y is z's right child, replace z by y.
        //      - else if y is in z's right subtree, replace y by its right child and replace z by y. 

        let nodeToDelete = find(value);
        if (nodeToDelete) {
            if (nodeToDelete.left === null) {
                transplant(nodeToDelete, nodeToDelete.right);
            } else if (nodeToDelete.right === null) {
                transplant(nodeToDelete, nodeToDelete.left);
            } else {
                let successorOfNodeToDelete = minimum(nodeToDelete.right);
                if (successorOfNodeToDelete !== nodeToDelete.right) {
                    transplant(successorOfNodeToDelete, successorOfNodeToDelete.right);
                    successorOfNodeToDelete.right = nodeToDelete.right;
                    successorOfNodeToDelete.right.parent = successorOfNodeToDelete;
                }
               
                transplant(nodeToDelete, successorOfNodeToDelete);
                successorOfNodeToDelete.left = nodeToDelete.left;
                successorOfNodeToDelete.left.parent = successorOfNodeToDelete;
            }

            rebalance();
        }

        return nodeToDelete;
    }

    function rebalance(params) {
        if (!isBalanced()) {
            const inorder = inOrder();
            root = actuallyBuildBST(inorder, 0, inorder.length - 1);
        }
    }

    return {
        buildTree, find, levelOrder, inOrder, preOrder, postOrder, height, depth, isBalanced,
        insertItem, deleteItem, get root() { return root; },
    };
}

function prettyPrint(node, prefix="", isLeft=true) {
    if (node === null) {
        return;
    }

    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }

    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);

    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
}

//let tree = Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
let tree = Tree([0, 1, 2, 3, 4, 5, 6]);
tree.insertItem(7)
tree.insertItem(65.5)
tree.deleteItem(3);
prettyPrint(tree.root);
//console.log(tree.find(324));
//tree.inOrder(element => {
  //  console.log(element);
//})
//console.log(tree.inOrder());
//console.log(tree.preOrder());
//console.log(tree.postOrder());

//console.log(tree.depth(tree.find(6)));
//console.log(tree.height(tree.root));
//console.log(tree.isBalanced());
