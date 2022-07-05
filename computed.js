import { effect, tigger, track } from "./effect.js";

export function computed(getter) {
  let oldValue
  let isUpdate = true
  const res = effect(getter, {
    lazy: true,
    schedule() {
      isUpdate = true
      tigger(obj, 'value')
    }
  })

  const obj = {
    get value() {
      track(obj, 'value')
      if (isUpdate) {
        oldValue = res()
        isUpdate = false
      }
      return oldValue
    }
  }

  return obj
}
