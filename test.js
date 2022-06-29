const set = new Set([1,2,3])

const set2 = new Set(set)

set2.delete(2)

set2.delete(3)

set2.delete(1)

console.log(set)

console.log(set2)
