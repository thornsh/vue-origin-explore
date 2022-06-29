let effectActive
const activeStack = []
const targetMap = new WeakMap()

function effect(fn) {
  const effectFn = () => {
    effectFn.deps.forEach(item => {
      item.delete(effectFn)
    })
    effectFn.deps.length = 0

    effectActive = effectFn
    activeStack.push(effectFn)
    fn()
    activeStack.pop()
    effectActive = activeStack[activeStack.length - 1]
  }

  effectFn.deps = []
  effectFn()
}

const obj = {
  message: 'aaa',
  tmp: '123',
  child: 'child',
  count: 1
}

function track(target, key) {
  if (!effectActive) {
    return
  }

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set())
  }

  dep.add(effectActive)
  effectActive.deps.push(dep)
}

function trigger(target, key) {
  // TODO key内容相等时
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const deps = depsMap.get(key)
  const newSet = new Set()
  deps.forEach(effectFn => {
    if (effectFn !== effectActive) {
      newSet.add(effectFn)
    }
  })
  newSet && newSet.forEach(fn => fn())
  // deps && deps.forEach(fn => fn())
}

const prox = new Proxy(obj, {
  get(target, key) {
    track(target, key)

    return target[key]
  },
  set(target, key, newValue) {
    target[key] = newValue

    trigger(target, key)
  }
})

// effect(() => {
//   console.log(prox.message === 'aaa' ? prox.tmp : false)
// })

// prox.message = 'bbb'
// prox.tmp = '456'

// effect(() => {
//   effect(() => {
//     console.log(prox.child, 'child')
//   })
//   console.log(prox.message, 'parent')
// })

// prox.message = 'bbb'

effect(() => {
  console.log(prox.count)
  prox.count++
})

