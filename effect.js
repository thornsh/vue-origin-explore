import { targetMap } from "./dep.js"

export let activeEffect
const activeStack = []

export function effect(fn, options = {}) {
  const effectFn = () => {
    console.log('触发')
    cleanUp(effectFn)
    activeEffect = effectFn

    activeStack.push(effectFn)
    const res = fn()
    activeStack.pop()
    activeEffect = activeStack[activeStack.length - 1]

    return res
  }

  effectFn.deps = []
  effectFn.options = options

  if (!options.lazy) {
    effectFn()
  }
  
  return effectFn
}

export function track(target, key) {
  if (!activeEffect) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = new Set())
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

export function tigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  const deps = depsMap.get(key)
  const setDeps = new Set()
  deps.forEach(dep => {
    if (dep !== activeEffect) {
      setDeps.add(dep)
    }
  })
  setDeps && setDeps.forEach(fn => {
    if (fn.options.schedule) {
      fn.options.schedule(fn)
    } else {
      fn()
    }
  })
}

function cleanUp(effectFn) {
  const deps = effectFn.deps
  deps.forEach(dep => {
    if (dep.has(effectFn)) {
      dep.delete(effectFn)
    }
  })
  deps.length = 0
}
