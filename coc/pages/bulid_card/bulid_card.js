// pages/bulid_card/bulid_card.js

Page({
  
// 把三个随机数函数放到工具那里去
  data: {
    action: '',
    result: 'none',
    point1: 1,
    point2: 1,
    point3: 1,
    sum: 0,

  },

  DiceAction: function (e) {
    var a, r, p1, p2, p3;
    var s = this.sum
    a = this.data.action === '' ? 'none' : '';
    r = this.data.result === 'none' ? '' : 'none';

    p1 = this.rand1(6, 1);
    p2 = this.rand2();
    p3 = this.rand3(6);
    if (r === '') {
      s = p1 + p2 + p3;
    }
    this.setData({
      action: a,
      result: r,
      point1: p1,
      point2: p2,
      point3: p3,
      sum: s,
    });

  },

  rand1: function (max, min) {
    return Math.floor(Math.random() * (max - min + 1) + 1);
  },
  rand2: function () {
    var p_l = [6, 5, 4, 3, 2, 1];
    var i = Math.floor(Math.random() * 6);
    return p_l[i];
  },

  rand3: function (number) {
    var today = new Date();
    var seed = today.getTime();
    function rnd() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / (233280.0);
    };
    return Math.ceil(rnd() * number);
  },




})