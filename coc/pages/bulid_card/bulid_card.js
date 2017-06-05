// pages/bulid_card/bulid_card.js

import MyInterval from "../../utils/MyInterval"

var property_dict = {
  'str': 0, 'con': 1, 'siz': 2, 'dex': 3,
  'app': 4, 'pow': 5, 'int': 6, 'edu': 7,
  'luck': 8
}; 
var property_list = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var edu_check = false;

var fixed_min_list = []; //fixed_str, fixed_con, fixed_dex;
var current_value_list = []; 
var edu_times, ppoint, app_ppoint;
var edu_chcek_fail_text = 'check 失败';


Page({

  data: {
    toView: '',

    common_dice: false, // 显示普通骰子
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
    age_handler6: 'none', // 处理20岁以上的
    age_handler7: 'none', // 处理20岁以上的

    age_explanation: '',
    edu_result_text: '',
    age_button_text: 'roll roll roll',
    age_result: '',

    dice100: 'none', // 显示100骰子
    dice100_decade: 0,
    dice100_single: 0,

    dice100_button:false,
    age_edu_check_times: 1,

    //惩罚点数
    punitive_point_part: true, // 显示调属性
    punitive_point: 5,
    remain_point: 0,

    str_punitive_point_min: 0,
    str_punitive_point_max: 50,

    con_punitive_point_min: 0,
    con_punitive_point_max: 50,

    dex_punitive_point_min: 0,
    dex_punitive_point_max: 50,

    punitive_point_button: true,



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
      pro[index].sum = s = p1 + p2 + p3;
      property_list[index] = s * 5;
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
      edu_times = 1;
      ppoint = 0;
      app_ppoint = 0;
      this.handlerAge2(age, edu_times, ppoint, app_ppoint);
    } else if (age < 50) {
      edu_times = 2;
      ppoint = 5;
      app_ppoint = 5;
      this.handlerAge2(age, 2, 5, 5);
    } else if (age < 60) {
      edu_times = 3;
      ppoint = 10;
      app_ppoint = 10;
      this.handlerAge2(age, edu_times, ppoint, app_ppoint);
    } else if (age < 70) {
      edu_times = 4;
      ppoint = 20;
      app_ppoint = 15;
      this.handlerAge2(age, edu_times, ppoint, app_ppoint);
    } else if (age < 80) {
      edu_times = 4;
      ppoint = 40;
      app_ppoint = 20;
      this.handlerAge2(age, edu_times, ppoint, app_ppoint);
    } else {
      edu_times = 4;
      ppoint = 80;
      app_ppoint = 25;
      this.handlerAge2(age, edu_times, ppoint, app_ppoint);
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
    var pro = property_list;
    var ex_luck = pro[8];
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
      pro[8] = luck;

      pro[0] = pro[0] - 5;
      pro[2] = pro[2] - 5;
      pro[7] = pro[7] - 5;

      var age_result = '好了，你现在幸运是' + luck + '了，然后力量是' + pro[0] + '，体质是' + pro[2] + '，教育是' + pro[7] ;

      this.setData({
        point1: p1,
        point2: p2,
        point3: p3,
        age_handler1: 'none',
        age_handler2: '',
        age_result: age_result,
      });

      this.setData({ toView: 'footer' });  // 定位到底部
    };
  },


  handlerAge2: function(age, edu_times, ppoint, app_ppoint) {
    var t = '由于你已经' + age + '岁了，所以可以对教育进行' + edu_times + '次成长检定';
    if (ppoint > 0) {
      t = t + '，不过你的力量体质敏捷合计需要减少' + ppoint + '点，外貌减少' + app_ppoint + '点'
    };
    var tt = '现在你的edu是' + property_list[7];
    this.setData({
      age_explanation: t,
      edu_result_text: tt,
      age_handler3: '',
      age_handler4: '',

      common_dice: true,
      dice100: '',
    });


  },

  handlerAge2Dice: function (e) {
    this.setData({ dice100_button: true });
    this.handlerDice100();  // 这里导致了异步

    setTimeout( this.eduCheck , 2800 );  // 用延时去等待

   },

   eduCheck: function() {  // 进行edu的check
     var edu_check_num = this.data.dice100_decade * 10 + this.data.dice100_single;
     var pro = property_list;
     var t;

     if (edu_check_num > pro[7]) {
       t = 'check成功 看来年纪大的吃的盐是多一点';
       edu_check = true;
     } else {
       t = edu_chcek_fail_text = edu_chcek_fail_text + ' again';
     };

     this.setData({
       age_button_text: '现在来看看你吃了多少盐',
       age_result: t,
       age_handler4: 'none',
       age_handler5: '',
     });

     if (edu_check) {
       this.setData({
         age_handler6: '',
         dice100_button: false,
       });
     } else {
       this.cirEduCheck();
       this.setData({
         age_button_text: 'roll again~',
       });
     };
     this.setData({ toView: 'footer' });  // 定位到底部
   },

  cirEduCheck: function() {  // edu循环判断
    var check_time = this.data.age_edu_check_times;
    check_time = check_time + 1;
    if (check_time <= edu_times) {
      this.setData({
        age_edu_check_times: check_time,
        age_handler4: '',
        age_button_text: 'roll roll roll',
        dice100_button: false,
      });
    } else {
      this.setData({
        age_handler3: 'none',
        age_handler4: 'none',
        age_handler5: 'none', 
        age_handler6: 'none',
        age_content: '',
        age_explanation: '',

        age_handler7: '',
      });
      if (ppoint != 0){
        this.setData({ punitive_point_part: false });
        this.buildPunitivePoint();
      };
      
    };
    this.setData({ toView: 'footer' });  // 定位到底部
   },


  addEdu: function() {  // 增加edu的处理方法
    this.setData({
      dice100_decade: 0, 
      dice100_single: 0,
      dice100_button: true,
    });

    this.handlerDice10();

    setTimeout(() => {
      var pro = property_list;
      var point = this.data.dice100_decade * 10 + this.data.dice100_single;
      var edu = pro[7] + point;
      pro[7] = edu > 100 ? 99 : edu;

      var t = 'nice，你的edu增加了' + point + '，现在是' + pro[7]; 

      edu_check = false;

      this.setData({
        age_handler5: 'none',
        age_handler6: 'none',
        edu_result_text: t,
      });
      this.cirEduCheck();
      }, 2000);
     },

   handlerDice100: function() {

     var dec = new MyInterval({ // 设置十位数
       loops: this.rand3(10) + 20,
       onUpdate: () => {
         this.setData({
           dice100_decade: this.rand1(10,1) - 1,
         });
       },
     });

     var sin = new MyInterval({  // 设置个位数
       loops: this.rand3(10) + 20,
       onUpdate: () => {
         this.setData({
           dice100_single: this.rand1(10,1) - 1,
         });
       },
     });
   },

   handlerDice10: function() { // 处理十面骰
     var sin = new MyInterval({ // 设置个位数
       loops: this.rand3(10) + 10,
       onUpdate: () => {
         var tmp = this.rand1(10, 1) - 1;
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


// 设置惩罚点
  buildPunitivePoint: function() {

    this.setData({
      punitive_point: ppoint,
      remain_point: ppoint,
    });

    var llist = [0, 1, 3];
    var pro = property_list;
    var min_list = ['str_punitive_point_min', 'con_punitive_point_min', 'dex_punitive_point_min'];
    var max_list = ['str_punitive_point_max', 'con_punitive_point_max', 'dex_punitive_point_max'];

    for (var i = 0; i < llist.length; i++)
    {
      var setpoint = {};
      current_value_list[i] = setpoint[max_list[i]] = pro[i];
      fixed_min_list[i] = setpoint[min_list[i]] = setpoint[max_list[i]] - ppoint;
      this.setData(setpoint);
    };
   },


// 处理滑动条
  punitivePointHeadler: function(e) {
    var index = e.currentTarget.dataset.index;

    var max_list = [this.data.str_punitive_point_max, this.data.con_punitive_point_max, this.data.dex_punitive_point_max];
    var ppoint = current_value_list[index] - e.detail.value;

    console.log(current_value_list[index], '-', e.detail.value, '=', ppoint);

    current_value_list[index] = e.detail.value;

    //var ppoint = max_list[index] - e.detail.value; //用掉的惩罚点
    var remain_ppoint = this.data.remain_point - ppoint; //剩下的惩罚点

    console.log(this.data.remain_point, '-', ppoint, '=', remain_ppoint );

    //var min_list = [this.data.str_punitive_point_min, this.data.con_punitive_point_min, this.data.dex_punitive_point_min];
    var min_list_name = ['str_punitive_point_min', 'con_punitive_point_min', 'dex_punitive_point_min'];

    this.setData({ remain_point: remain_ppoint });

    var setpoint = {};
    for (var i = 0; i < 3; i++)
    {
      if (i == index){ continue };
      
      setpoint[min_list_name[i]] = fixed_min_list[i] + 
      (this.data.punitive_point - remain_ppoint) +  
      current_value_list[i] - max_list[i];
      // 固定的下限值 + 已经使用掉的惩罚点 + 已使用的区间 
    };
    console.log(setpoint);

    this.setData(setpoint);

    if (remain_ppoint == 0){
      this.setData({ punitive_point_button: false });
    }else {
      this.setData({ punitive_point_button: true });
    };
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