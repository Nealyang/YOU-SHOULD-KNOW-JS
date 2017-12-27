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

```javascript
function DoublyLinkedList() {
    var Node = function (element) {
        this.element = element;
        this.next = null;
        this.prev = null;
    };
    var length = 0;
    var head = null;
    var tail = null;//保存列表最后一项的引用
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
            var node  = new Node(element),
                current = head,
                previous,
                index = 0;
            if(position  === 0){
                if(!head){
                    head = node;
                    tail = node;
                }else{
                    node.next = current;
                    current.prev = node;
                    head = node;
                }
            }else if(position === length){
                current = tail;
                current.next = node;
                node.prev = current;
                tail = node;
            }else{
                while (index++<position){
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;

                current.prev = node;
                node.prev = previous;
            }
            length+=1;
            return true;
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
                if(length === 1){
                    tail = null;
                }else{
                    head.prev = null;
                }
            }else if(position === length-1){
                current = tail;
                tail = current.prev;
                tail.next = null;
            }else {
                while (index++<position){
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
                current.next.prev = previous;
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

循环链表

略！ 

循环链表可以像链表一样只有单向引用，也可以像双向链表一样有双向引用。循环链表和链 表之间唯一的区别在于，最后一个元素指向下一个元素的指针(tail.next)不是引用null， 而是指向第一个元素(head)

