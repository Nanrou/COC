// pages/bulid_card/bulid_card.js
var s = 1;
var that = this;



Page({

// 把三个随机数函数放到工具那里去
  data: {
    action: 'none',
    result: '',
    point1: 1,
    point2: 1,
    point3: 1,
    
    property: [
      { name: '力量(3D6):', sum: 0, _type: 'str', status: 'roll' },
      { name: '体质(3D6):', sum: 0, _type: 'con', status: 'roll' }, 
      { name: '体型(3D6):', sum: 0, _type: 'siz', status: 'roll' },
      { name: '敏捷(3D6):', sum: 0, _type: 'dex', status: 'roll' },
      { name: '外貌(3D6):', sum: 0, _type: 'app', status: 'roll' },
      { name: '意志(3D6):', sum: 0, _type: 'pow', status: 'roll' },
      { name: '智力(2D6+6):', sum: 0, _type: 'int', status: 'roll' },
      { name: '教育(2D6+6):', sum: 0, _type: 'edu', status: 'roll' },
      { name: '幸运(3D6):', sum: 0, _type: 'luck', status: 'roll' },
    ],
  },


  DiceAction: function (e) {
    var index = e.currentTarget.dataset.id;
    var pro = this.data.property[index];
    pro.status === 'roll' ? 'stop' : 'roll';
    console.log(pro);

    var a, r, p1, p2, p3;
    var s = pro.sum;
    a = this.data.action === '' ? 'none' : '';
    r = this.data.result === 'none' ? '' : 'none';

    if (r === '') {
      p1 = this.rand1(6, 1);
      p2 = this.rand2();
      p3 = this.rand3(6);
      s = p1 + p2 + p3;
    }
    this.setData({
      action: a,
      result: r,
      point1: p1,
      point2: p2,
      point3: p3,
    },
    
    );
  },


// product random
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