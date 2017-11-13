# this 其实很简单

> 此文主要总结于《你不知道的JavaScript 上卷》，虽然讲解this的文章已经烂大街了，但是依旧希望，这篇文章可以帮助到那些还是对this有些疑惑的哥们

## 前言
this关键字是JavaScript中最复杂的机制之一，它不是一个特殊的关键字，被自动定义在所有的函数作用域中。

老规矩，我们直接看例子：
```javascript
function identify(){
    console.log(this.name)
    return this.name.toUpperCase();
}

function speak() {
  var gretting = 'Hello I am '+identify.call(this)
  console.log(gretting);
}

var me = {
    name:'Neal'
}

var you = {
    name:'Nealyang'
}
identify.call(me);
identify.call(you);

speak.call(me);
speak.call(you);
```
关于运行结果大家可以自行运行查看，如果对于this是如何工作的这里我们还是存在疑惑，那么别急，我们后面当然会继续深入探讨下，这里，先说下关于this
的一些误解的地方

## 关于this的误解
### this 值得是它自己
通常新手都会认为this就是指向函数本身，至于为什么在函数中引用他自己呢，可能就是因为递归这种情况的存在吧。但是这里，我想说，this并不是指向函数本身的
```javascript
function foo(num) {
  console.log("foo:"+num);
  this.count++;
}

foo.count = 0;

for(var i = 0;i<10;i++){
    foo(i);
}

console.log(foo.count);
```
通过运行上面的代码我们可以看到，foo函数的确是被调用了十次，但是this.count似乎并没有加到foo.count上。也就是说，函数中的this.count并不是foo.count。

所以，这里我们一定要记住一个，就是函数中的this并不是指向函数本身的。上面的代码修改如下：

```javascript
function foo(num) {
  console.log("foo:"+num);
  this.count++;
}

foo.count = 0;

for(var i = 0;i<10;i++){
    foo.call(foo,i);
}

console.log(foo.count);
```
运行如上代码，此时我们就可以看到foo函数中的count的确已经变成10了

### this值得是他的作用域
另一种对this的误解是它不知怎么的指向函数的作用域，其实从某种意义上来说他是正确的，但是从另一种意义上来说，这的确是一种误解。

明确的说，this不会以任何方式指向函数的词法作用域，作用域好像是一个将所有可用标识符作为属性的对象，这从内部来说他是对的，但是JavaScript代码不能访问这个作用域“对象”，因为它是引擎内部的实现。

```javascript
function foo() {
	var a = 2;
	this.bar();
}

function bar() {
	console.log( this.a );
}

foo(); //undefined
```
上面的代码不止一处错误，这里不做讨论，仅仅用于看代码，首先，视图this.bar()来视图访问bar函数，的确他做到了。虽然只是碰巧而已。然而，写下这段代码的开发者视图使用this在foo和bar的词法作用域中建立一座桥，是的bar可以访问foo内部变量作用域a。当然，这是不可能的，不可能使用this引用在词法作用域中查找东西。

## 什么是this
所以说了这么coder对this的误解，那么究竟什么是this呢。记住，this不是在编写时候绑定的，而是在运行时候绑定的上下文执行环境。this绑定和函数申明无关，反而和函数被调用的方式有关系。

当一个函数被调用的时候，会建立一个活动记录，也成为执行环境。这个记录包含函数是从何处（call-stack）被调用的，函数是 如何 被调用的，被传递了什么参数等信息。这个记录的属性之一，就是在函数执行期间将被使用的this引用。

## 彻底明白this到底值得什么鬼

### 调用点
为了彻底弄明白this的指向问题，我们还必须明白什么是调用点，即一个函数被调用的位置。考虑调用栈（即使我们到达当前执行位置而被d调用的所有方法堆栈）是非常重要的，我们关心的调用点就是当前执行函数的之前的调用

```javascript
function baz() {
    // 调用栈是: `baz`
    // 我们的调用点是global scope（全局作用域）

    console.log( "baz" );
    bar(); // <-- `bar`的调用点
}

function bar() {
    // 调用栈是: `baz` -> `bar`
    // 我们的调用点位于`baz`

    console.log( "bar" );
    foo(); // <-- `foo`的call-site
}

function foo() {
    // 调用栈是: `baz` -> `bar` -> `foo`
    // 我们的调用点位于`bar`

    console.log( "foo" );
}

baz(); // <-- `baz`的调用点
```
上面代码大家简单感受下什么是调用栈和调用点，比较简单的东西。

