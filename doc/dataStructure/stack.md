# JavaScript数据结构与算法--栈

## 定义
栈是一种遵从先进后出LIFO原则的有序集合。新添加的或待删除的元素都保存在栈的 末尾，称作栈顶，另一端就叫栈底。在栈里，新元素都靠近栈顶，旧元素都接近栈底。

而栈主要是在编程语言的编译器里用来保存变量和方法调用等。

## 创建栈
```javascript
function Stack() {
  var _item = [];
  this.push = function(element) {
    this._item.push(element)
  };
  this.pop = function() {
    return _item.pop();
  };
  this.peek = function() {
    return _item[_item.length-1]
  };
  this.isEmpty = function() {
    return _item.length === 0;
  };
  this.size = function() {
    return _item.length;
  };
  this.clear = function() {
    _item = [];
  };
  this.print = function() {
    console.log(_item.toString())
  }
}
```

### 实际应用场景

进制转换

```javascript
function baseConverter(decNumber,base) {
  var remStack = new Stack(),
  rem,
  baseString = '',
  digits = '0123456789ABCDEF';
  
  while (decNumber>0){
      rem = Math.floor(decNumber % base);
      remStack.push(rem);
      decNumber = Math.floor(decNumber/base);
  }
  while(!remStack.isEmpty()){
      baseString+=digits[remStack.pop()];
  }
  return baseString;
}
```