"use strict";
exports.__esModule = true;
exports.toArray = exports.sorted = exports.reverse = exports.toSet = exports.updated = exports.takeWhile = exports.takeRight = exports.take = exports.sum = exports.range = exports.removeAt = exports.remove = exports.max = exports.flatMap = exports.insert = exports.indexWhere = exports.groupBy = exports.diff = exports.distinct = exports.count = exports.compact = exports.flatten = exports.findFirst = exports.find = void 0;
function find(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            return arr[i];
    }
}
exports.find = find;
;
function findFirst(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            return arr[i];
    }
    return undefined;
}
exports.findFirst = findFirst;
;
function flatten(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push.apply(result, arr[i]);
    }
    return result;
}
exports.flatten = flatten;
;
function compact(arr) {
    return arr.filter(function (x) { return x ? true : false; });
}
exports.compact = compact;
;
function count(arr, predicate) {
    return arr.filter(predicate).length;
}
exports.count = count;
;
function distinct(arr, keyFunction) {
    keyFunction = keyFunction || (function (x) { return x; });
    var set = {};
    var result = [];
    arr.forEach(function (item) {
        var key = keyFunction(item);
        if (!set[key]) {
            set[key] = 1;
            result.push(item);
        }
    });
    return result;
}
exports.distinct = distinct;
;
function diff(arr, other, keyFunction) {
    keyFunction = keyFunction || (function (x) { return x; });
    var result = [];
    var otherKeys = toSet(other.map(keyFunction));
    arr.forEach(function (item) {
        var otherKey = otherKeys[keyFunction(item)];
        if (!otherKey)
            result.push(item);
    });
    return result;
}
exports.diff = diff;
;
function groupBy(arr, discriminator) {
    var groups = {};
    for (var i = 0; i < arr.length; i++) {
        var elem = arr[i];
        var key = discriminator(elem);
        if (!groups[key])
            groups[key] = [];
        groups[key].push(elem);
    }
    return groups;
}
exports.groupBy = groupBy;
;
function indexWhere(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            return i;
    }
    return -1;
}
exports.indexWhere = indexWhere;
;
function insert(arr, index, elem) {
    var copy = arr.slice();
    copy.splice(index, 0, elem);
    return copy;
}
exports.insert = insert;
;
function flatMap(arr, fn) {
    return flatten(arr.map(fn));
}
exports.flatMap = flatMap;
;
function max(arr) {
    return Math.max.apply(null, arr);
}
exports.max = max;
;
function remove(arr, elem) {
    return arr.filter(function (x) { return x != elem; });
}
exports.remove = remove;
;
function removeAt(arr, indexToRemove) {
    return arr.filter(function (_, index) { return index != indexToRemove; });
}
exports.removeAt = removeAt;
function range(start, stop, step) {
    if (arguments.length == 1) {
        stop = arguments[0] - 1;
        start = 0;
    }
    step = step || 1;
    var items = [];
    var next = start;
    var increasing = (step > 0);
    while ((increasing && next <= stop) || (!increasing && next >= stop)) {
        items.push(next);
        next = next + step;
    }
    return items;
}
exports.range = range;
;
function sum(arr) {
    return arr.reduce(function (a, b) { return a + b; }, 0);
}
exports.sum = sum;
;
function take(arr, n) {
    return arr.slice(0, n);
}
exports.take = take;
;
function takeRight(arr, n) {
    return (arr.length < n)
        ? arr.slice(0)
        : arr.slice(arr.length - n);
}
exports.takeRight = takeRight;
;
function takeWhile(arr, predicate) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            result.push(arr[i]);
        else
            break;
    }
    return result;
}
exports.takeWhile = takeWhile;
;
function updated(arr, index, elem) {
    if (index < 0)
        return arr;
    var copy = arr.slice();
    copy[index] = elem;
    return copy;
}
exports.updated = updated;
;
function toSet(arr) {
    var result = {};
    for (var i = 0; i < arr.length; i++) {
        result[arr[i].toString()] = true;
    }
    return result;
}
exports.toSet = toSet;
;
function reverse(arr) {
    var result = arr.slice();
    result.reverse();
    return result;
}
exports.reverse = reverse;
;
function sorted(arr, options) {
    var o = options || {}, by = o.by !== undefined ? o.by : null, localeCompare = o.localeCompare !== undefined ? o.localeCompare : false, ignoreCase = o.ignoreCase !== undefined ? o.ignoreCase : false, reverse = o.reverse !== undefined ? o.reverse : false, result = [], mapped = [], missingData = [], sortFunction, item;
    for (var i = 0, length_1 = arr.length; i < length_1; i++) {
        item = arr[i];
        if (by && item)
            item = by(item);
        if (item === null || item === undefined || (typeof item === 'string' && item.toString() === '')) {
            missingData.push(item);
            continue;
        }
        mapped.push({
            index: i,
            value: ignoreCase ? item.toString().toUpperCase() : item
        });
    }
    if (localeCompare) {
        sortFunction = function (a, b) {
            if (a.value !== b.value) {
                var sa = a.value.toString();
                var sb = b.value.toString();
                return sa.localeCompare(sb);
            }
            return a.index < b.index ? -1 : 1;
        };
    }
    else {
        sortFunction = function (a, b) {
            if (a.value !== b.value) {
                return (a.value < b.value) ? -1 : 1;
            }
            return a.index < b.index ? -1 : 1;
        };
    }
    mapped.sort(sortFunction);
    for (var i = 0, length_2 = mapped.length; i < length_2; i++) {
        result.push(arr[mapped[i].index]);
    }
    if (missingData.length)
        result = result.concat(missingData);
    if (reverse)
        result.reverse();
    return result;
}
exports.sorted = sorted;
;
function toArray(arrayLike) {
    return [].slice.call(arrayLike);
}
exports.toArray = toArray;
;
//# sourceMappingURL=array.js.map