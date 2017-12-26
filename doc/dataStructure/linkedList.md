# JavaScript数据结构与算法--链表

## 概念
链表是一种动态的数据结构，这就意味着我们可以从中任意添加和移除元素，他也可以按需扩容。

链表存储有序的元素集合，但不同于数组，链表中的元素在内存中并不是连续放置的。每个 元素由一个存储元素本身的节点和一个指向下一个元素的引用(也称指针或链接)组成。

相对于传统的数组，链表的一个好处在于，添加或移除元素的时候不需要移动其他元素。然 而，链表需要使用指针，因此实现链表时需要额外注意。数组的另一个细节是可以直接访问任何 位置的任何元素，而要想访问链表中间的一个元素，需要从起点(表头)开始迭代列表直到找到 所需的元素。

## 代码实现

```javascript
function LinkedList() {
    var Node = function (element) { // {1}
        this.element = element;
        this.next = null;
    };
    var length = 0; // {2}
    var head = null; // {3}
    this.append = function (element) {
        var node = new Node(element),
            current ;
        if(head){
            current = head;
            // 循环链表，知道最后一项
            while (head.next){
                current = current.next;
            }
            current.next = node;
        }else{
            head = node;
        }
        length+=1;
    };
    this.insert = function (position, element) {
        if(position>-1 && position<=length){
            var node = new Node(element),
                current = head,
                previous,
                index = 0;
            if(position === 0){
                head = node;
                node.next = head;
            }else{
                while (index++ < position){
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
        }else{
            return false;
        }
    };
    this.removeAt = function (position) {
        if(position>-1 && position<length){
            var current = head,
                previous,
                index = 0;
            //移除第一项
            if(position === 0){
                head = current.next;
            }else{
                while (index++<position){
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            length-=1;
            return current.element;

        }else{
            return null;
        }
    };
    this.remove = function (element) {
        var index = this.indexOf(element);
        return this.removeAt(index);
    };
    this.indexOf = function (element) {
        var current = head,
            index = -1;
        while (current) {
            if (element === current.element) {
                return index;
            }
            index++;
            current = current.next;
        }
        return -1;
    };
    this.isEmpty = function () {
        return length === 0;
    };
    this.size = function () {
        return length;
    };
    this.toString = function(){
        var current = head,
            string = '';
        while (current) {
            string = current.element;
            current = current.next;
        }
        return string;
    };
    this.getHead = function(){
        return head;
    };
}
```

双向链表

