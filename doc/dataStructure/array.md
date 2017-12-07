# JavaScript数据结构与算法--数组
## 创建和初始化数组
```javascript
var daysOfWeek = new Array(); //{1}
var daysOfWeek = new Array(7); //{2}
var daysOfWeek = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'); //{3}
var daysOfWeek = [];
var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'];
```
因为数组这东西都用烂了，所以简单直接过例子。求斐波拉契数列前二十个数字
```javascript
var fibonacci = []; //{1}
    fibonacci[1] = 1; //{2}
    fibonacci[2] = 1; //{3}
    for(var i = 3; i < 20; i++){
        fibonacci[i] = fibonacci[i-1] + fibonacci[i-2]; ////{4}
}
    for(var i = 1; i<fibonacci.length; i++){ //{5}
        console.log(fibonacci[i]);           //{6}
}
```

## 添加和删除元素

```javascript
var numbers = [0,1,2,3,4,5,6,7,8,9];
// 添加元素
// 尾部添加
numbers[numbers.length] = 10;
numbers.push(11);
numbers.push(12, 13);
// 首部添加
numbers.unshift(-2);
numbers.unshift(-4, -3);
//对应的 你懂得
numbers.pop();
numbers.shift();

// 在数组的任意位置上添加和删除元素
// 使用splice方法，简单地通过指定位置/索引，就可以删除相应位置和数量的元素
numbers.splice(5,3);
// 把数字2、3、4插入数组里
numbers.splice(5,0,2,3,4);
// splice方法接收的第一个参数，表示想要删除或插入的元素的索引值。第二个参数是删除 元素的个数(这个例子里，我们的目的不是删除元素，所以传入0)。第三个参数往后，就是要添 加到数组里的值(元素2、3、4)。输出会发现值又变成了从3到12。
```

## 二维数组和多维数组
JavaScript只支持一维数组，并不支持矩阵。但是，我们可以像上面的代码一样，用数组套数 组，实现矩阵或任一多维数组

```javascript
function printMatrix(myMatrix) {
    for (var i=0; i<myMatrix.length; i++){
        for (var j=0; j<myMatrix[i].length; j++){
            console.log(myMatrix[i][j]);
        } 
    }
}
```

以此类推，也可以用这种方式来处理多维数组。假如我们要创建一个3×3的矩阵，每一格里 包含矩阵的i(行)、j(列)及z(深度)之和:
```javascript
var matrix3x3x3 = [];
    for (var i=0; i<3; i++){
        matrix3x3x3[i] = [];
        for (var j=0; j<3; j++){ 
            matrix3x3x3[i][j] = [];
            for (var z=0; z<3; z++){
                matrix3x3x3[i][j][z] = i+j+z;
          } 
        }
    }
```
所以如上我们可以看出，JavaScript数组没有维数限制，我们随意就好。

## JavaScript数组方法参考
| 方法   | 解释 |
| :----|:----|
| concat | 连接2个或更多数组，并返回结果 |
| every |对数组中的每一项运行给定函数，如果该函数对每一项都返回true，则返回true |
| filter|对数组中的每一项运行给定函数，返回该函数会返回true的项组成的数组|
|forEach|对数组中的每一项运行给定函数。这个方法没有返回值|
|join|将所有的数组元素连接成一个字符串|
|indexOf|返回第一个与给定参数相等的数组元素的索引，没有找到则返回-1|
|lastIndexOf|返回在数组中搜索到的与给定参数相等的元素的索引里最大的值|
|map|对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组|
|reverse|颠倒数组中元素的顺序，原先第一个元素现在变成最后一个，同样原先的最后一个元素变成了现在 的第一个|
|slice|传入索引值，将数组里对应索引范围内的元素作为新数组返回|
|some|对数组的每一项运行指定函数，如果有真则为真
|sort|按照字母顺序对数组进行排序，支持传入指定排序函数作为参数
toString|将数组作为字符串返回|
|valueOf|和toString类似，将数组作为字符串返回|

### 数组合并

```javascript
var zero = 0;
var positiveNumbers = [1,2,3];
var negativeNumbers = [-3,-2,-1];
var numbers = negativeNumbers.concat(zero, positiveNumbers)
```
concat方法可以向一个数组传递数组、对象或是元素。数组会按照该方法传入的参数顺序 连接指定数组。在这个例子里，zero将被合并到nagativeNumbers中，然后positiveNumbers 继续被合并。最后输出的结果是3、2、1、0、1、2、3。

### 迭代器函数
JavaScript内置了许多数组可用的迭代方法。对于本节的例子，我们需要数组和函数。假如有 一个数组，它值是从1到15，如果数组里的元素可以被2整除(偶数)，函数就返回true，否则返 回false

```javascript
var isEven = function(x) {
  return (x%2===0?true:false);
}
var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

numbers.every(isEven);//数组numbers的第一个元素是1，它不是2的倍数(1是奇数)，因此isEven 函 数返回false，然后every执行结束。
numbers.some(isEven);//numbers数组中第一个偶数是2(第二个元素)。第一个被迭代的元素是1,isEven会返回false。第二个被迭代的元素是2，isEven返回true——迭代结束。

// 如果要迭代整个数组，可以用forEach方法。它和使用for循环的结果相同:
numbers.forEach(function(x){
        console.log((x % 2 == 0));
});
var myMap = numbers.map(isEven);//[false, true, false, true, false, true, false, true, false, true, false, true, false, true, false]

var evenNumbers = numbers.filter(isEven);//[2, 4, 6, 8, 10, 12, 14]

numbers.reduce(function(previous, current, index){
        return previous + current;
});//120

```

### 搜索和排序
首先，我们想反序输出数组numbers(它本来的排序是1, 2, 3, 4,...15)。要实现这样的功能，
可以用reverse方法，然后数组内元素就会反序。
```javascript
numbers.reverse();
```
现在，输出numbers的话就会看到[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]。然后，我们用sort方法:
```javascript
numbers.sort();//[1, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9]
```
看起来不大对，是吧?这是因为sort方法在对数组做排序时，把元素默认成字符串进行相 互比较。
  我们可以传入自己写的比较函数，因为数组里都是数字，所以可以这样写:
  ```javascript
numbers.sort(function(a, b){
        return a-b;
});
```

对于一些自定义排序可以这么玩
```javascript
var friends = [
        {name: 'John', age: 30},
        {name: 'Ana', age: 20},
         {name: 'Chris', age: 25}];
 function comparePerson(a, b){
        if (a.age < b.age){
            return -1 
        }
        if (a.age > b.age){
             return 1
        }
            return 0; 
 }
 console.log(friends.sort(comparePerson));

```
## 结束语

数组这块比较简单，都是大家常用的东西，这里对于方法就不做过多演示了。


