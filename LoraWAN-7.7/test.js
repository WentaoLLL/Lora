const _ = require('lodash');
var a = [
    { type: 1, times: '2021-01-01', value: 2, devices: 2 },
    { type: 2, times: '2021-01-01', value: 3, devices: 4 },
    { type: 1, times: '2021-02-01', value: 4, devices: 5 },
    { type: 2, times: '2021-01-01', value: 5, devices: 6 },
]
console.log(_.groupBy(a, function(i) {
    return i.times + '_' + i.type
}))

const b = a.filter(i => {
    if (i.type == 1) return true;
    return false;
})
console.log(b)