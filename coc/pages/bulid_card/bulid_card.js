// pages/bulid_card/bulid_card.js
var property_dict = {
  'str': 0, 'con': 1, 'siz': 2, 'dex': 3,
  'app': 4, 'pow': 5, 'int': 6, 'edu': 7,
  'luck': 8
}; 


Page({

  data: {
    action: 'none',
    result: '',
    point1: 1,
    point2: 1,
    point3: 1,

    age: 0,
    show_age_confirm: 'hidden', // 年龄确认的显示
    age_confirm_text: '', 
    age_switch: false,

    age_other: 'none', // 确认年龄后的处理
    age_content: '',
    age_other_list: [],

    that_dice: '/images/dice/dice_action.gif',
    
    property: [
      { name: '力量(3D6):', sum: 0, _type: 'str', status: 'roll', dice_lock: false },
      { name: '体质(3D6):', sum: 0, _type: 'con', status: 'roll', dice_lock: false }, 
      { name: '体型(3D6):', sum: 0, _type: 'siz', status: 'roll', dice_lock: false },
      { name: '敏捷(3D6):', sum: 0, _type: 'dex', status: 'roll', dice_lock: false },
      { name: '外貌(3D6):', sum: 0, _type: 'app', status: 'roll', dice_lock: false },
      { name: '意志(3D6):', sum: 0, _type: 'pow', status: 'roll', dice_lock: false },
      { name: '智力(2D6+6):', sum: 0, _type: 'int', status: 'roll', dice_lock: false},
      { name: '教育(2D6+6):', sum: 0, _type: 'edu', status: 'roll', dice_lock: false },
      { name: '幸运(3D6):', sum: 0, _type: 'luck', status: 'roll', dice_lock: false },
    ],
  },

// 应该有一个对阶段的判断，就是要按顺序来执行

// 骰子的主逻辑  对整个属性进行重新赋值，暂时没找到单独设置某个项的办法
  diceAction: function(e) {
    var index = e.currentTarget.dataset.id;

    if (index == 6 | index == 7) {  // 对第三个骰子的动图判断
      this.setData({
        that_dice: '/images/dice/dice_6.png',
      });
    } else {
      this.setData({ that_dice: '/images/dice/dice_action.gif' });
    };


    var pro = this.data.property;
    pro[index].status = pro[index].status === 'roll' ? 'stop' : 'roll';
    

    var a, r, p1, p2, p3;
    var s = pro.sum;
    a = this.data.action === '' ? 'none' : '';  // 显示或者隐蔽相关骰子
    r = this.data.result === 'none' ? '' : 'none';

    if (r === '') {  // 在roll之后才进行计算赋值
      p1 = this.rand1(6, 1);
      p2 = this.rand2();
      if (index == 6 | index == 7 ) {
        p3 = 6;
      } else {
        p3 = this.rand3(6);
      };
      s = (p1 + p2 + p3) * 5;
      pro[index].sum = s;
    }

    for (var i = 0; i < this.data.property.length; ++i) {  // 每次事件都触发锁
      if (i == index) {
        if (pro[i].sum != 0){
          pro[i].dice_lock = true;
        };
        continue
      };
      if (pro[i].sum == 0){
        pro[i].dice_lock = !pro[i].dice_lock;
      }
      else {
        pro[i].dice_lock = true;
      };
     
    };

    this.setData({
      action: a,
      result: r,
      point1: p1,
      point2: p2,
      point3: p3,
      property: pro,
    });

    
  },

// 年龄的主逻辑
  ageAction: function(e) {
    var value = e.detail.value;
    var t = '确认' + value + '岁？';
    this.setData({ 
      age: value,
      age_confirm_text: t,
      show_age_confirm: '',
       });
  },
  ageConfirm: function(e) {
    var age = this.data.age;
    var t = '好吧，你这个' + age + '岁的b';

    this.setData({
      age_content: t,
      age_switch: true,
      age_button: 'none',
      age_other: '',
    });
    this.handleAgeOther();
  },

  // 处理年龄带来的额外判断
  handleAgeOther: function() {
    var age = this.data.age;
    var punitive_point = 0;

    if (age < 20) {
      punitive_point = 5;
    } else if (age < 40) {
      punitive_point = 0;
    } else if (age < 50) {
      punitive_point = 5;
    } else if (age < 60) {
      punitive_point = 10;
    } else if (age < 70) {
      punitive_point = 20;
    } else if (age < 80) {
      punitive_point = 40;
    } else {
      punitive_point = 80;
    };
    console.log(punitive_point);

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