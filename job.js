export const jobQueue = new Set()
const resolve = Promise.resolve()
let tigger = false

export function flushJob() {
  if (tigger) {
    return
  }
  tigger = true
  jobQueue.forEach(job => {
    resolve.then(() => {
      job()
    }).finally(() => {
      tigger = false
    })
  })
}