### 来点规则，有规可寻
我们必须考察调用点，来判断下面即将要说的四中规则哪一种适用。先独立解释下四中规则的每一种，然后再来说明下如果多种规则适用调用点时他们的优先级。

#### 默认绑定
所谓的默认绑定，就是独立函数的调用形式。

```javascript
function foo() {
	console.log( this.a );
}

var a = 2;

foo(); // 2
```
为什么会是2呢，因为在调用foo的时候，JavaScript对this实施了默认绑定，所以this就指向了全局对象。

我们怎么知道这里适用 默认绑定 ？我们考察调用点来看看foo()是如何被调用的。在我们的代码段中，foo()是被一个直白的，毫无修饰的函数引用调用的。没有其他的我们将要展示的规则适用于这里，所以 默认绑定 在这里适用。

需要注意的是，对于严格模式来说，默认绑定全局对象是不合法的，this被置为undefined。但是一个很微妙的事情是，即便是所有的this绑定规则都是基于调用点的，如果foo的内容没有严格模式下，默认绑定也是合法的。

#### 隐含绑定
调用点是否有一个环境对象，也成为拥有者和容器对象。
```javascript
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

obj.foo(); // 2
```
foo被申明，然后被obj添加到其属性上，无论foo()是否一开始就在obj上被声明，还是后来作为引用添加（如上面代码所示），都是这个 函数 被obj所“拥有”或“包含”。

这里需要注意的是，只有对象属性引用链的最后一层才影响调用点

```javascript
function foo() {
	console.log( this.a );
}

var obj2 = {
	a: 42,
	foo: foo
};

var obj1 = {
	a: 2,
	obj2: obj2
};

obj1.obj2.foo(); // 42
```
##### 隐含绑定丢死
this绑定最让人头疼的地方就是隐含绑定丢失了他的绑定，其实明确了调用位置，这个也不是难点。直接看代码
```javascript
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

var bar = obj.foo; // 函数引用！

var a = "oops, global"; // `a`也是一个全局对象的属性

bar(); // "oops, global"
```
所以如上的调用模式，我们又退回到了默认绑定模式。

还能hold住，那么接着看代码：
```javascript
function foo() {
	console.log( this.a );
}

function doFoo(fn) {
	// `fn` 只不过`foo`的另一个引用

	fn(); // <-- 调用点!
}

var obj = {
	a: 2,
	foo: foo
};

var a = "oops, global"; // `a`也是一个全局对象的属性

doFoo( obj.foo ); // "oops, global"
```
参数传递，仅仅是一种隐含的赋值，而且因为我们是传递一个函数，他是一个隐含的引用赋值，所以最终结果和我们前一段代码一样。

所以，在回调函数中丢失this绑定是一件很常见的事情，但是还有另一种情况，接受我们回调的函数故意改变this的值。那些很受欢迎的事件处理JavaScript包就十分喜欢强制你的回调的this指向触发事件的DOM元素。

不管哪一种意外改变this的方式，你都不能真正地控制你的回调函数引用将如何被执行，所以你（还）没有办法控制调用点给你一个故意的绑定。我们很快就会看到一个方法，通过 固定 this来解决这个问题。

***如上，我们一定要清除的是引用和调用。记住，找this，我们只看调用，别被引用所迷惑***

#### 明确绑定

在JavaScript中，我们可以强制制定一个函数在运行时候的this值。是的，call和apply，他们的作用就是扩充函数赖以生存的作用域。

```javascript
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2
};

foo.call( obj ); // 2
```
上面代码，我们使用foo，强制将foo的this指定为obj

如果你传递一个简单原始类型值（string，boolean，或 number类型）作为this绑定，那么这个原始类型值会被包装在它的对象类型中（分别是new String(..)，new Boolean(..)，或new Number(..)）。这通常称为“boxing（封箱）”。

但是，单独的依靠明确绑定仍然不能为我们先前提到的问题，提供很好的解决方案，也就是函数丢失自己原本的this绑定。

