'use strict';
class MyInterval {

  constructor(opt) {
    let def = {
      loops: 20,
      onUpdate: function () { }, // 更新时回调函数
      //onComplete: function () { } // 完成时回调函数
    }
    this.opt = Object.assign(def, opt);//assign传入配置参数
    this.loopCount = 0;//循环次数计数
    this.loops = this.opt.loops;//总刷新次数
    this.interval = null;//计时器对象
    this.init();
  };

  init() {
    this.interval = setInterval(() => { this.updateTimer() }, 75);
  };

  updateTimer() {
    this.loopCount++;
    if (this.loopCount >= this.loops) {
      clearInterval(this.interval);
      //this.opt.onComplete();
    }
    this.opt.onUpdate();
  };
}
export default MyInterval;