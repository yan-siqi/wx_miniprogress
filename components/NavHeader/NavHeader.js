// components/NavHeader/NavHeader.js
Component({
  /**
   * 组件的属性列表,类似于vue的props,组件内部向组件外部导入的数据
   */
  properties: {
    /* 
    定义传入单个属性 使用type 但是指定多个类型
     */
    title: {
      type: String,
      value:'',
    },
    nav:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})