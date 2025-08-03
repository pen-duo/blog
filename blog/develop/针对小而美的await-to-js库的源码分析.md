---
slug: await-to-js
title: 针对小而美的await-to-js库的源码分析
date: 2025-08-03
authors: default
tags: [开发技术, 编程, 前端, React]
keywords: [针对小而美的, await, to, js, 库的源码分析, 开发技术, 编程, 前端]
description: 本期给大家带来的是axios中的工具函数库,里面总共有30+个或用于判断类型,或用于处理字符串,或为了兼容性而进行了二次封装的工具函数。
image: https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80
---
## 前言
本期给大家带来的是axios中的工具函数库,里面总共有30+个或用于判断类型,或用于处理字符串,或为了兼容性而进行了二次封装的工具函数。

<!-- truncate -->


总体而言,阅读难度偏低,只要你有JavaScript基础,阅读起来绝对不费力。

同时阅读的收益可能会很高,因为里面大部分函数都是我们会在日常开发中用到的。

总而言之,性价比非常高。

阅读本文，你将学到：

```
1、javascript、nodejs调试技巧及调试工具；
2、如何学习调试axios源码；
3、如何学习优秀开源项目的代码，应用到自己的项目；
4、axios源码中实用的工具函数；
```

而你需要

```
1、javascript基础知识；
```

关注我不迷路: 

vx: codebangbang。 

掘金: 爱嘿嘿的小黑。

持续分享优质技术博客。

## 整体源码
如果你想自己阅读,可以直接点击我给你提供的连接,结合源码和我的分析可以更高效的完成源码的阅读哦！

