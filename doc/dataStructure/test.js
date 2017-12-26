/**
 *
 * @authors  Nealyang(nealyang231@gmail.com)
 * @date    2017/12/26
 * @version 1.0.0
 */
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