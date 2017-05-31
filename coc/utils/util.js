function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

function rand1(man, min) {
  return Math.floor(Math.random() * (max - min + 1) + 1);
}

module.exports.rand1 = rand1


function rand2() {
  var p_l = [6, 5, 4, 3, 2, 1];
  var i = Math.floor(Math.random() * 6);
  return p_l[i];
}

function rand3(number) {
  var today = new Date();
  var seed = today.getTime();
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / (233280.0);
  };
  return Math.ceil(rnd() * number);
}