[axios/utils](https://github.com/axios/axios/blob/master/lib/utils.js)

以下是我仓库中直接拷贝过来的源码,懒得同学可以直接看我的分析。
```
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
 
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};
```

## 源码分类
### 第一类: 类型判断
在上面的源码中几乎95%都是用于类型判断的,判断的类型包括Array,Undefined,Buffer,FormData,Object,PlainObject,ArrayBuffer,ArrayBufferView,String,Number,Date,File,Blob,Function,Stream,URLSearchParams,一共16种,这些类型有可能你并不全部认识(我就有些不认识).

不过你不用担心,因为作者对于这些类型的判断使用的技巧其实大部分就是JavaScript中的typef和Object.prototype.toString.call这两种。

我将这些用于判断类型的函数分为了三类,分别进行分析。

#### 1.针对基本数据类型用的类型判断
基本数据类型:undefined,null,string,number,boolean,bigInt,symbol.

axios/utils是这样处理的
```
function isUndefined(val) {
  return typeof val === 'undefined';
}

function isString(val) {
  return typeof val === 'string';
}

function isNumber(val) {
  return typeof val === 'number';
}
```

仓库中只对这三种基本数据类型进行了类型判断,但其实都是用的是同一套函数,用的都是typeof这个方法。

对于剩下的那几个基本数据类型的类型判断也都是一个套路。

**注意**: `typeof null === 'object'`,所以对null是不适用的,不过我们可以直接`val === null`来判断。


#### 2.针对大部分复杂数据类型的类型判断
复杂数据类型其实就是指object,所以除了上面那几个基本数据类型,其余的都是复杂数据类型。

axios/utils是这样处理复杂类型的
```
function isArrayBuffer(val) {
  return Objet.prototype.toString.call(val) === '[object ArrayBuffer]';
}

function isFormData(val) {
  return Objet.prototype.toString.call(val) === '[object FormData]';
}

function isPlainObject(val) {
  if (Objet.prototype.toString.call(val) !== '[object Object]') {
    return false;
  }
  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

function isDate(val) {
  return Objet.prototype.toString.call(val) === '[object Date]';
}
function isFile(val) {
  return Objet.prototype.toString.call(val) === '[object File]';
}

function isBlob(val) {
  return Objet.prototype.toString.call(val) === '[object Blob]';
}
function isFunction(val) {
  return Objet.prototype.toString.call(val) === '[object Function]';
}

function isURLSearchParams(val) {
  return Objet.prototype.toString.call(val) === '[object URLSearchParams]';
}

```

仓库中只对这8种复杂数据类型进行了类型判断,但其实都是用的是同一套函数,用的都是Objet.prototype.toString.call这个方法。

#### 3.针对一些比较特殊类型判断
前面一共讲了11个函数的类型判断,还有5个类型没有分析,分别是Object,Array,Buffer,ArrayBufferView,Stream

Object

```
function isObject(val) {
  return val !== null && typeof val === 'object'; // 只要排除null的影响,就可以用typeof来区分是否是对象了
}
```

Array
```
 function isArray(val) {
  return Array.isArray(val); // 用的是ES6新出的方法isArray
}
```

其实无论是Object还是Array我们都可以用`Object.prototype.toString.call`来判断。

我们可以重写一下这两个函数

```
function isObject(val) {
  return Objet.prototype.toString.call(val) === '[object Object]';
}

function isArray(val) {
  return Objet.prototype.toString.call(val) === '[object Array]';
}
```

效果是一样的哦。

而接下来的三个就不一样了。

Buffer
```

function isBuffer(val) {
  return val !== null // 判断不是 null
          && !isUndefined(val) // 判断不是 undefined
          && val.constructor !== null 判断 `val`存在构造函数，因为`Buffer`本身是一个类
          && !isUndefined(val.constructor 同上
          && typeof val.constructor.isBuffer === 'function' 最后通过自身的`isBuffer`方法判断
          && val.constructor.isBuffer(val);同上
}
```

这里简单介绍一下Buffer

什么是Buffer?

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 `Node.js`中，定义了一个`Buffer` 类，该类用来创建一个专门存放**二进制数据的缓存区**。详细可以看 [官方文档](https://link.juejin.cn?target=http%3A%2F%2Fnodejs.cn%2Fapi%2Fbuffer.html%23buffer "http://nodejs.cn/api/buffer.html#buffer") 或 [更通俗易懂的解释](https://link.juejin.cn?target=https%3A%2F%2Fwww.runoob.com%2Fnodejs%2Fnodejs-buffer.html "https://www.runoob.com/nodejs/nodejs-buffer.html")。

因为`axios`可以运行在浏览器和`node`环境中，所以内部会用到`nodejs`相关的知识。
ArrayBufferView

Stream
```
 function isStream(val) {
  return isObject(val) && isFunction(val.pipe); // isObjce和isFunction我们在上面都有提到哦
}
```
ArrayBufferView
```
 function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}
```

说实话，我不知道这个类型到底是干嘛,自己也比较懒,这个函数大家有兴趣自己了解一下哈。

### 第二类: 字符串处理
trim作用:去除字符串两边空格
```
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');// 要是有trim方法直接用否则用正则表达式处理
}
```
### 第三类: 二次封装(为了兼容性)
forEach: 将forEach和for..in...封装到一个函数中
```
function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') { // 如果传入的obj是空或undefined,啥也不返回
    return;
  }

  if (typeof obj !== 'object') {       // 如果传入的不是对象,返回包括调用者的数组
    obj = [obj];
  }

  if (isArray(obj)) {            // 如果传入的是数组, 和ES6的forEach逻辑相同
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {       // 如果传入的是数组, 和ES6的for...in..逻辑相同
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
```

## 封装一个typeFn函数
基于上面的种种分析,我们可以自己来封装一个type函数用于判断数据类型。
```
const typeFn = (val) => {

let typeListObj = {};

const typeList = ["Number","Boolean","String","Null","Undefined","Array","Function","Object","RegExp","Date","Error"]

typeList.map((item) => {
    return (typeListObj[`[object ${item}]`] = item.toLowerCase());
});

if (typeof val == "null") {
    return val + "";
}

if (typeof val !== "object") {
    return typeof val
}

return  typeListObj[Object.prototype.toString.call(val)] || "object" 

};

```

typeFn业务逻辑分析如下
- 首先将需要进行判断的所有复杂类型的字符串放入一个typeList数组中,并利用这个数组封装一个typeListObj对象,typeListObj对象的key为[object 大写数据类型], value为小写数据类型,最后这个typeListObj对象长这样
 ```
 {
    [object Number]: "number"
    [object Boolean]: "boolean",
    [object String]: "string",
    [object Null]: "null",
    [object Undefined]: "undefined",
    [object Array]: "array",
    [object Function]: "function",
    [object Object]: "object",
    [object RegExp]: "regexp",
    [object Date]: "date",
    [object Error]: "error"
}
```
- 对于传入的数据判断是否为空,如果是,直接返回"null"
- 如果不是,再判断是否是基本数据类型,是的话直接用typeof判断并返回
- 再然后就是复杂数据类型了,针对复杂数据类型用`Object.prototype.toString.call(val)`,将得到的结果再去我们前面的typeListObj对象中进行匹配,找出相应的数据类型,如果没找到,默认返回object


## 总结

在日后的类型判断中你可以记住一下几句话

-   基本数据类型判断用typeof，当然需要注意null这个异类

-   引用数据类型用Object.peototype.toString方法,当然用instanceof也不是也行,不过用不好容易出现错误,比如一个数组，它可以被 `instanceof` 判断为 Object.

-   最好的类型判断的方法是封装一个函数,基本数据类型用typeof判断,引用数据类型用Object.prototype.toString判断。

-   instanceof主要用于判断实例与构造函数的从属关系


