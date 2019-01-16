# 🐣 Pseudo Hash Map 

> Javascript map with support for non-primitive keys (i.e. tuple-like arrays, etc.) through pseudo-hashing (serialisation)


## Why?

Historically, Javascript has natively included very few useful data structures beyond primitives. As the prevalence of Node has increased the usage of Javascript outside the browser (i.e. server, cli, etc.), this has presented challenges when the goal is to implement more complex data structures, and algorithms that rely on them being efficient.

For example, in Python, if a programmer wanted to implement an xy-grid using a map (coordinates as keys, objects at those coordinates as values), they could use a dictionary with (x,y) tuples as keys. This is reasonable, because tuples are immutable and can be hashed.

This example does not translate well to Javascript due the mutability of arrays, and equality tested by object address.

The PseudoHashMap addresses this problem by internally serialising keys to a type that is considered equivalent by value (i.e. string or number).

For example:

```
// Doesn't work as desired
const map1 = new Map();
map1.set([1, 1], 'water')
map1.set([4, 20], 'plant')
map1.set([13, 37], 'super epic sword')
map1.set([13, 37], 'super epic shield')

console.table([...map1.entries()])  // Key [13, 37] is included twice!
// => 
// ┌─────────┬────────────┬─────────────────────┐
// │ (index) │     0      │          1          │
// ├─────────┼────────────┼─────────────────────┤
// │    0    │  [ 1, 1 ]  │       'water'       │
// │    1    │ [ 4, 20 ]  │       'plant'       │
// │    2    │ [ 13, 37 ] │ 'super epic sword'  │
// │    3    │ [ 13, 37 ] │ 'super epic shield' │
// └─────────┴────────────┴─────────────────────┘

const key = [7,4]
map1.set(key, 'poison')

map1.get(key)  // => 'poison'
map1.get([7, 4])  // => undefined, because key !== [7, 4]


// Works as desired
const map2 = new PseudoHashMap(JSON.stringify);
map2.set([4, 20], 'grass')
map2.set([4, 20], 'plant')

console.table([...map2.entries()])  // Key [4, 20] is included only once
// => 
// ┌─────────┬───────────┬─────────┐
// │ (index) │     0     │    1    │
// ├─────────┼───────────┼─────────┤
// │    0    │ [ 4, 20 ] │ 'plant' │
// └─────────┴───────────┴─────────┘

map2.get([4, 20])  // => 'plant'

// Hooray, it works!
// Man, that's dope!
```

## API

Aside from the constructor, `PseudoHashMap` behaves identically to the [ES6 native Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) (through class extension).

### constructor(serialise, iterable)

| Parameter | Description |
| --- | --- |
| serialise(originalKey) | The serialise function that takes the original key as an argument and returns the primitive key (pseudo-hash) to be used internally - unlike a true hash, **this must be unique** |
| iterable | As per ES6 Map's [`iterable` argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Parameters), an array or other iterable whose elements are key-value pairs (arrays with two elements, e.g. `[[ 1, 'one' ],[ 2, 'two' ]]`). Each key-value pair is added to the new Map; null values are treated as undefined.

**Note:** String processing can be slow, so where possible, it can be better if the serialise function returns an integer

### Other methods

**Note:** Where a key is produced, the method returns the original key. I.e.

```
const map1 = new Map();
map1.set([1, 1], 'water')
map1.set([4, 20], 'plant')
map1.set([13, 37], 'super epic sword')


console.table([...map.entries()]) => 
// ┌─────────┬────────────┬────────────────────┐
// │ (index) │     0      │         1          │
// ├─────────┼────────────┼────────────────────┤
// │    0    │  [ 1, 1 ]  │      'water'       │
// │    1    │ [ 4, 20 ]  │      'plant'       │
// │    2    │ [ 13, 37 ] │ 'super epic sword' │
// └─────────┴────────────┴────────────────────┘
```