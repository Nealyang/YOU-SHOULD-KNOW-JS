## JavaScript设计模式与算法--树

### 概念
非顺序数据结构我们之前学习的有散列表，现在，我们接着学习另一个非顺序数据结构，树。树是一种分层数据的抽象模型。现实生活中最常见的树的例子是家谱，或是公司的组织架构图

位于树顶部的节点叫做根节点，它没有父节点。节点分为内部节点和外部节点，至少有一个子节点的节点成为内部节点，一个子节点也没有的成为外部节点也叫做叶节点。

一个节点可以有祖先和后代，一个节点(除了根节点)的祖先包括父节点、祖父节点、曾祖 父节点等。一个节点的后代包括子节点、孙子节点、曾孙节点等。

节点的一个属性是深度，节点的深度取决于它的祖先节点的数量。树的高度取决于所有节点深度的最大值。

### 二叉树和二叉搜索树
二叉树中的节点最多只能有两个子节点:一个是左侧子节点，另一个是右侧子节点。这些定 义有助于我们写出更高效的向/从树中插入、查找和删除节点的算法。二叉树在计算机科学中的 应用非常广泛。

二叉搜索树(BST)是二叉树的一种，但是它只允许你在左侧节点存储(比父节点)小的值， 在右侧节点存储(比父节点)大(或者等于)的值。

而我们今天主要研究的就是二叉搜索树

### 代码实现

```javascript
function BinarySearchTree() {
    var Node = function (key) {
        this.key = key;
        this.left = null;
        this.right = null;
    };

    function insertNode(node, newNode) {
        if (newNode.key < node.key) {
            if (node.left) {
                node.left = newNode;
            } else {
                insertNode(node.left, newNode);
            }
        } else {
            node.right ? insertNode(node.right, newNode) : node.right = newNode;
        }
    }


    var root = null;

    this.insert = function (key) {
        var newNode = new Node(key);
        if (root == null) {
            root = newNode;
        } else {
            insertNode(root, newNode);
        }
    };

    //遍历二叉树，中序遍历（inOrderTraverse） 先序遍历（preOrderTraverse） 后序遍历（postOrderTraverse）
    function inOrderTraverseNode(root, callBack) {
        if (!root) {
            inOrderTraverseNode(root.left, callBack);
            callBack(root.key);
            inOrderTraverseNode(root.right, callBack);
        }
    };

    function preOrderTraverseNode(root, callBack) {
        if (!root) {
            callBack(root.key);
            inOrderTraverseNode(root.left, callBack);
            inOrderTraverseNode(root.right, callBack);
        }
    };

    function postOrderTraverseNode(root, callBack) {
        if (!root) {
            inOrderTraverseNode(root.left, callBack);
            inOrderTraverseNode(root.right, callBack);
            callBack(root.key);
        }
    };
    this.inOrderTraverse = function (callBack) {
        inOrderTraverseNode(root, callBack);
    };

    function preOrderTraverse(callBack) {
        preOrderTraverseNode(root, callBack);
    };

    function postOrderTraverse(callBack) {
        postOrderTraverseNode(root, callBack);
    };

    var minNode = function (node) {
        if (node) {
            while (node && node.left !== null) {
                node = node.left;
                return node.key;
            }
            return null;
        }
    };
    var findMinNode = function (node) {
        if (node) {
            while (node && node.left !== null) {
                node = node.left;
                return node;
            }
            return null;
        }
    };
    this.min = function () {
        return minNode(root);
    };
    var maxNode = function (node) {
        if (node) {
            while (node && node.right !== null) {
                node = node.right;
            }
            return node.key;
        }
        return null;
    };
    this.max = function () {
        return maxNode(root);
    };
    var searchNode = function (node, key) {
        if (node === null) {
            return false;
        }
        if (key < node.key) {
            return searchNode(node.left, key);
        } else if (key > node.key) {
            return searchNode(node.right, key);
        } else {
            return true;
        }
    };
    this.search = function (key) {
        return searchNode(root, key);
    };

    this.remove = function (key) {
        root = removeNode(root, key);
    };
    var removeNode = function (node, key) {
        if (node) {
            if (key < node.key) {
                node.left = removeNode(node.left, key);
                return node;
            } else if (key > node.right) {
                node.right = removeNode(node.right, key);
                return node;
            }else {
                //叶节点
                if(node.left === null && node.right === null){
                    node = null;
                    return node;
                }else if(node.left === null){
                    node = node.right;
                    return node;
                }else if(node.right == null){
                    node = node.left;
                    return node;
                }
                //有两个子节点
                var aux = findMinNode(node.right);
                node.key = aux.key;
                node.right = removeNode(node.right, aux.key);
                return node;
            }

        } else {
            return null;
        }
    }
}
```

