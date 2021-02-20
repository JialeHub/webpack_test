/* eslint-disable */
import $ from 'jQuery'
console.log($)

function sum(...args) {
  return args.reduce((p, c) => p + c, 0)
}

console.log(sum(1,2,3))

