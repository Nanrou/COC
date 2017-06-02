// pages/bulid_card/bulid_card.js

import MyInterval from "../../utils/MyInterval"

var property_dict = {
  'str': 0, 'con': 1, 'siz': 2, 'dex': 3,
  'app': 4, 'pow': 5, 'int': 6, 'edu': 7,
  'luck': 8
}; 

var edu_check = false;


Page({

  data: {
    toView: '',

    common_dice: '', // 显示普通骰子
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

    age_handler1: 'none', // 处理20岁以下的
    age_handler2: 'none', // 处理20岁以下的

    age_handler3: 'none', // 处理20岁以上的
    age_handler4: 'none', // 处理20岁以上的
    age_handler5: 'none', // 处理20岁以上的

    age_explanation: '',
    age_button_text: 'roll roll roll',
    age_result: '',

    dice100: 'none', // 显示100骰子
    dice100_decade: 0,
    dice100_single: 0,

    dice100_button:false,


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

// 骰子的主逻辑  需要对整个属性进行重新赋值，暂时没找到单独设置某个项的办法
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
    var s = pro[index].sum;
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
    var t = '好的，让我们来看看' + age + '岁这个年龄对你的影响';

    this.setData({
      age_content: t,
      age_switch: true,
      age_button: 'none',
      age_other: '',

      common_dice: 'none',
      dice100: '',

    });
    this.handleAgeOther();

    this.setData({toView: 'footer'});  // 定位到底部
  },

  // 处理年龄带来的额外判断
  handleAgeOther: function() {
    var age = this.data.age;
    var punitive_point = 0;

    if (age < 20) {
      punitive_point = 5;
      this.handlerAge1(age);
    } else if (age < 40) {
      punitive_point = 0;
      this.handlerAge2(age, 1, 0, 0);
    } else if (age < 50) {
      punitive_point = 5;
      this.handlerAge2(age, 2, 5, 5);
    } else if (age < 60) {
      punitive_point = 10;
    } else if (age < 70) {
      punitive_point = 20;
    } else if (age < 80) {
      punitive_point = 40;
    } else {
      punitive_point = 80;
    };
  },

  handlerAge1: function(age) {
    var t = '由于你才' + age + '岁，所以你的力量、体型和教育各减5点，不过运气可以再投一次骰子，看能不能再高一些';

    this.setData({
      age_explanation: t,
      point1: 1,
      point2: 1,
      point3: 1,
      age_handler1: '',
    });
  },

  handlerAge1Dice: function(e) {

    var age_button_text = this.data.age_button_text === 'roll roll roll' ? 'stop' : 'roll roll roll';

    var a, r, p1, p2, p3;
    var pro = this.data.property
    var ex_luck = pro[8].sum;
    a = this.data.action === '' ? 'none' : '';  // 显示或者隐蔽相关骰子
    r = this.data.result === 'none' ? '' : 'none';

    this.setData({
      action: a,
      result: r,
      age_button_text: age_button_text,
    });
    if (r === '') {  // 在roll之后才进行计算赋值
      p1 = this.rand1(6, 1);
      p2 = this.rand2();
      p3 = this.rand3(6);
      var luck = (p1 + p2 + p3) * 5;
      luck = luck > ex_luck ? luck : ex_luck;
      pro[8].sum = luck;

      pro[0].sum = pro[0].sum - 5;
      pro[2].sum = pro[2].sum - 5;
      pro[7].sum = pro[7].sum - 5;

      var age_result = '好了，你现在幸运是' + luck + '了，然后力量是' + pro[0].sum + '，体质是' + pro[2].sum + '，教育是' + pro[7].sum ;

      this.setData({
        point1: p1,
        point2: p2,
        point3: p3,
        age_handler1: 'none',
        age_handler2: '',
        age_result: age_result,
        property: pro,
      });
    };
  },


  handlerAge2: function(age, edu_times, ppoint, app_ppoint) {
    var t = '由于你已经' + age + '岁了，所以可以对教育进行' + edu_times + '次成长检定';
    if (ppoint > 0) {
      t = t + '，不过你的力量体质敏捷合计需要减少' + ppoint + '点，外貌减少' + app_ppoint + '点'
    };
    this.setData({
      age_explanation: t,
      age_handler3: '',
    });


  },

  handlerAge2Dice: function (e) {
    this.setData({ dice100_button: true });
    this.handlerDice100();  // 这里导致了异步


    setTimeout( this.eduCheck , 3000 );  // 用延时去等待

   },

   eduCheck: function() {  // 进行edu的check
     var edu_check_num = this.data.dice100_decade * 10 + this.data.dice100_single;
     var pro = this.data.property;
     var t;

     if (edu_check_num > pro[7].sum) {
       t = 'check成功 看来年纪大的吃的盐是多一点';
       edu_check = true;
     } else {
       t = 'check失败';
     };

     this.setData({
       age_result: t,
       age_handler3: 'none',
       age_handler4: '',
     });

     if (edu_check) {
       this.setData({
         age_handler5: '',
         dice100_button: false,
       });
     };

     this.setData({ toView: 'footer' });  // 定位到底部

   },

  addEdu:function() {  // 增加edu的处理方法
    this.setData({
      dice100_decade: 0, 
      dice100_single: 0,
      dice100_button: true,
    });

    this.handlerDice10();

    setTimeout(() => {
      var pro = this.data.property;
      var point = this.data.dice100_decade * 10 + this.data.dice100_single;
      var edu = pro[7].sum + point;
      pro[7].sum = edu > 100 ? 99 : edu;

      var t = '好了，你的edu现在是' + pro[7].sum;
      this.setData({
        property: pro,
        age_result: t,
        age_handler5: 'none',
      });
      }, 2000);
     },

   handlerDice100: function() {

     var dec = new MyInterval({ // 设置十位数
       loops: this.rand1(30, 20),
       onUpdate: () => {
         this.setData({
           dice100_decade: this.rand3(10) - 1,
         });
       },
     });

     var sin = new MyInterval({  // 设置个位数
       loops: this.rand1(30, 20),
       onUpdate: () => {
         this.setData({
           dice100_single: this.rand3(10) - 1,
         });
       },
     });
   },

   handlerDice10: function() { // 处理十面骰
     var sin = new MyInterval({ // 设置个位数
       loops: this.rand1(20, 10),
       onUpdate: () => {
         var tmp = this.rand3(10) - 1;
         if (tmp == 0){
           this.setData({
             dice100_decade: 1,
             dice100_single: tmp,
           });
         } else {
           this.setData({
             dice100_decade: 0,
             dice100_single: tmp,
           });
         };
       },
     });
   },


// product random
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