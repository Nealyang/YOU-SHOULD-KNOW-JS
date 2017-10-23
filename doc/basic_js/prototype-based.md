# JavaScript面向对象编程（最全总结）

## 前言
对象(Object)应该算是js中最为重要的部分，也是js中非常难懂晦涩的一部分。更是面试以及框架设计中各出没。写这篇文章，主要参考与JavaScript红宝书（JavaScript高级程序设计）以及各大博主博客。

## 谈谈对象属性的特性

毕竟是面向对象编程，我们在讨论如何面向对象之前先讨论讨论对象具有哪些属性和特性。

### 属性类型

简单的说，对象拥有四个属性:
- [[Configurable]]:是否可以通过delete删除，能否修改属性的特性。直白点：是否可配置
- [[Enumerable]]:枚举性，表示是否可以通过for-in循环返回
- [[Writable]]:可写性：是否可以修改属性的值
- [[Value]]:包含属性的值，也就是对应的可读性。
以上四个对象的属性的属性类型默认值分别为：true,true,true,undefined。

如果要修改属性默认的特性，必须通过Object.defineProperty()方法。大致如下：

    var animal = {};
    Object.defineProperty(animal,"name",{
        writable:false,
        value: 'dog';
    });
    console.log(animal.name);//dog
    animal.name = 'cat';
    console.log(animal.name);//dog
    
从上面的实例大家也能看出，在调用Object.defineProperty()方法后，如果不指定 configurable、enumerable、writable 特性的值时，默认为FALSE。

### 访问器属性

访问器属性不包含数据值，但是包含getter和setter函数。在读取访问器属性时，会调用getter函数，这个函数负责返回有效值。在写入访问器属性时，回到用setter函数并传入新值。

- [[Configurable]]:表示是否可以通过delete删除。默认为TRUE
- [[Enumerable]]:同上面介绍的Enumerable一样，默认为true
- [[Get]]:读取数据时候调用的方法。默认为undefined
- [[Set]]:在写入属性值得时候默认调用的方法。默认为undefined

这里不做过多解释，直接看例子吧（来自js红宝书）

    var book = {
        _year:2012,
        edition:1
    };
    Object.defineProperty(book, 'year',{
        get:function(){
            return this._year
        },
        set:function(value){
            if(value>2012){
                this._year = value,
                this.edition++
            }
        }
    });
    
    book.year = 2013;
    console.log(book.edition);//2

其实对于多个属性的定义，我们可以使用Object.defineProperties方法。然后对于读取属性的特性我们可以使用Object.getOwnPropertyDescriptor()方法。大家自行查看哈。

## 创建对象
创建对象，我们不是直接可以通过Object的构造函数或者对象字面量的方法来实现对象的创建嘛？当然，这些方法是可以的，但是有一个明显的缺点：使用同一个接口创建很多对象，产生大量重复的代码。所以这里，我们使用如下的一些骚操作

### 工厂模式

一种很基础的设计模式，简而言之就是用函数来封装以特定接口创建对象的细节。

    function createAnimal(name,type){
        var o = new Object();
        o.name = name;
        o.type = type;
        o.sayName = function(){
            alert(this.name)
        }
        return o;
    }
    var cat = createAnimal('小猫','cat');
    var dog = createAnimal('小🐽','dog');
    
优点：可以无数次的调用这个函数，来创建相似对象。
缺点：不能解决对象识别的问题。也就是说，我不知道你是谁家的b孩子

### 构造函数模式

ECMAScript中的构造函数可以用来创建特定类型的对象。在运行时会自动出现在执行环境中（这句话后面讲解this的时候还是会说到）。

    function Animal(name,type){
        this.name = name;
        this.type = type;
        this.say = function(){
            alert(this.name);
        }
    }
    
    var cat = new Animal('小猫','cat');
    var dog = new Animal('小🐽','dog');
    
注意上面我们没有显示的return过一个对象出来，为什么？因为this（后面会讲this的）。

关于构造函数惯例首字母大写就不啰嗦了。强调构造函数一定要使用关键字new来调用。为什么使用new呢？因为你使用了new，他会

- 创建一个新的对象
- 将构造函数的作用域赋值给新对象（this执行新的对象）
- 执行构造函数的代码
- 返回新的对象

那么解决了工厂模式的诟病了么？当然~

在实例对象中，都有一个constructor属性。

    cat.constructor == Animal //true
    dog.constructor == Animal //true
    cat instanceof Animal //true
    dog instanceof Animal //true
    
构造函数模式的优点如上所说，但是缺点还是有的，比如说
```javascript
cat.sayName == dog.sayName //false
```
也就是说，他创建了两个功能一样的函数，这样是很没有必要的，当然，我们可以把sayName放到构造函数外面，然后通过this.sayName=sayName来操作，但是这样的话，又会导致全局变量的污染。肿么办？？？

### 原型模式

我们在创建每一个函数的时候都有一个prototype(原型)属性，这个属性是一个指针，指向一个对象。而这个对象的用途就是包含由特定类型的所有实例共享的属性和方法。

```javascript
function Animal() {}
Animal.prototype.name = '毛毛';
Animal.prototype.type = 'dog';
Animal.prototype.sayName = function() {
  alert(this.name);
}
var cat = new Animal();
var dog = new Animal();
alert(cat.sayName == dog.sayName)//true
```
原型模式的好处就是可以让所有的对象实例共享他的属性和方法。不必在构造函数中定义对象实例的信息。

```javascript
function Person() {}
Person.prototype.name = 'Nealyang';
Person.prototype.age = 24;
Person.prototype.sayName = function(){
  alert(this.name);
}
var neal = new Person();
console.log(neal.name)//'Nealyang' -> 来自原型
neal.name = 'Neal';
console.log(neal.name)// Neal -> 来自实例

delete neal.name;
console.log(neal.name)//'Nealyang' -> 来自原型
```
上面的例子说明两点
- 原型中的对象属性可以被实例所覆盖重写
- 通过delete可以删除实例中的属性，但是删除不了对象上的

> 我们可以通过hasOwnProperty()方法来确定一个属性是在原型上还是在实例上。person1.hasOwnProperty('name'),如果name为实例属性，则返回true。
我们也可以通过 'name' in person1 来确定，person1上是否有name这个属性。

上面大家可能已将发现，这种原型模式的写法非常的繁琐，有了大量的XXX.prototype. 这里有一种简写的形式。
参照具体说明参照[阮神的博客 面向对象第二篇](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)