##### 硬性绑定
```javascript
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2
};

var bar = function() {
	foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// `bar`将`foo`的`this`硬绑定到`obj`
// 所以它不可以被覆盖
bar.call( window ); // 2
```
我们创建了一个函数bar()，在它的内部手动调用foo.call(obj)，由此强制this绑定到obj并调用foo。无论你过后怎样调用函数bar，它总是手动使用obj调用foo。这种绑定即明确又坚定，所以我们称之为 硬绑定（hard binding）

#### new 绑定

这个比较简单，当函数前面加入new关键字调用的时候，其实就是当做构造函数调用的。其内部其实完成了如下事情：
- 一个新的对象会被创建
- 这个新创建的对象会被接入原型链
- 这个新创建的对象会被设置为函数调用的this绑定                                                                                                                                                                                                          
- 除非函数返回一个他自己的其他对象，这个被new调用的函数将自动返回一个新创建的对象

### 总结性来一波
- 函数是否在new中调用，如果是的话this绑定的是新创建的对象
```javascript
var bar = new Foo();
```
- 函数是否通过call、apply或者其他硬性调用，如果是的话，this绑定的是指定的对象
```javascript
var bar = foo.call(obj);
```
- 函数是否在某一个上下文对象中调用,如果是的话，this绑定的是那个上下文对象
```javascript
var bar = obj.foo();
```
- 如果都不是的话，使用默认绑定，如果在严格模式下，就绑定到undefined，注意这里是方法里面的严格声明。否则绑定到全局对象
```javascript
var bar = foo();
```

## 绑定例外
第一种情况就是将null和undefined传给call、apply、bind等函数，然后此时this采用的绑定规则是默认绑定

第二种情况这里举个例子，也是面试中常常会出现的例子
```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
var o = {
    a:3,
    foo:foo
}
var p = {a:4};
(p.foo = o.foo)();
```
如上调用，其实foo采用的也是默认绑定，这里我们需要知道的是，p.foo = o.foo的返回值是目标函数的引用，所以最后一句其实就是foo()

### es6中的箭头函数

es6中的箭头函数比较简单，由于箭头函数并不是function关键字定义的，所以箭头函数不适用this的这四中规则，而是根据外层函数或者全局作用域来决定this
```javascript
function foo() {
  // 返回一个arrow function
	return (a) => {
    // 这里的`this`是词法上从`foo()`采用
		console.log( this.a );
	};
}

var obj1 = {
	a: 2
};

var obj2 = {
	a: 3
};

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2, 不是3!
```
这里foo内部创建的箭头函数会自动获取foo的this。

### 来一道经典面试题吧
- 第一题
```javascript
var a=10;
var foo={
  a:20,
  bar:function(){
      var a=30;
      console.log(this)
      return this.a;
    }
};
foo.bar()
(foo.bar)()
(foo.bar=foo.bar)()
(foo.bar,foo.bar)()
```
- 第二题
```javascript
function t(){
this.x=2;
}
t();
console.log(window.x);
```

- 第三题
```javascript
var obj = {
x: 1,
y: 2,
t: function() {
console.log(this.x)
}
}
obj.t();

var dog={x:11};
dog.t=obj.t;
dog.t();


show=function(){
console.log('show'+this.x);

}

dog.t=show;
dog.t();
```
- 第四题
```javascript
name = 'this is window';
var obj1 = {
name: 'php',
t: function() {
console.log(this.name)
}
};
var dog1 = {
name: 'huzi'
};

obj1.t();

dog1.t = obj1.t;

var tmp = dog1.t;
tmp(); //this本来指向window

(dog1.t = obj1.t)();
dog1.t.call(obj1);
```
- 第五题

```javascript
var number=2;
var obj={
number:4,
/*匿名函数自调*/
fn1:(function(){
var number;
this.number*=2;//4

number=number*2;//NaN
number=3;
return function(){
var num=this.number;
this.number*=2;//6
console.log(num);
number*=3;//9
alert(number);
}
})(),

db2:function(){
this.number*=2;
}
}

var fn1=obj.fn1;

alert(number);

fn1();

obj.fn1();

alert(window.number);

alert(obj.number);
```

## 交流

***扫码关注我的个人微信公众号，分享更多原创文章。点击交流学习加我微信、qq群。一起学习，一起进步。共同交流上面的题目吧***

![wx](../../img/pay/wx.jpg)

---

欢迎兄弟们加入：

Node.js技术交流群：209530601 

React技术栈：398240621

前端技术杂谈：604953717 (新建)

---