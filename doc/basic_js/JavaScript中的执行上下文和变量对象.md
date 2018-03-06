# JavaScript中的执行上下文和变量对象

> 最近在整理JavaScript中的一些基础知识，文章总结与各种书籍、博客。ps：汤姆大叔的深入系列非常好，非常推荐。真大神

## EC执行上下文

### 定义
每次当控制器转到ECMAScript可执行代码的时候，即会进入到一个执行上下文。执行上下文(简称-EC)是ECMA-262标准里的一个抽象概念，用于同可执行代码(executable code)概念进行区分。

标准规范没有从技术实现的角度定义EC的准确类型和结构，这应该是具体实现ECMAScript引擎时要考虑的问题。


活动的执行上下文组在逻辑上组成一个堆栈。堆栈底部永远都是全局上下文(global context)，而顶部就是当前(活动的)执行上下文。堆栈在EC类型进入和退出上下文的时候被修改（推入或弹出）。

JavaScript中，EC分为三种
- 全局级别的代码 –– 这个是默认的代码运行环境，一旦代码被载入，引擎最先进入的就是这个环境
- 函数级别的代码 ––当执行一个函数时，运行函数体中的代码。
- Eval的代码 –– 在Eval函数内运行的代码。

EC建立分为两个阶段：进入执行上下文（创建阶段）和执行阶段（激活/执行代码）

#### 进入上下文阶段
发生在函数调用时，但是在执行具体代码之前（比如，对函数参数进行具体化之前） 

创建作用域链（Scope Chain）

创建变量，函数和参数。

求”this“的值。

#### 执行代码阶段
变量赋值

函数引用

解释/执行其他代码。

我们可以将EC看做是一个对象。
```javascript
EC={
  VO:{/*变量对象， 函数中的arguments对象, 参数, 内部的变量以及函数声明 */},
  this:{},
  Scope:{ /* VO以及所有父执行上下文中的VO */}
}
```
![](../../img/20151118102648527.jpg)

### 全局代码
这种类型的代码是在"程序"级处理的：例如加载外部的js文件或者本地<script></script>标签内的代码。全局代码不包括任何function体内的代码。

在初始化（程序启动）阶段，ECStack是这样的：
```javascript
ECStack = [
  globalContext
];
```
### 函数代码
当进入funtion函数代码(所有类型的funtions)的时候，ECStack被压入新元素。需要注意的是，具体的函数代码不包括内部函数(inner functions)代码。如下所示，我们使函数自己调自己的方式递归一次：
```javascript
(function  foo(bar) {
  if (bar) {
    return;
  }
  foo(true);
})();
```
那么，ECStack以如下方式被改变：
```javascript
// 第一次foo的激活调用
ECStack = [
  <foo> functionContext
  globalContext
];
 
// foo的递归激活调用
ECStack = [
  <foo> functionContext – recursively
  <foo> functionContext
  globalContext
];
```
每次return的时候，都会退出当前执行上下文的，相应地ECStack就会弹出，栈指针会自动移动位置，这是一个典型的堆栈实现方式。一个抛出的异常如果没被截获的话也有可能从一个或多个执行上下文退出。相关代码执行完以后，ECStack只会包含全局上下文(global context)，一直到整个应用程序结束。
### Eval代码
直接看代码
```javascript
eval('var x = 10');
 
(function foo() {
  eval('var y = 20');
})();
 
alert(x); // 10
alert(y); // "y" 提示没有声明
```
ECStack的变化过程：
```javascript
ECStack = [
  globalContext
];
 
// eval('var x = 10');
ECStack.push(
  evalContext,
  callingContext: globalContext
);
 
// eval exited context
ECStack.pop();
 
// foo funciton call
ECStack.push(<foo> functionContext);
 
// eval('var y = 20');
ECStack.push(
  evalContext,
  callingContext: <foo> functionContext
);
 
// return from eval
ECStack.pop();
 
// return from foo
ECStack.pop();
```



