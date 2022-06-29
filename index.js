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

effect(() => {
  console.log(proxyTest.name)
  proxyTest.age++
}, {
  schedule(fn) {
    jobQueue.add(fn)
    flushJob()
  }
})

proxyTest.name = 'bbb'
proxyTest.name = 'ccc'
