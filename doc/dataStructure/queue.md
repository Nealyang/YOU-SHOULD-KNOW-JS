# JavaScript数据结构与算法--队列

## 定义
队列是遵循FIFO原则的有序的项。队列在尾部添加新元素，并在顶部移除元素。最新添加的元素必须排列在队列的尾部

## 代码实现

普通队列
```javascript
function Queue() {
  var items = [];
  this.enqueue = function(element) {
    items.push(element)
  };
  this.dequeue = function() {
    return items.shift()
  };
  this.front = function() {
    return items[0]
  };
  this.isEmpty  =function() {
    return items.length === 0
  };
  this.clear = function() {
    items = [];
  };
  this.size = function() {
    return items.length;
  };
  this.print = function() {
    console.log(items.toString())
  }
}
```
优先队列
```javascript
function PriorityQueue() {
    var items = [];
    function QueueElement (element, priority){
        this.element = element;
        this.priority = priority;
    };
    this.enqueue = function(element, priority){
        var queueElement = new QueueElement(element, priority);
        if (this.isEmpty()){
            items.push(queueElement); // {2}
        } else {
            var added = false;
            for (var i=0; i<items.length; i++){
                if (queueElement.priority <
                    items[i].priority){
                    items.splice(i,0,queueElement); // {3}
                    added = true;
                    break; // {4}
                } }
            if (!added){ //{5}
                items.push(queueElement);
            }
        }
    };
    //其他方法与普通队列相同
}
```

循环队列
```javascript
function hotPotato (nameList, num){
    var queue = new Queue(); // {1}
    for (var i=0; i<nameList.length; i++){
        queue.enqueue(nameList[i]); // {2}
    }
    var eliminated = '';
    while (queue.size() > 1){
        for (var i=0; i<num; i++){
            queue.enqueue(queue.dequeue()); // {3}
        }
        console.log(queue.print())
        eliminated = queue.dequeue();// {4} 
        console.log(eliminated + '在击鼓传花游戏中被淘汰。');
    }
    return queue.dequeue();// {5}
}
var names = ['John','Jack','Camila','Ingrid','Carl']; 
var winner = hotPotato(names, 7);
console.log('胜利者:' + winner);
```