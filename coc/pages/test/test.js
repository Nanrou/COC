// pages/test/test.js

import NumberAnimate from "../../utils/NumberAnimate";
import MyInterval from "../../utils/MyInterval"


Page({
  data:{
    num1: '',
    num2: '',
    num3: '',
    num1Complete: '',
    num2Complete: '',
    num3Complete: ''
  },


  animate: function () {
    let num1 = 18362.856;
    let n1 = new NumberAnimate({
      from: num1,//开始时的数字
      speed: 2000,// 总时间
      refreshTime: 100,//  刷新一次的时间
      decimals: 3,//小数点后的位数
      onUpdate: () => {//更新回调函数
        this.setData({
          num1: n1.tempValue
        });
      },
      onComplete: () => {//完成回调函数
        this.setData({
          num1Complete: " 完成了"
        });
      }
    });

    let n2 = new MyInterval({
      loops: this.rand1(30, 20),
      onUpdate: () => {
        var tmp = this.rand3(10) - 1;
        this.setData({ 
          num2: tmp,
          });
          console.log(tmp);
      },
    });

    let n3 = new MyInterval({
      loops: this.rand1(30, 20),
      onUpdate: () => {
        var tmp = this.rand3(10) - 1;
        this.setData({
          num3: tmp,
        });
      },
    });

  },

  rand1: function (max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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