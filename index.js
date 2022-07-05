import { computed } from "./computed.js"
import { effect, tigger, track } from "./effect.js"
import { flushJob, jobQueue } from "./job.js"

const test = {
  name: 'test',
  age: 18
}

const proxyTest = new Proxy(test, {
  get(target, key) {
    track(target, key)

    return target[key]
  },
  set(target, key, newValue) {
    target[key] = newValue
    tigger(target, key)
    return true
  }
})

// const res = effect(() => {
//   console.log(proxyTest.name)
//   proxyTest.age++

//   return 11
// }, {
//   // schedule(fn) {
//   //   jobQueue.add(fn)
//   //   flushJob()
//   // },
//   lazy: true,
// })

// console.log(res())

// proxyTest.name = 'bbb'
// proxyTest.name = 'ccc'

// const com = computed(() => {
//   console.log(111)
//   return proxyTest.name + proxyTest.age
// })

// console.log(com.value)

// proxyTest.age = 19

effect(() => {
  const res = computed(() => {
    return proxyTest.name + proxyTest.age
  })
  console.log(res.value)
})

proxyTest.age = 2

