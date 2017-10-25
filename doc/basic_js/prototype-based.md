# JavaScript面向对象编程（最全总结）

## 前言
对象(Object)应该算是js中最为重要的部分，也是js中非常难懂晦涩的一部分。更是面试以及框架设计中各出没。写这篇文章，主要参考与JavaScript红宝书（JavaScript高级程序设计 第六章章节）以及各大博主博客。

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

```javascript
function Person(){}
Person.prototype = {
    constructor:Person,
    name:"Neal",
    age:24,
    job:'Software Engineer',
    sayName:function(){
        alert(this.name);
    }
}
```
上面代码特意添加了一个constructor属性，因为每创建一个函数，就会自动创建他的prototype对象，这个对象会自动获取contractor属性。而我们这中写法，本质上重写了默认的prototype对象，因此，constructor属性也就变成新的对象的constructor属性了（指向Object构造函数），所以这里的简写方式，一定要加上constructor。

下面我们再谈一谈原型模式的优缺点。

优点，正如上面我们说到的，可以省略为构造函数传递出实话参数这个环节，并且很多实例可以共享属性和方法。正是因为原型中所有的属性是被所有的实例所共享的，这个特性在方法中非常实用，但是对于包含引用类型的属性来说问题就比较突出了。

    function Person(){};

    Person.prototype = {
        constructor:Person,
        name:"neal",
        friends:['xiaohong','xiaoming'],
        sayName:function(){
            alert(this.name);
        }
    }

    var person1 = new Person();
    var person2 = new Person();

    person1.friends.push('xiaohua');

    alert(person1.friends);//'xiaohong','xiaoming','xiaohua'
    alert(person2.friends);//'xiaohong','xiaoming','xiaohua'
    alert(person1.friends == person2.friends)//true

由于friends数组存在于Person.prototype上，并不是person1上面，所以当我们修改的时候，其实修改的是所有实例所共享的那个值。

### 组合使用构造函数和原型模式
这是创建自定义类型最常见的一种方式。就是组合使用构造函数和原型模式.构造函数模式用于定义实力属性，原型模式用于定义方法和共享的属性。

    function Person(name,age){
        this.name = name,
        this.age = age
    }

    Person.prototype = {
        constructor:Person,
        sayName:function(){
            alert(this.name);
        }
    }

    var person1 = new Person('Neal',24);
    var person2 = new Person('Yang',23);
    ...

上面的例子中，实例所有的属性都是在构造函数中定义，而实例所有共享的属性和方法都是在原型中定义。这种构造函数和原型模式混合的模式，是目前ECMAScript中使用最为广泛的一种方法。

当然，有些人会觉得独立的构造函数和原型非常的难受，所以也有推出所谓的动态原型构造模式的这么一说。

    function Person(name,age){
        this.name = name,
        this.age = age,
        if(typeof this.sayName != 'function'){
            Person.prototype.sayName = function(){
                console.log(this.name)
            }
        }
    }
    ...

注意上面的代码，之后在sayName不存在的时候，才会在原型上给他添加相应的方法。因为对原型的修改，能够立即在所有的实例中得到反应。所以这中做法确实也是非常的完美。

关于javaScript高程中说到的别的寄生构造函数模式和稳妥构造函数模式大家可以自行查看哈～这里就不做过多介绍了。

## 继承

