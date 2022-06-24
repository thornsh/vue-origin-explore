let effectActive
const targetMap = new WeakMap()

function effect(fn) {
  effectActive = fn
  effectActive.deps = []
  console.log(effectActive.deps)
  fn()
}

const obj = {
  message: 'aaa',
  tmp: '123'
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

  deps.forEach(fn => fn())
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

effect(() => {
  console.log(prox.message === 'aaa' ? prox.tmp : false)
})

prox.message = 'bbb'
prox.tmp = '456'
