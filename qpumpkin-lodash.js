var qpumpkin = {
  chunk: function (array,size=1) {
    let subSize = 0;
    let subArr = [];
    let out = [];
    size = ensureNum(size,1);
    for (let i=0; i<array.length; i++) {
      subArr.push(array[i]);
      subSize += 1;
      if (subSize === size) {
        out.push(subArr);
        subArr = [];
        subSize = 0;
      }
    }
    subSize>0 && out.push(subArr);

    return out;
  },
  compact: function (array) {
    let out = [];
    for (let i=0; i<array.length; i++) {
      array[i] && out.push(array[i]);
    }
    return out;
  },
  concat: function (...arg) {
    return this.flatten(arg);
  },
  difference: function (array,...values) {
    values = this.flatten(values);
    let map = createMap(values);

    let out = array.filter(
      element => !map.has(element)
    );
    return out;
  },
  differenceBy: function (array,...other) {
    let argLen = arguments.length;
    if (arguments[argLen-1] instanceof Array) {
      return this.difference(array,...other);
    } else {
      let predicate = this.iteratee(other.pop());
      other = this.flatten(other);
      let map = createMap(other,predicate);
      let out = array.filter(
        function (element) {
          let criterion = predicate(element);
          return !map.has(criterion);
        }
      );
  
      return out;
    }
  },
  differenceWith: function (arr,otArr,comp) {
    let [ref] = otArr;
    let out = arr.filter(
      element => !comp(element,ref)
    );

    return out;
  },
  drop: function (array,n=1) {
    if (array.length === 0) {
      return [];
    } else {
      n = ensureNum(n,1);
      let out = [];
      for (let i=n; i<array.length; i++) {
        out.push(array[i]);
      }
      
      return out;
    }
  },
  dropRight: function (array,n=1) {
    if (array.length === 0) {
      return [];
    } else {
      n = ensureNum(n,1);
      let len = array.length;
      if (n >= len) {
        return [];
      } else {
        let outL = len - n;
        let out = sliceArray(array,0,outL);
  
        return out;
      }
    }
  },
  dropRightWhile: function (array,predicate) {
    predicate = this.iteratee(predicate);

    let outLen;
    for (let i=array.length-1; i>=0; i--) {
      if (!predicate(array[i])) {
        outLen = i+1;
        break;
      }
    }
    let out = sliceArray(array,0,outLen);

    return out;
  },
  dropWhile: function (array,predicate) {
    predicate = this.iteratee(predicate);
    let dropLen = 0;
    for (let i=0; i<array.length; i++) {
      if (predicate(array[i])) {
        dropLen += 1;
      } else {
        break;
      }
    }
    let out = sliceArray(array,dropLen);

    return out;
  },
  fill: function (array,value,start=0,end=array.length) {
    let len = array.length;
    start = ensureNum(start,0,len);
    end = ensureNum(end,len,len);
    for (let i=start; i<end; i++) {
      array[i] = value;
    }
    return array;
  },
  findIndex: function (array,predicate,fromIndex=0) {
    if (!(array&&array.length>0)) {
      return -1;
    } else {
      predicate = this.iteratee(predicate);
      fromIndex = ensureNum(fromIndex,0,array.length);
      for (let i=fromIndex; i<array.length; i++) {
        if (predicate(array[i])) {
          return i;
        }
      }
  
      return -1;
    }
  },
  findLastIndex: function (array,predicate,fromIndex=array.length-1) {
    if (!(array&&array.length>0)) {
      return -1;
    } else {
      predicate = this.iteratee(predicate);
      fromIndex = ensureNum(fromIndex,array.length-1,array.length);
      for (let i = fromIndex; i >= 0; i--) {
        if (predicate(array[i])) {
          return i;
        }
      }
  
      return -1;
    }
  },
  head: function (array) {
    return array[0];
  },
  flatten: function (array) {
    return this.flattenDepth(array,1);
  },
  flattenDeep: function (array) {
    return this.flattenDepth(array,Infinity);
  },
  flattenDepth: function (array,depth=1) {
    if (depth == 0) {
      return array.slice();
    } else {
      let out = [];
      let temp;
      for (let i=0; i<array.length; i++) {
        if (array[i] instanceof Array) {
          temp = this.flattenDepth(array[i],depth-1);
          out.push(...temp);
        } else {
          out.push(array[i]);
        }
      }

      return out;
    }
  },
  fromPairs: function (pairs) {
    let objPairs = this.flatten(pairs);
    let out = {};
    for (let i=0; i<objPairs.length; i+=2) {
      out[objPairs[i]] = objPairs[i+1];
    }

    return out;
  },
  indexOf: function (array,value,fromIndex=0) {
    if (array.length === 0) {
      return -1;
    } else {
      fromIndex = ensureNum(fromIndex,0,array.length);
      for (let i=fromIndex; i<array.length; i++) {
        if (array[i] === value) {
          return i;
        }
      }
      return -1;
    }
  },
  initial: function (array) {
    if (!array.length>1) {
      return [];
    } else {
      let outLen = array.length - 1;
      let out = sliceArray(array,0,outLen);
      return out;
    }

    let outLen = array.length - 1;
    let out = sliceArray(array, 0, outLen);
    return out;
  },
  intersection: function (array,...arrays) {
    arrays = this.flatten(arrays);
    let set = new Set();
    arrays.forEach(
      function (element) {
        set.has(element) || set.add(element);
      }
    );

    let out = array.filter(
      element => set.has(element)
    );

    return out
  },
  intersectionBy: function (array,...rest) {
    let predicate = this.iteratee(rest.pop());
    rest = this.flatten(rest);
    let map = createMap(rest,predicate);

    let out = array.filter(
      element => map.has(predicate(element))
    );

    return out;
  },
  intersectionWith: function (array,...rest) {
    let predicate = rest.pop();
    rest = this.flatten(rest);
    let out = array.filter(
      function (element) {
        for (item of rest) {
          if (predicate(element,item)) {
            return true;
          }
        }

        return false;
      }
    );

    return out;
  },
  join: function (array,separator=",") {
    if (!(array&&array.length>0)) {
      return "";
    } else {
      let out = array.reduce(
        function (result,element,index) {
          if (element===undefined && element===null) {
            element = "";
          } else {
            element = element.toString();
          }
          if (index == 0) {
            result += element;
          } else {
            result += (separator+element);
          }
          return result;
        },"");

      return out;
    }
  },
  last: function (array) {
    return array[array.length - 1];
  },
  lastIndexOf: function (array,value,fromIndex=array.length-1) {
    if (!(array&&array.length>0)) {
      return -1;
    } else {
      fromIndex = ensureNum(fromIndex);
      for(let i=fromIndex; i>=0; i--) {
        if (array[i] === value) {
          return i;
        }
      }

      return -1;
    }
  },
  nth: function (array,n=0) {
    if (n < 0) {
      return array[array.length + n];
    } else {
      return array[n];
    }
  },
  pull: function (array,...values) {
    if (array.length < 1) {
      return array;
    } else {
      let index = 0;
      let map = createMap(values);
      for (let i=0; i<array.length; i++) {
        let cur = array[i];
        if (!map.has(cur)) {
          array[index] = cur;
          index += 1;
        }
      }
      array.length = index;
      return array;
    }
  },
  pullAll: function (array,values) {
    return this.pull.apply(null,[array, ...values]);
  },
  pullAllBy: function (array,values,predicate) {
    predicate = this.iteratee(predicate);
    let map = createMap(values,predicate);
    let index = 0;
    for (let i=0; i<array.length; i++) {
      let cur = array[i];
      if (!map.has(predicate(cur))) {
        array[index] = cur;
        index += 1;
      }
    }
    array.length = index;
    return array;
  },
  pullAllWith: function (array,values,comparator) {
    let index = 0;
    for (let i=0; i<array.length; i++) {
      let cur = array[i];
      let flag = false;
      for (let item of values) {
        if (comparator(cur,item)) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        array[index] = cur;
        index += 1;
      }
    }
    array.length = index;
    return array;
  },
  pullAt: function (array,indexes) {
    let map = createMap(indexes);
    let index = 0;
    let pulled = [];
    for (let i=0; i<array.length; i++) {
      if (!map.has(i)) {
        array[index] = array[i];
        index += 1;
      } else {
        pulled.push(array[i]);
      }
    }
    array.length = index;
    return pulled;
  },
  reverse: function (array) {
    array = array.map(element => element);
    let left = 0, right = array.length - 1;
    while (left < right) {
      let temp = array[left];
      array[left] = array[right];
      array[right] = temp;
      left += 1;
      right -= 1;
    }
    return array;
  },
  slice: function (array,start=0,end=array.length) {
    start = ensureNum(start,0,array.length);
    end = ensureNum(end,array.length,array.length);
    let newArr = [];
    for (let index in array) {
      if (index>=start && index<end) {
        newArr.push(array[index]);
      }
    }
    return newArr;
  },
  sortedIndex: function (array,value) {
    let begin = 0;
    let end = array.length;
    while (begin < end-1) {
      let mid = (begin+end) >> 1;
      if (array[mid] < value) {
        begin = mid;
      } else {
        end = mid;
      }
    }
    return array[begin]>=value ? begin : end;
  },
  sortedIndexBy: function (array,value,convertor) {
    convertor = this.iteratee(convertor);
    value = convertor(value);
    let begin = 0;
    let end = array.length;
    while (begin < end-1) {
      let mid = (begin+end) >> 1;
      let cur = convertor(array[mid]);
      if (cur < value) {
        begin = mid;
      } else {
        end = mid;
      }
    }
    return convertor(array[begin])>=value ? begin : end;
  },
  sortedIndexOf: function (array,value) {
    let begin = 0;
    let end = array.length;
    while (begin < end-1) {
      let mid = (begin+end) >> 1;
      if (array[mid] < value) {
        begin = mid;
      } else {
        end = mid;
      }
    }
    if (array[begin] == value) {
      return begin;
    } else if (array[end] == value) {
      return end;
    } else {
      return -1;
    }
  },
  sortedLastIndex: function (array,value) {
    let begin = 0;
    let end = array.length;
    while (begin < end - 1) {
      let mid = (begin + end) >> 1;
      if (array[mid] > value) {
        end = mid;
      } else {
        begin = mid;
      }
    }
    return end;
  },
  sortedLastIndexBy: function (array,value,convertor) {
    convertor = this.iteratee(convertor);
    value = convertor(value);
    let begin = 0;
    let end = array.length;
    while (begin < end-1) {
      let mid = (begin+end) >> 1;
      let cur = convertor(array[mid]);
      if (cur > value) {
        end = mid;
      } else {
        begin = mid;
      }
    }
    return end;
  },
  sortedLastIndexOf: function (array,value) {
    let begin = 0;
    let end = array.length;
    while (begin < end - 1) {
      let mid = (begin + end) >> 1;
      if (array[mid] > value) {
        end = mid;
      } else {
        begin = mid;
      }
    }
    return array[begin]==value ? begin : -1;
  },
  sortedUniq: function (array) {
    let result = [];
    for (let i=0; i<array.length; i++) {
      if (array[i] != array[i+1]) {
        result.push(array[i]);
      }
    }
    return result;
  },
  sortedUniqBy: function (array,comparator) {
    let result = [];
    for (let i=0; i<array.length; i++) {
      let cur = comparator(array[i]);
      let comp = comparator(array[i-1]);
      if (cur != comp) {
        result.push(array[i]);
      }
    }
    return result;
  },
  tail: function (array) {
    return array.slice(1);
  },
  take: function (array,n=1) {
    return array.slice(0,n);
  },
  takeRight: function (array,n=1) {
    n = array.length-n>0 ? array.length-n : 0
    return array.slice(n);
  },
  takeRightWhile: function (array,predicate){
    predicate = this.iteratee(predicate);
    for (let i=array.length-1; i>=0; i--) {
      if (!predicate(array[i],i,array)) {
        return array.slice(i+1);
      }
    }
    return array.slice();
  },
  takeWhile: function (array,predicate) {
    predicate = this.iteratee(predicate);
    for (let i=0; i<array.length; i++) {
      if (!predicate(array[i],i,array)) {
        return array.slice(0,i);
      }
    }
    return array.slice();
  },
  union: function (...arrays) {
    arrays = Array.concat(...arrays);
    return this.uniq(arrays);
  },
  unionBy: function (...args) {
    let predicate = args.pop();
    args = this.flatten(args);
    return this.uniqBy(args,predicate);
  },
  unionWith: function (...args) {
    let comparator = this.iteratee(args.pop());
    args = this.flatten(args);
    return this.uniqWith(args,comparator);
  },
  uniq: function (array) {
    return [...new Set(array)];
  },
  uniqBy: function (array,predicate) {
    predicate = this.iteratee(predicate);
    let map = new Set();
    let result = array.filter(
      function (element) {
        let convert = predicate(element);
        if (map.has(convert)) {
          return false;
        } else {
          map.add(convert);
          return true;
        }
      }
    );
    return result;
  },
  uniqWith: function (array,comparator) {
    let result = array.reduce(
      function (acc,cur) {
        for (let obj of acc) {
          if (comparator(obj,cur)) {
            return acc;
          }
        }
        acc.push(cur);
        return acc;
      },[]);
      return result;
  },
  unzip: function (arrays) {
    let unit1 = arrays[0];
    let unit2 = arrays[1];
    let result = [];
    unit1.forEach(
      function (_,index) {
        let group = [];
        group.push(unit1[index],unit2[index]);
        result.push(group);
      }
    );
    return result;
  },
  unzipWith: function (array,unZipper) {
    let unit1 = array[0];
    let unit2 = array[1];
    let result = [];
    unit1.forEach(
      function (_,index) {
        let value = unZipper(unit1[index],unit2[index]);
        result.push(value);
      }
    );
    return result;
  },
  without: function (array,...values) {
    let map = new Set(values);
    return array.filter( element => !map.has(element));
  },
  xor: function (...arrays) {
    arrays = this.flatten(arrays);
    let map = new Set();
    let multi = arrays.filter(
      function (element) {
        if (map.has(element)) {
          return true;
        } else {
          map.add(element);
          return false;
        }
      }
    );
    let tMap = new Set(multi);
    return arrays.filter( element => !tMap.has(element));
  },
  xorBy: function (...args) {
    let predicate = this.iteratee(args.pop());
    args = this.flatten(args);
    let map = new Set();
    let multi = new Set();
    args.forEach(function (element) {
        let convert = predicate(element);
        if (map.has(convert)) {
          multi.add(convert);
        } else {
          map.add(convert);
        }
      });
    
    return args.filter((element) => !multi.has(predicate(element)));
  },
  xorWith: function (...args) {
    let comparator = args.pop();
    args = this.flatten(args);
    let result = args.filter(function (element,index) {
        for (let i=0; i<args.length; i++) {
          let cur = args[i];
          if (i!=index && comparator(element,cur)) {
            return false;
          }
        }
        return true;
      });
    return result;
  },
  zip: function (...arrays) {
    let unit1 = [];
    let unit2 = [];
    arrays.forEach(function (element) {
        unit1.push(element[0]);
        unit2.push(element[1]);
      });
    return [unit1, unit2];
  },
  zipObject: function (props,values) {
    let result = {};
    props.forEach( (prop,index) => result[prop]=values[index] );
    return result;
  },
  zipObjectDeep: function (props,values) {
    let result = {};
    props.reduce(function(acc,element,index) {
      let atrSet = element.split(".");
      let obj = acc;
      atrSet.forEach(function (atr,atrIndex) {
        if (atrIndex == atrSet.length-1) {
          analysis(obj,atr,values[index]);
        } else {
          obj = analysis(obj,atr);
        }});
      return acc;
    },result);
    return result;

    function analysis(obj,path,value={}) {
      if (path.indexOf("[") == -1) {
        if (obj[path] == undefined) {
          obj[path] = value;
        }
        return obj[path];
      } else {
        let atrName = path.slice(0,path.indexOf("["));
        if (obj[atrName] == undefined) {
          obj[atrName] = [];
        }
        let index = path.slice(path.indexOf("[")+1,path.indexOf("]"));
        if (obj[atrName][index] == undefined) {
          obj[atrName][index] = value;
        }
        return obj[atrName][index];
      }
    }
  },
  zipWith: function (...args) {
    let zipper = args.pop();
    let first = [];
    let second = [];
    for (let i=0; i<args.length; i++) {
      first.push(args[i][0]);
      second.push(args[i][1]);
    }
    return [zipper(...first),zipper(...second)];
  },
  countBy: function (collection,counter) {
    counter = this.iteratee(counter);
    let result = {};
    for (let key in collection) {
      let genKey = counter(collection[key]);
      if (result[genKey] == undefined) {
        result[genKey] = 1;
      } else {
        result[genKey] += 1;
      }
    }
    return result;
  },
  forEach: function (collection,operate) {
    if (collection instanceof Array) {
      for (let i=0; i<collection.length; i++) {
        let cur = collection[i];
        if (operate(cur,i,collection) == false) {
          return collection;
        }
      }
      return collection;
    } else {
      for (let key in collection) {
        let cur = collection[key];
        if (operate(cur,key,collection) == false) {
          return collection;
        }
      }
      return collection;
    }
  },
  forEachRight: function (collection,operate) {
    if (Array.isArray(collection)) {
      for (let i=collection.length-1; i>=0; i--) {
        operate(collection[i]);
      }
      return collection;
    } else {
      return this.forEach(collection,operate);
    }
  },
  every: function (collection,predicate) {
    predicate = this.iteratee(predicate);
    for (let k in collection) {
      if (!predicate(collection[k])) {
        return false;
      }
    }
    return true;
  },
  filter: function (collection,predicate) {
    predicate = this.iteratee(predicate);
    if (collection instanceof Array) {
      let out = [];
      for (let i=0; i<collection.length; i++) {
        let cur = collection[i];
        predicate(cur,i,collection) && out.push(cur);
      }
      return out;
    } else if (collection instanceof Object) {
      let out = {};
      for (let key in collection) {
        let cur = collection[key];
        predicate(cur,key,collection) && (out[key]=cur);
      }
      return out;
    }
  },
  find: function (collection,predicate,fromIndex=0) {
    let end = collection.length;
    predicate = this.iteratee(predicate);
    if (Array.isArray(collection)) {
      fromIndex |= 0;
      if (fromIndex < 0) {
        fromIndex = Math.abs(fromIndex)>end ? 0 : end+fromIndex;
      }
      for (let i = fromIndex; i < end; i++) {
        if (predicate(collection[i])) {
          return collection[i];
        }
      }
      return undefined;
    } else {
      for (let key in collection) {
        if (predicate(collection[key])) {
          return collection[key];
        }
      }
      return undefined;
    }
  },
  findLast: function (collection,predicate,fromIndex=collection.length-1) {
    let end = collection.length;
    predicate = this.iteratee(predicate);
    if (Array.isArray(collection)) {
      fromIndex |= 0;
      if (fromIndex < 0) {
        fromIndex = end + fromIndex;
      } else if (fromIndex > end) {
        fromIndex = end;
      }
      for (let i=fromIndex; i>=0; i--) {
        if (predicate(collection[i])) {
          return collection[i];
        }
      }
      return undefined;
    } else {
      return this.find(collection,predicate);
    }
  },
  flatMap: function (collection,iteratee) {
    return this.flatten(collection.map(ele => iteratee(ele)));
  },
  flatMapDeep: function (collection,iteratee) {
    return this.flattenDeep(collection.map( ele => iteratee(ele)));
  },
  flatMapDepth: function (collection,iteratee,depth=1) {
    return this.flattenDepth(collection.map(ele => iteratee(ele)),depth);
  },
  groupBy: function (collection,predicate) {
    predicate = this.iteratee(predicate);
    if (collection instanceof Array) {
      let out = {};
      for (let i = 0; i < collection.length; i++) {
        let cur = collection[i];
        let key = predicate(cur);
        if (out[key] == undefined) {
          out[key] = [cur];
        } else {
          out[key].push(cur);
        }
      }
      return out;
    } else {
      let out = {};
      for (let property in collection) {
        let cur = collection[property];
        let key = predicate(cur);
        if (out[key] == undefined) {
          out[key] = [cur];
        } else {
          out[key].push(cur);
        }
      }
      return out;
    }
  },
  includes: function (collection,value,fromIndex=0) {
    if (collection instanceof Object) {
      collection = Object.values(collection);
      if (this.indexOf(collection,value,fromIndex) == -1) {
        return false;
      } else {
        return true;
      }
    } else if (typeof collection == 'string') {
      collection = Object(collection);
      fromIndex = ensureNum(fromIndex,0,collection.length);
      value = Object(value);
      let len = value.length;
      let end = collection.length - len;
      for (let i=fromIndex; i<=end; i++) {
        let cur = collection[i];
        if (cur == value[0]) {
          let find = true;
          for (let j=1; j<len; j++) {
            if (collection[i+j] != value[j]) {
              find = false;
              break;
            }
          }
          if (find) {
            return true;
          }
        }
      }
    }
  },
  invokeMap: function (collection,path,...args) {
    if (typeof path == 'string') {
      path = collection[0][path];
    }
    return collection.map(ele => path.apply(ele,args));
  },
  keyBy: function (collection,convertor) {
    let result = {};
    convertor = this.iteratee(convertor);
    for (let item in collection) {
      let key = convertor(collection[item]);
      if (result[key] == undefined) {
        result[key] = collection[item];
      } else {
        result[key] = [...result[key]].push(collection[item]);
      }
    }
    return result;
  },
  map: function (collection,mapper) {
    mapper = this.iteratee(mapper);
    let keys = Object.keys(collection).map( key => isNaN(key)?key:Number(key));
    return keys.map( key => mapper(collection[key],key,collection));
  },
  orderBy: function (collection,iteratees,orders) {
    const result = collection.slice();
    const iters = iteratees.map(ele => this.iteratee(ele));
    const comp = function (a,b) {
      if (a>b) { return 1; }
      else if (a<b) { return -1; }
      else { return 0; }  
    }
    result.sort(function (pre,aft) {
      for(let i=0; i<iters.length; i++) {
        const cPre = iters[i](pre);
        const cAft = iters[i](aft);
        const flag = orders[i]==="asc" ? comp(cPre,cAft) : comp(cAft,cPre);
        if (flag != 0) {
          return flag;
        }
      }
      return 0;
    });
    return result;
  },
  partition: function (collection,predicate) {
    predicate = this.iteratee(predicate);
    let result = [[],[]];
    for (let i=0; i<collection.length; i++) {
      let cur = collection[i];
      if (predicate(cur)) {
        result[0].push(cur);
      } else {
        result[1].push(cur);
      }
    }
    return result;
  },
  reject: function (collection,predicate) {
    predicate = this.iteratee(predicate);
    return collection.filter(function (ele,index,array) {
      return !predicate(ele,index,array);
    });
  },
  sample: function (collection) {
    let inv = Object.entries(collection);
    let sample = inv[Math.random()*inv.length|0]
    if (Array.isArray(collection)) {
      return sample[1];
    } else {
      return {[sample[0]] : sample[1]};
    }
  },
  sampleSize: function (collection,n=1) {
    const inv = new Set();
    const keys = Object.keys(collection);
    n = n<=keys.length ? n : keys.length;
    while (inv.size < n) {
      let rand = Math.random() * keys.length | 0;
      if (!inv.has(keys[rand])) {
        inv.add(keys[rand]);
      }
    }
    let result;
    if (Array.isArray(collection)) {
      result = [];
      inv.forEach( ele => result.push(collection[ele]));
    } else {
      result = {};
      inv.forEach( ele => result[ele]=collection[ele]);
    }
    return result;
  },
  shuffle: function (collection) {
    let result = collection.slice();
    for (let i=result.length-1; i>0; i--) {
      const rand = Math.random() * i | 0;
      swap(result,i,rand%(i+1));
    }
    return result;
  },
  size: function (collection) {
    return Object.keys(collection).length;
  },
  some: function (collection,predicate) {
    predicate = this.iteratee(predicate);
    for (const key in collection) {
      if (predicate(collection[key])) {
        return true;
      }
    }
    return false;
  },
  sortBy: function (collection,iteratees) {
    const result = collection.slice();
    const iters = iteratees.map(ele => this.iteratee(ele));
    result.sort(function (pre,after) {
      for (let i=0; i<iters.length; i++) {
        const criPre = iters[i](pre);
        const criAfter = iters[i](after);
        if (criPre > criAfter) {
          return 1;
        } else if (criPre < criAfter) {
          return -1;
        }
      }
      return 0;
    });
    return result;
  },
  castArray: function (value) {
    if (Array.isArray(value)) {
      return value;
    } else if (arguments.length === 0) {
      return [];
    } else {
      return [value];
    }
  },
  conformsTo: function (object,source) {
    for (let key in source) {
      if (!source[key](object[key])) {
        return false;
      }
    }
    return true;
  },
  eq: function (object,other) {
    if (object != object) {
      return other != other;
    } else {
      if (typeof object === typeof other) {
        return object == other;
      } else {
        return false;
      }
    }
  },
  gt: function (value,other) {
    return value > other;
  },
  gte: function (value,other) {
    return value >= other;
  },
  isArguments: function (value) {
    return Object.prototype.toString.call(value) === "[object Arguments]";
  },
  isArray: function (value) {
    return Object.prototype.toString.call(value) === "[object Array]";
  },
  isArrayBuffer: function (value) {
    return Object.prototype.toString.call(value) === "[object ArrayBuffer]";
  },
  isArrayLike: function (value) {
    return typeof value != "function" && value.hasOwnProperty("length");
  },
  isArrayLikeObject: function (value) {
    return typeof value === 'object' && value.hasOwnProperty("length");
  },
  isBoolean: function (value) {
    return Object.prototype.toString.call(value) === "[object Boolean]";
  },
  isDate: function (value) {
    return Object.prototype.toString.call(value) === '[object Date]';
  },
  isElement: function (value) {
    return value !== null && typeof value === 'object' && value.nodeType === 1;
  },
  isEmpty: function (value) {
    return this.isNil(value) || Object.values(value).length===0;
  },
  isNil: function (value) {
    return value===null || value===undefined;
  },
  isNull: function (value) {
    return value === null;
  },
  negate: function (predicate) {
    return function(...args) {
      return !predicate(...args);
    }
  },
  isEqual: function (value,other) {
    if (value === other) {
      return true;
    } else if (value instanceof Object && other instanceof Object) {
      let vKeys = Object.keys(value);
      let oKeys = Object.keys(other);
        
      if (vKeys.length != oKeys.length) {
        return false;
      } else {
        for (let i=0; i<vKeys.length; i++) {
          let curKey = vKeys[i];
          if (value[curKey] !== other[curKey]) {
            if (!this.isEqual(value[curKey],other[curKey])) {
              return false;
            }
          }
        }

        return true;
      }
    } else {
        return false;
    }
  },
  isEqualWith: function (value,other,customizer) {
    if (typeof value != typeof other) {
      return false;
    } else if (typeof value=="string" || typeof value=="number") {
      return customizer(value,other);
    } else {
      const val = Object.entries(value);
      const oth = Object.entries(other);
      return val.every(function (cur,i) {
        let test = customizer(cur[1],oth[i][1],cur[0],oth[i][0],val,oth);
        if (test) {
          return true;
        } else if (test === undefined) {
          return cur[1] == oth[i][1];
        } else {
          return false;
        }
      });
    }
  },
  isError: function (value) {
    return value instanceof Error;
  },
  isFinite: function (value) {
    return Number.isFinite(value);
  },
  isFunction: function (value) {
    return typeof value === "function";
  },
  isInteger: function (value) {
    return Number.isInteger(value);
  },
  isLength: function (value) {
    return value === this.toLength(value);
  },
  isMap: function (value) {
    return Object.prototype.toString.call(value) === "[object Map]";
  },
  isMatch: function (object,source) {
    let predicate = this.matches(source);
    return predicate(object);
  },
  isMatchWith: function (object,source,customizer) {
    for (const key in object) {
      const flag = customizer(object[key],source[key],key,key,object,source);
      if (!flag) {
        if (flag!=undefined || object[key]!=source[key]) {
          return false;
        }
      }
    }
    return true;
  },
  isNaN: function (value) {
    return Object.prototype.toString.call(value)==="[object Number]" && window.isNaN(value);
  },
  isNative: function (value) {
    return value.toString().includes("[native code]");
  },
  isNumber: function (value) {
    return Object.prototype.toString.call(value) === "[object Number]";
  },
  isObject: function (value) {
    return value!==null || typeof value==="undefined" || typeof value==="function";
  },
  isObjectLike: function (value) {
    return value!==null && typeof value==="object";
  },
  isPlainObject: function (value) {
    return typeof value==="object" && (value.__proto__===Object.prototype||value.__proto__===undefined);
  },
  isRegExp: function (value) {
     return Object.prototype.toString.call(value) === "[object RegExp]";
  },
  isSafeInteger: function (value) {
    return Number.isSafeInteger(value);
  },
  isSet: function (value) {
    return Object.prototype.toString.call(value) === "[object Set]";
  },
  isString: function (value) {
    return Object.prototype.toString.call(value) === "[object String]";
  },
  isSymbol: function (value) {
    return typeof value === "symbol";
  },
  isTypedArray: function (value) {
    const type = Object.prototype.toString.call(value);
    return type.includes("Array") && type.length>14;
  },
  isUndefined: function (value) {
    return value === undefined;
  },
  isWeakMap: function (value) {
    return Object.prototype.toString.call(value) == "[object WeakMap]";
  },
  isWeakSet: function (value) {
    return Object.prototype.toString.call(value) == "[object WeakSet]";
  },
  lt: function (value,other) {
    return value<other;
  },
  lte: function (value,other) {
    return value<=other;
  },
  toArray: function (value) {
    if (value===null || value===undefined) {
      return [];
    } else {
      return Object.values(value);
    }
  }, 
  toFinite: function (value) {
    if (value === Infinity) {
      return Number.MAX_VALUE; 
    } else if (value === -Infinity) {
      return Number.MIN_VALUE;
    } else {
      const result = Number(value);
      return isNaN(result) ? 0 : result;
    }
  },
  toInteger: function (value) {
    if (value === undefined) {
      return Number.MAX_SAFE_INTEGER;
    }
    const result = this.toFinite(value);
    return result | 0;
  },
  toLength: function (value) {
    if (value < 0 || isNaN(value)) {
      return 0;
    } else if (value === Infinity) {
      return 4294967295;
    } else {
      return value | 0;
    }
  },
  toNumber: function (value) {
    return Number(value);
  },
  assign: function (object,...sources) {
    return sources.reduce(function (res,cur) {
      const infos = Object.entries(cur);
      for (const i in infos) {
        const info = infos[i];
        res[info[0]] = info[1];
      }
      return res;
    },object);
  },
  toSafeInteger: function (value) {
    if (isNaN(value)) {
      return 9007199254740991;
    } else {
      value = Number(value);
    }
    if (this.isFinite(value)) {
      return value | 0;
    } else if (value<0) {
      return -9007199254740991
    } else {
      return 9007199254740991;
    }
  },
  add: function (augend,addend) {
    return augend + addend;
  },
  ceil: function (number,precision=0) {
    const multiple = 10 ** precision;
    return Math.ceil(number*multiple) / multiple;
  },
  divide: function (dividend,divisor) {
    return dividend/divisor;
  },
  floor: function (number,precision=0) {
    const multiple = 10 ** precision;
    return Math.floor(number*multiple) / multiple;
  },
  max: function (array) {
    if (this.isEmpty(array)) {
      return undefined;
    } else {
      return Math.max(...array);
    }
  },
  maxBy: function (array,iteratee=this.identity) {
    const cvt = this.iteratee(iteratee);
    const tIdx = array.reduce(function (acc,cur,idx) {
      const comp = cvt(cur);
      if (comp > acc[0]) {
        acc[0] = comp;
        acc[1] = idx;
      }
      return acc;
    },[-Infinity,undefined])[1];
    
    return array[tIdx];
  },
  mean: function (array) {
    return this.sum(array) / array.length;
  },
  meanBy: function (array,iteratee=this.identity) {
    const cvt = this.iteratee(iteratee);
    return array.reduce((acc,cur) => acc+cvt(cur),0) / array.length;
  },
  min: function (array) {
    if (this.isEmpty(array)) {
      return undefined;
    } else {
      return Math.min(...array);
    }
  },
  minBy: function (array,iteratee=this.identity) {
    const cvt = this.iteratee(iteratee);
    const tIdx = array.reduce(function (acc,cur,idx) {
      const comp = cvt(cur);
      if (comp < acc[0]) {
        acc[0] = comp;
        acc[1] = idx;
      }
      return acc;
    }, [Infinity, undefined])[1];

    return array[tIdx];
  },
  multiply: function (mtr,mtd) {
    return mtr * mtd;
  },
  round: function (number,precision=0) {
    const mtp = 10 ** precision;
    return Math.round(number*mtp) / mtp;
  },
  subtract: function (minuend,subtrahend) {
    return minuend - subtrahend;
  },
  sum: function (array) {
    return array.reduce((acc,cur) => acc+cur,0);
  },
  sumBy: function (array,iteratee=this.identity) {
    const cvt = this.iteratee(iteratee);
    return array.reduce((acc,cur) => acc+cvt(cur),0);
  },
  clamp: function (number,lower,upper) {
    if (number > upper) {
      return upper;
    } else if (number < lower) {
      return lower;
    } else {
      return number;
    }
  },
  inRange: function (number,start=0,end) {
    if (end == undefined) {
      end = start;
      start = 0;
    }
    if (start > end) {
      [start,end] = [end,start]; 
    }
    return number>start && number<end;
  },
  random: function (...args) {
    const rand = Math.random();
    if (args.length === 1) {
      const result = rand * args[i];
      return  Number.isInteger(args[i]) ? Math.round(result) : result; 
    } else if (args.length === 2) {
      const first = args[0];
      const last = args[1];
      if (typeof last === "boolean") {
        return last ? first : Math.round(first);
      } else {
        const result = (last-first) * rand + first;
        const float = Number.isInteger(first) || Number.isInteger(last);
        return float ? result : Math.round(result);
      }
    } else {
      const lower = args[0];
      const upper = args[1];
      const float = args[2] || !Number.isInteger(lower) || !Number.isInteger(upper);
      const result = (upper-lower) * rand + lower;
      return float ? result : Math.round(result);
    }
  },
  assignIn: function (object,...sources) {
    return sources.reduce(function (res,cur) {
      for (const key in cur) {
        res[key] = cur[key];
      }
      return res;
    },object);
  },
  at: function (object,paths) {
    const result = [];
    paths.forEach(function (path) {
      let val = object;
      path.split(/\.|\[|\]/g).forEach((path) => {
        if (path != "") {
          val=val[path];
        }
      });
      result.push(val);
    });
    return result;
  },
  defaults: function (object,...sources) {
    return sources.reduce(function (res,cur) {
      for (const key in cur) {
        if (res[key] === undefined) {
          res[key] = cur[key];
        }
      }
      return res;
    },object);
  },
  defaultsDeep: function (object,...sources) {
    return sources.reduce(function (res,cur) {
      let node = res;
      for (const key in cur) {
        if (typeof cur[key]==="object" && cur[key]!==null) {
          if (node[key] == undefined) {
            node[key] = {};
          };
          this.defaultsDeep(node[key],cur[key]);
        } else if (res[key] === undefined) {
          node[key] = cur[key];
        }
      }
      return res;
    }.bind(this),object);//是在【sources】的reduce函数中，且传入的函数内部调用了【lodash】中的函数并且还会递归，在传的时候先绑定this。
  },
  findKey: function (object,predicate) {
    predicate = this.iteratee(predicate);
    for (const key in object) {
      if (predicate(object[key])) {
        return key;
      }
    }
    return undefined
  },
  findLastKey: function (object,predicate) {
    predicate = this.iteratee(predicate);
    const keys = Object.keys(object);
    for (let i=keys.length-1; i>=0; i--) {
      const key = keys[i];
      if (predicate(object[key])) {
        return key;
      }
    }
    return undefined;
  },
  forIn: function (object,func=this.identity) {
    for (const key in object) {
      if (func(object[key],key,object) === false) {
        return object;
      };
    }
    return object;
  },
  forInRight: function (object,func=this.identity) {
    const keys = [];
    for (const key in object) {
      keys.push(key);
    }
    for (let i=keys.length-1; i>=0; i--) {
      const key = keys[i];
      if (func(object[key],key,object) === false) {
        return object;
      }
    }
    return object;
  },
  forOwn: function (object,func=this.identity) {
    const keys = Object.keys(object);
    for (let i=0; i<keys.length; i++) {
      const key = keys[i];
      if (func(object[key],key,object) === false) {
        return object;
      }
    }
    return object;
  },
  forOwnRight: function (object, func=this.identity) {
    const keys = Object.keys(object);
    for (let i=keys.length-1; i>=0; i--) {
      const key = keys[i];
      if (func(object[key],key,object) === false) {
        return object;
      }
    }
    return object;
  },
  functions: function (object) {
    return Object.keys(object);
  },
  functionsIn: function (object) {
    const keys = [];
    for (const key in object) {
      keys.push(key);
    }
    return keys;
  },
  get: function (object,path,dftVal) {
    if (typeof path === "string") {
      path = path.split(/\.|\[|\]/g);
    }
    let node = object;
    for (let i=0; i<path.length; i++) {
      const cur = path[i];
      if (cur !== "") {
        node = node[cur];
        if (node === undefined) {
          return dftVal;
        }
      }
    }
    return node;
  },
  has: function (object,path) {
    if (typeof path === "string") {
      path = path.split(/\.|\[|\]/g);
    }
    let node = object;
    for (let i=0; i<path.length; i++) {
      const cur = path[i];
      if (cur!=="" && node.hasOwnProperty(cur)) {
        node = node[cur];
      } else if (cur!=="") {
        return false;
      }
    }
    return true;
  },
  hasIn: function (object,path) {
    if (typeof path === "string") {
      path = path.split(/\.|\[|\]/g);
    }
    let node = object;
    for (let i=0; i<path.length; i++) {
      const cur = path[i];
      const next = node[cur];
      if (cur !== "" && next!==undefined) {
        node = next;
      } else {
        return false;
      }
    }
    return true;
  },
  invert: function (obj) {
    const res = {};
    const keys = Object.keys(obj);
    keys.forEach(key => res[obj[key]]=key);
    return res;
  },
  invertBy: function (obj,iter=this.identity) {
    iter = this.iteratee(iter);
    const res = {};
    const keys = Object.keys(obj);
    keys.forEach(function (key) {
      const k = iter(obj[key]);
      if (res[k] === undefined) {
        res[k] = [key];
      } else {
        res[k].push(key);
      }
    });
    return res;
  },
  invoke: function (obj, path, ...args) {
    path = path.split(/\.|\[|\]/g);
    const func = path.pop();
    const tar = this.get(obj, path);
    return tar === undefined ? tar : tar[func](...args);
  },
  keys: function (obj) {
    return Object.keys(obj);
  },
  keysIn: function (obj) {
    const res = [];
    for (const key in obj) {
      res.push(key);
    }
    return res;
  },
  mapKeys: function (obj,iter=this.identity) {
    iter = this.iteratee(iter);
    const res = {};
    const entries = Object.entries(obj);
    for (let i=0; i<entries.length; i++) {
      const info = entries[i];
      const key = iter(info[1],info[0],obj);
      res[key] = obj[info[0]];
    }
    return res;
  },
  mapValues: function (obj,iter=this.identity) {
    iter = this.iteratee(iter);
    const res = {};
    const entries = Object.entries(obj);
    for (let i=0; i<entries.length; i++) {
      const info = entries[i];
      const val = iter(info[1],info[0],obj);
      res[info[0]] = val;
    }
    return res;
  },
  merge: function (obj,...src) {
    for (let i=0; i<src.length; i++) {
      const cur = src[i];
      for (const key in cur) {
        const objKtp = typeof obj[key];
        const curKtp = typeof cur[key];
        if (objKtp==="object" && curKtp==="object") {
          this.merge(obj[key],cur[key]);
        } else if (objKtp==="undefined" && curKtp!=="object") {
          obj[key] = cur[key];
        }
      }
    }
    return obj;
  },
  mergeWith: function (obj,...other) {
    const customizer = other.pop();
    for (let i=0; i<other.length; i++) {
      const cur = other[i];
      for (const key in cur) {
        const val = customizer(obj[key],cur[key],key,key,obj,cur);
        if (val === undefined) {
          obj[key] = cur[key];
        } else {
          obj[key] = val;
        }
      }
    }
    return obj;
  },
  omit: function (obj,paths) {
    const res = {};
    const map = new Set(paths);
    for (const key in obj) {
      if (!map.has(key)) {
        res[key] = obj[key]; 
      }
    }
    return res;
  },
  omitBy: function (obj,predicate=this.identity) {
    const res = {};
    for (const key in obj) {
      if (!predicate(obj[key],key)) {
        res[key] = obj[key];
      }
    }
    return res;
  },
  pick: function (obj,paths) {
    const map = new Set(paths);
    const res = {};
    Object.keys(obj).forEach(key => map.has(key) && (res[key]=obj[key]));
    return res;
  },
  pickBy: function (obj,predicate=this.identity) {
    const res = {};
    Object.entries(obj)
    .forEach(info => predicate(info[1],info[0]) && (res[info[0]]=info[1]));
    return res;
  },
  result: function (obj,path,dftVal) {
    if (typeof path === "string") {
      path = path.split(/\.|\[|\]/g);
    }
    let node = obj;
    for (let i = 0; i < path.length; i++) {
      const cur = path[i];
      const next = node[cur];
      if (cur!=="" && next!==undefined) {
        node = next;
      } else if (cur !== "") {
        if (typeof dftVal==="function") {
          return dftVal.call(node);
        } else {
          return dftVal;
        }
      }
    }
    return node;
  },
  // set:
  // function set(obj,path,) {
  // },
  // setWith:
  // function setWith(obj,path,value,customizer) {
  // },
  // updateWith:
  // function updateWith(obj,path,update,customizer=this.identity) {
  //   if (typeof path === "string") {
  //     path = path.split(/\.|\[|\]/g);
  //   }
  //   let node = obj;
  //   for (let i=0; i<path.length; i++) {
  //     const cur = path[i];
  //     if (cur !== "") {
  //       let next = node[cur];
  //       if (next === undefined) {
  //         next = customizer()
  //         node[cur] = next===undefined ? {} : next;
  //       }
  //     }
  //   }
  // },
  values: Object.values,
  valuesIn: function (obj) {
    const res = [];
    for (const key in obj) {
      res.push(obj[key]);
    }
    return res;
  },
  camelCase: function (string="") {
    var words = this.words(string)
    return words.reduce((acc, cur) => acc + this.capitalize(cur), words.shift().toLowerCase())
  },
  capitalize: function (string="") {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  },
  endWith: function (string,target,pos=string.length) {
    return string.slice(pos-1).indexOf(target) !== -1;
  },
  escape: function (string="") {
    const objStr = Object(string);    
    const map = new Map(
      [["&",'&amp;'],["<",'&lt;'],[">",'&gt;'],['"','&quot;'],["'",'&#39;']]
    );
    let res = "";
    for (let i=0; i<objStr.length; i++) {
      const cur = objStr[i];
      if (map.has(cur)) {
        res += map.get(cur);
      } else {
        res += cur;
      }
    }
    return res;
  },
  escapeRegExp: function (string="") {
    const objStr = Object(string);
    const map = new Set(["^","$","",".","*","+","?","(",")","[","]","{","}","|"]);
    let res = "";
    for (let i = 0; i < objStr.length; i++) {
      const cur = objStr[i];
      if (map.has(cur)) {
        res += ("\\" + cur);
      } else {
        res += cur;
      }
    }
    return res;
  },
  // kebabCase:
  // function kebabCase(string) {
  // },
  // toLowerCase:
  // function toLowerCase() {
  // },
  // mixin:
  // function mixin(object=this,source,option={}) {
  // },
  // pad: function (str="",len=0,chars=" ") {
  // },
  // parseInt: function () {
  // },
  repeat: function (str="",n=1) {
    let res = "";
    for (let i=0; i<n; i++) {
      res += str;
    }
    return res;
  },
  replace: (str= '',pattern,replacement) => str.replace(pattern,replacement),
  snakeCase: function (strs = "") {//因为使用了【this】所以不能用箭头函数
    return this.words(strs)
      .map(str => str.toLowerCase())
      .join("_");
  },
  split: (str="",sep,lim) => String.prototype.split.call(str,sep,lim),
  startCase: function (string) {
    return this.words(string).map(str => this.upperFirst(str)).join(" ");
  },
  startWith: function(string="",target,pos=0) {
    return string[pos] === target;
  },
  toLower: str => String.prototype.toLowerCase.call(str),
  toUpper: str => String.prototype.toUpperCase.call(str),
  trim: function (string="",chars=" 　") {
    return this.trimStart(this.trimEnd(string,chars),chars);
  },
  trimEnd: function (string="",chars=" 　") {
    const map = new Set(chars);
    const objStr = Object(string);
    for (let i=objStr.length-1; i>=0; i--) {
      if (!map.has(objStr[i])) {
        return string.slice(0,i+1);
      }
    }
    return string;
  },
  trimStart: function (string="",chars=" 　") {
    const map = new Set(chars);
    const objStr = Object(string);
    const end = objStr.length;
    for (let i=0; i<end; i++) {
      if (!map.has(objStr[i])) {
        return string.slice(i);
      }
    }
    return string;
  },
  truncate: function (str="",opt={}) {
    const len = opt.length === undefined ? 30 : opt.length;
    const omi = opt.omission === undefined ? "..." : opt.omission;
    if (str.length < len) {
      return str;
    } else {
      let res = str.slice(0, len);
      if (opt.separator !== undefined) {
        const sep = opt.separator;
        if (typeof sep === "string") {
          const cut = res.lastIndexOf(sep);
          return res.slice(0, cut) + omi;
        } else {
          const reg = new RegExp(sep, "g");
          let lastIdx = 0;
          let info = reg.exec(res);
          do {
            lastIdx = info.index;
            info = reg.exec(res);
          } while (info);
          return res.slice(0, lastIdx) + omi;
        }
      } else {
        return res.slice(0, -omi.length) + omi;
      }
    }
  },
  unescape: function (string="") {
    const objStr = Object(string);
    const map = new Map([
      ['&amp;','&'],
      ['&lt;','<'],
      ['&gt;','>'],
      ['&quot;','"'],
      ['&#39;',"'"]
    ]);
    let res = "";
    let escape = "&";
    for (let i=0; i<objStr.length; i++) {//【i】指字符串当前的位置，会在两个循环内用到。
      let cur = objStr[i];//指当前操作处理的单个字符，会在多种情况使用。
      if (cur === "&") {
        do {
          i += 1;
          cur = objStr[i];
          escape += cur;
        } while (cur !== ";");
        res += map.get(escape);
        escape = "&";
      } else {
        res += cur;
      }
    }
    return res;
  },
  upperCase: function (string="") {
    return this.words(string)
          .map(str => str.toUpperCase())
          .join(" ");
  },
  upperFirst: function (string="") {
    return string[0].toUpperCase() + string.slice(1);
  },
  words: function (string="",pattern=/[A-Z]?[a-z]+|[A-Z]+/g) {
    return string.match(pattern);
  },
  defaultTo: function (value,dftVal) {
    return isNaN(value)&&value!==null ? dftVal : value;
  },
  range: function (start=0,end,step=1) {
    if (end === undefined) {
      end = start;
      start = 0;
    }
    let acc = start;
    const res = [];
    let i = start;
    if (start > end) {
      [start, end] = [end, start];
      step = step<=0 ? step : -1;
      res.push(acc);
      i = start - step;
      acc += step;
    }
    for (; i<end && acc<end; i++) {
      res.push(acc);
      acc += step;
    }
    return res;
  },
  rangeRight: function (start=0,end,step=1) {
    return this.range(start,end,step).reverse();
  },
  times: function (n,iter=this.identity) {
    const res = [];
    for (let i=0; i<n; i++) {
      res.push(iter(i));
    }
    return res;
  },
  toPath: function (value) {
    return typeof value === 'object' ? value : value.match(/[a-z0-9]+/gi);
  },
  uniqueId: function (prefix="") {
    const Id = ++idCount;
    return String(prefix) + Id;
  },
  cloneDeep: function (value) {
    if (typeof value!=="object" || value === null) {
      return value;
    } else {
      const ctor = value.constructor;
      const res = ctor===RegExp ? ctor(value) : ctor();
      const keys = Object.keys(value);
      keys.forEach(key => res[key]=this.cloneDeep(value[key]));
      return res;
    }
  },
  property: function (path) {
    return obj => this.get(obj,path);
  },
  ary: function (func,n=func.length) {
    return (...args) => func.apply(null,args.slice(0,n));
  },
  unary: function (func) {
    return arg => func(arg);
  },
  once: function (func) {
    let save;
    return (...args) => save!==undefined
                      ? save
                      : save=func.apply(null,args);
  },
  spread: function (func,start=0) {
    return args => func.apply(this,args.slice(start));
  },
  curry: function (func,arity=func.length) {
    const paras = [];//储存参数。
    const empty = [];//储存空缺参数的位置。

    return function process(...args) {
      let iter = 0;
      const end = args.length;
      
      //参数先满足空缺的参数。
      while (empty.length!==0 && iter<end) {
        paras[empty.shift()] = args[iter];
        iter += 1;
      }

      //遍历【args】把参数保存在【paras】中
      for (; iter<end; iter++) {
        const cur = args[iter];
        if (cur === qpumpkin) {
          empty.push(paras.length);
          paras.length += 1;
        } else {
          paras.push(cur);
        }
      }

      //检测传参个数是否达成要求
      if (empty.length!==0 || paras.length<arity) {
        return process;
      } else {
        return func(...paras);
      }
    };
  },
  // memoize:
  // function memoize(func,resolver) {
  //   return function (obj) {
  //     return func(obj)
  //   }.bind(memoize);
  // },
  flip: function (func) {
    return (...args) => func(...args.reverse());
  },
  conforms: function (source) {
    return obj => Object.keys(source)
    .every(key => this.iteratee(source[key])(obj[key]));
  },
  constant: function (value) {
    return (...any) => value;
  },
  flow: function (funcs) {
    return (...args) => funcs.reduce(
      (acc,func) => func(acc)
      ,funcs.shift()(...args));
  },
  method: function (path,...args) {
    return obj => this.get(obj,path)(...args);
  },
  methodOf: function (obj,...args) {
    return path => this.get(obj,path)(...args);
  },
  nthArg: function (n) {
    return (...args) => n>0 ? args[n] : args[args.length+n]; 
  },
  // propertyOf:
  // function propertyOf(obj) {
  //   return function () {
  //   }
  // },
  identity: function (value) {
    return value;
  },
  bind: function (func, thisArg, ...partials) {
    return function (...arg) {
      let args = [];
      let index = 0;
      for (let i = 0; i < partials.length; i++) {
        if (partials[i] === qpumpkin) {
          args.push(arg[index]);
          index += 1;
        } else {
          args.push(partials[i]);
        }
      }
      args = args.concat(arg.slice(index));

      return func.apply(thisArg, args);
    }
  },
  /*-------------------tool-------------------*/
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
  matchesProperty: function (key,value) {
    return object => this.isEqual(object[key],value);
  },
  matches: function (source) {
    return value => {
      let predicate;
      for (key in source) {
        predicate = this.matchesProperty(key,source[key]);
        if (!predicate(value)) {
          return false;
        }
      }

      return true;
    }
  },
  remove: function (array,predicate) {
    predicate = this.iteratee(predicate);
    let out = [];
    let saveIndex = [];
    for (let i=0; i<array.length; i++) {
      if (predicate(array[i],i,array)) {
        out.push(array[i]);
      } else {
        saveIndex.push(i);
      }
    }
    //this.pull(array,out);
    for (let j=0; j<saveIndex.length; j++) {
      array[j] = array[saveIndex[j]];
    }
    array.length = saveIndex.length;
    return out;
  },
  reduce: function (collection,iter=this.identity,acc) {
    const infos = Object.entries(collection);
    iter = this.iteratee(iter);
    let start = 0;
    if (acc === undefined) {
      acc = infos[0][1];
      start = 1;
    }
    for (let i=start; i<infos.length; i++) {
      acc = iter(acc,infos[i][1],infos[i][0],collection);
    }
    return acc;
  },
  reduceRight: function (collection,iter=this.identity,acc) {
    const infos = Object.entries(collection);
    iter = this.iteratee(iter);
    let start = infos.length - 1;
    if (acc === undefined) {
      acc = infos[start][1];
      start -= 1;
    }
    for (let i=start; i>=0; i--) {
      acc = iter(acc,infos[i][1],infos[i][0],collection);
    }
    return acc;
  }
};
function sliceArray(array,begin=0,end=array.length,step=1) {
  let out = []
  begin = ensureNum(begin,0,array.length);
  end = ensureNum(end,array.length,array.length);
  step = isNaN(step) ? 1 : parseInt(step);
  for (let i=begin; i<end; i+=step) {
    out.push(array[i]);
  }
  return out;
}
function createMap(values,convertor) {
  if (convertor !== undefined) {
    values = values.map(element => convertor(element));
  }
  let map = new Set(values);
  return map;
}
function ensureNum(value,initial,backward) {
  value = Number(value);
  if (isNaN(value)) {
    return initial;
  } else if (value < 0) {
    if (backward != undefined) {
      value = Math.abs(value)>backward ? 0 : backward+value;
      return value;
    } else {
      return initial;
    }
  } else {
    return value;
  }
}
function swap(array,i,j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
let idCount = 0;