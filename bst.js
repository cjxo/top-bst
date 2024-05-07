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
    return {
        left, right, data
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

    // this is bugged. 
    function actuallyBuildBST(sortedUniqueArray, low, high) {
        let midpoint = Math.floor((low + high) / 2);
        if ((low > high) || (midpoint >= sortedUniqueArray.length)) {
            return null;
        }

        let newNode = Node(sortedUniqueArray[midpoint]);

        newNode.left = actuallyBuildBST(sortedUniqueArray, low, midpoint - 1);
        newNode.right = actuallyBuildBST(sortedUniqueArray, midpoint + 1, high);

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
        while (currentNode) {
            if (currentNode.data < node.data) {
                currentNode = currentNode.right;
            } else if (currentNode.data > node.data) {
                currentNode = currentNode.left;
            } else if (currentNode.data === node.data) {
                break;
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

    // todo
    function insertItem(value) {
        
    }

    // todo
    function deleteItem(value) {
        
    }

    // todo
    function rebalance(params) {
        
    }

    return {
        root, buildTree, find, levelOrder, inOrder, preOrder, postOrder, height, depth, isBalanced
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
prettyPrint(tree.root);
//console.log(tree.find(324));
console.log(tree.levelOrder());
//tree.inOrder(element => {
  //  console.log(element);
//})
console.log(tree.inOrder());
console.log(tree.preOrder());
console.log(tree.postOrder());

console.log(tree.depth(tree.find(6)));
console.log(tree.height(tree.root));
console.log(tree.isBalanced());