说到面向对象，当然得说到继承。说到继承当然得说到原型。说到原型，这里我们摘自[网上一篇博客里的段落](https://www.ibm.com/developerworks/cn/web/1304_zengyz_jsoo)

> 为了说明javascript是一门面向对象的语言，首先有必要从面相对象的概念入手1、一切事物皆对象。2、对象具有封装和继承特性。3、对象与对象之间使用消息通信，各自存在信息隐秘 。
javascript语言是通过一种叫做原型(prototype) 的方式来实现面向对象编程的。当然，还有比如java就是基于类来实现面向对象编程的。

### 基于类的面向对象和基于原型的面向对象方式比价

对于基于类的面向对象的方式中，对象依靠class类来产生。而在基于原型的面向对象方式中，对象则是依靠构造器(constructor)利用原型(prototype)构造出来的。举个客观世界的例子来说，例如工厂造一辆汽车一方面，工人必须参照一张工程图纸，设计规定这辆车如何制造，这里的工程图纸就好比语言中的类class。而车就是按照这个类制造出来的。另一方面，工人和机器相当于contractor，利用各种零部件(prototype)将汽车造出来。

当然，对于上面的例子两种思维各种说法。当然，笔者更加倾向于基于原型的面向对象编程，毕竟我是前端出生（咳咳，真相了），正当理由如下：

首先，客观世界中的对象的产生都是其他实物对象构造的世界，而抽象的图纸是不能产生出汽车的。也就是说，类，是一个抽象概念的而非实体，而对象的产生是一个实体的产生。其次，按照一切事物皆对象的这饿极本的面向对象的法则来说，类本身并不是一个对象，然而原型方式的构造函数和原型本身也是个对象。再次，在类的面向对象语言中，对象的状态又对象的实例所持有，对象的行为方法则由申明该对象的类所持有，并且只有对象的构造和方法能够被继承。而在原型的面向对象语言中，对象的行为、状态都属于对象本身，并且能够一起被继承。

### 原型链

ECMAScript描述了原型链的概念，并将原型链作为实现继承的主要方法。基本思想就是利用原型让一个引用类型继承另一个引用类型的属性和方法。

实现原型链有一种基本模式：

    function SuperType(){
        this.property = true;
    }

    SuperType.prototype.getSuperValue = function(){
        return this.property;
    }

    function SubType (){
        this.subproperty = false;
    }

    SubType.prototype = new SuperType();

    SubType.prototype.getSubValue = function(){
        return this.subproperty;
    }

    var instance = new SubType();

    alert(instance.getSuperValue());

在上面的代码中，我们没有使用SubType默认提供的原型，而是给它换了一个新的原型，这个新原型就是SuperType的实例。于是，新原型不仅具有所谓一个SuperType的实例所拥有的全部属性和方法，而且其内部还有一个指针，指向SuperType的原型。最终结果是这样的：instance指向subtype的原型，subtype的原型又指向SuperType的原型。

通过实现原型链，本质上是扩展了原型搜索机制。

虽然如上，我们已经实现了javascript中的继承。但是依旧存在一些问题：最主要的问题来自包含引用类型的原型。第二个问题就是在创建子类型的实例时，不能向超类型的构造函数中传递参数。这两个问题上面也都有说到，这里就不做过多介绍，直接看解决办法！

### 借用构造函数
在解决原型中包含引用类型的数据时，我们可以在子类型构造函数内部调用超类型的构造函数。直接看代码：

    function SuperType(name){
        this.colors = ['red','yellow'];
        this.name = name;
    }

    function SubType(name){
        //继承了Super
        SuperType.call(this,name)
    }

    var instance1 = new SubType('Neal');
    alert(instance1.name)
    instance1.colors.push('black');
    alert(instance1.colors);//'red','yellow','black'

    var instance2 = new SubType('yang');
    alert(instance2.colors);//'red','yellow'


毕竟函数只不过是在特定环境中执行代码的对象，因此可以通过call活着apply方法在新创建的对象上执行构造函数。而且如上代码也解决了子类构造函数中向超类构造函数传递参数的问题

但是，这样问题就来了，类似我们之前讨论创建的对象那种构造函数的问题：如果都是使用构造函数，那么，也就避免不了方法都在构造函数中定义，然后就会产生大量重复的代码了。

### 组合继承

因为考虑到上述的缺点，所以这里又使用了组合继承的方式，历史总是惊人的相似。直接看代码：

    function SuperType(name){
        this.name = name;
        this.colors = ['red','yellow'];
    }

    SuperType.prototype.sayName = function(){
        alert(this.name);
    }

    function SubType(name,age){
        //继承属性
        SuperType.call(this,name);

        this.age = age;
    }

    //继承方法
    SubType.prototype = new SuperType();
    SubType.prototype.constructor = SubType;
    SubType.prototype.sayAge = function(){
        alert(this.age);
    }

    var instance1 = new SubType('Nealyang',24);
    instance1.colors.push('white');
    instance1.sayName();//Nealyang
    instance1.sayAge();// 24

    var instance2 = new SubType('Neal',21);
    alert(instance2.colors);//'red','yellow'
    instance2.sayName();//Neal
    instance2.sayAge();//21

在上面的例子中，SuperType构造函数定义了两个属性，name和colors，SuperType的原型中定义了一个方法sayName，subtype的构造函数中调用SuperType构造函数并且传入name，然后将SuperType的实例赋值给subtype的原型。然后又在新的原型中定义了sayAge的方法。这样一来，就可以让两个不同的SubType实例既分别拥有自己的属性，包括colors，又可以使用相同的方法了。

组合继承避免了原型链和借用构造函数的缺陷，融合了他们的优点。成为javascript中最为常见的继承模式。而且instanceof和isPrototypeOf方法也能用于识别组合模式创建的对象。

### 别的继承模式

继承模式是有很多，上面只是说到我们经常使用到的继承模式。包括还有原型式继承、寄生式继承、寄生组合式继承等，其实，只要理解了原型、原型链、构造函数等对象的基本概念，理解起来这中模式都是非常容易的。后续如果有时间，再给大家总结吧～













































































