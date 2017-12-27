## JavaScript数据结构与算法--字典和散列表

### 字典

集合表示一组互不相同的元素(不重复的元素)。在字典中，存储的是[键，值] 对，其中键名是用来查询特定元素的。字典和集合很相似，集合以[值，值]的形式存储元素，字 典则是以[键，值]的形式来存储元素。字典也称作映射。

当我们Set内部使用对象去实现的时候，其实和字典也就非常的类似了。

### 代码演示
```javascript
function Dictionary() {
    var items = {};
    this.has = function (key) {
        return items.hasOwnProperty(key);
    };
    this.set = function (key,value) {
        if(this.has(key)) return false; //确保唯一性
        items[key] = value;
        return true
    };
    this.remove = function (key) {
        if(this.has(key)){
            delete items[key];
            return true;
        }else{
            return false
        }
    };
    function get(key) {
        return this.has(key) ? items[key] : undefined;
    }
    this.clear = function(){
        items = {};
    };
    this.size = function(){
        return Object.keys(items).length;
    };
    this.values = function(){
        var values = [];
        for (var k in items) {
            if (this.has(k)) {
                values.push(items[k]);
            }
        }
        return values;
    };
}
```

### 散列表

散列算法的作用是尽可能快地在数据结构中找到一个值。在之前的章节中，你已经知道如果 要在数据结构中获得一个值(使用get方法)，需要遍历整个数据结构来找到它。如果使用散列 函数，就知道值的具体位置，因此能够快速检索到该值。散列函数的作用是给定一个键值，然后 返回值在表中的地址。

#### 代码演示

```javascript
function HashTable() {
    var table = [];
    var loseloseHashCode = function (key) {
        var hash = 0;
        for(var i = 0,length = key.lenght;i<length;i++){
            hash += key.charCodeAt(i);
        }
        return hash % 37;
    };
    this.put = function (key,value) {
        var position = loseloseHashCode(key);
        console.log(position + ' - ' + key);
        table[position] = value;
    };
    this.get = function (key) {
        return table[loseloseHashCode(key)];
    };
    this.remove = function(key) {
        table[loseloseHashCode(key)] = undefined;
    };
}
```

其中lose lose散列函数并不能做到出来唯一值，所以我们可能会遇到几个ASCII后想等的情况，这样就会导致散列冲突

解决散列冲突有三种方法，分离链接，显性探查，双散列。这里我们看下分离链接和显性探索两种方法

#### 分离链接
分离链接法包括为散列表的每一个位置创建一个链表并将元素存储在里面。它是解决冲突的
最简单的方法，但是它在HashTable实例之外还需要额外的存储空间。

为了实现一个使用了分离链接的HashTable实例，我们需要一个新的辅助类来表示将要加入 LinkedList实例的元素。我们管它叫ValuePair类

```javascript
 var ValuePair = function(key, value){
        this.key = key;
        this.value = value;
        this.toString = function() {
        return '[' + this.key + ' - ' + this.value + ']';
} };
```
接下来，我们重写一些方法

```javascript
this.put = function(key, value){
    var position = loseloseHashCode(key);
    if (table[position] == undefined) { 
        table[position] = new LinkedList();
}
    table[position].append(new ValuePair(key, value)); 
};

 this.get = function(key) {
        var position = loseloseHashCode(key);
        if (table[position] !== undefined){ 
            //遍历链表来寻找键/值
            var current = table[position].getHead(); 
            while(current.next){  
                if (current.element.key === key){ 
                    return current.element.value; 
                }
                
                current = current.next; 
            //检查元素在链表第一个或最后一个节点的情况
                if (current.element.key === key){ 
                    return current.element.value;
                }
            }
            return undefined; //{10}
        };
        
 this.remove = function(key){
         var position = loseloseHashCode(key);
         if (table[position] !== undefined){
             var current = table[position].getHead();
             while(current.next){
                 if (current.element.key === key){ 
                     table[position].remove(current.element); 
                     if (table[position].isEmpty()){ 
                         table[position] = undefined; 
                     }
                     return true; 
                 }
                 current = current.next;
             }
             // 检查是否为第一个或最后一个元素
             if (current.element.key === key){ 
                 table[position].remove(current.element);
                 if (table[position].isEmpty()){
                     table[position] = undefined;
                 }
                 return true;
             }
         }
         return false; //{17}
     };
```

#### 显性探索

另一种解决冲突的方法是线性探查。当想向表中某个位置加入一个新元素的时候，如果索引 为index的位置已经被占据了，就尝试index+1的位置。如果index+1的位置也被占据了，就尝试 index+2的位置，以此类推。

#### 代码演示

```javascript
    this.put = function(key, value){
        var position = loseloseHashCode(key);
        if (table[position] == undefined) {
            table[position] = new ValuePair(key, value);
        } else {
            var index = ++position;
            while (table[index] != undefined){
                index++;
            }
            table[index] = new ValuePair(key, value); 
        }
    };

    this.get = function(key) {
        var position = loseloseHashCode(key);
        if (table[position] !== undefined){ //{8}
            if (table[position].key === key) { //{9}
                return table[position].value; //{10}
            } else {
                var index = ++position;
                while (table[index] === undefined
                || table[index].key !== key){ //{11}
                    index++;
                }
                if (table[index].key === key) { //{12}
                    return table[index].value; //{13}
                }
            } }
        return undefined; //{14}
    };
```

### 彩蛋

我们实现的“lose lose”散列函数并不是一个表现良好的散列函数，因为它会产生太多的冲 突。如果我们使用这个函数的话，会产生各种各样的冲突。一个表现良好的散列函数是由几个方 面构成的:插入和检索元素的时间(即性能)，当然也包括较低的冲突可能性。我们可以在网上 找到一些不同的实现方法，或者也可以实现自己的散列函数。

```javascript
    var djb2HashCode = function (key) {
        var hash = 5381; //{1}
        for (var i = 0; i < key.length; i++) { //{2}
            hash = hash * 33 + key.charCodeAt(i); //{3}
        }
        return hash % 1013; //{4}
    };
```

这并不是最好的散列函数，但这是最被社区推荐的散列函数之一


