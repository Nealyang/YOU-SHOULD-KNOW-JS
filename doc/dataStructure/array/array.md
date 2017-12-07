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

| concat | 连接2个或更多数组，并返回结果 |
| every |对数组中的每一项运行给定函数，如果该函数对每一项都返回true，则返回true |
