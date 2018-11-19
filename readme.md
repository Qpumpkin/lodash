## 自己写的一些 lodash 函数。

为了 了解 -> 熟悉 原生 js

自己独立实现了 iteratee 高兴， lodash 中 实现类似函数重载功能的一个函数。

```js
lodash = {
  ...
  iteratee: function (value) {
    if (value instanceof Function) {
      return value;
    } else if (value instanceof Array) {

      return function(object) {
        let predicate;
        let end = value.length - 1;
        for(let i=0; i<end; i+=2) {//issue reason: I only add 1 in each loop, so it caused the key and value is not matched.
          predicate = this.matchesProperty(value[i],value[i+1]);
          if (!predicate(object)) {
            return false;
          }
        }
        return true;
      }.bind(this);

    } else if (value instanceof Object) {
      return object => this.isMatch(object,value);
    } else {
      return object => {
        if (value.includes('.')) {
          let values = value.split(".");
          for (let i=0; i<values.length; i++) {
            object = object[values[i]];
          }
          return object;
        } else {
          return object[value];
        }
      };
    }
  },
}
```
