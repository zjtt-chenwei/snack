<template>
  <div>
    <Row>
      <Col :span="16" style="padding: 15px 15px;z-index:2;text-align:left;">
        <Form :inline="true">
          <Form-item>
            <span>状态：</span>
            <Select v-model="filters.onlineState" style="width:200px;">
              <Option :value="-1">全部</Option>
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item>
            <Button type="primary" v-on:click="query">查询</Button>
          </Form-item>
        </Form>
      </Col>
      <Col :span="8" style="padding: 15px 15px;z-index:2;text-align:left;">
        <Button type="info" @click="add()">新增商品</Button>
      </Col>
    </Row>
    <Card style="width: 100%;" dis-hover class="card">
      <p slot="title" style="text-align:left">
        <Icon type="ios-film-outline"></Icon>商品管理
      </p>
      <!--列表-->
      <Table
        :data="shopsList.slice(filter.page*filter.size, ((filter.page+1)*filter.size))"
        :columns="columnshops"
        highlight-current-row
        style="width: 100%;height:100%"
      ></Table>

      <!--工具条-->
      <Row class-name="page-box">
        <Col :span="24">
          <Page
            :show-total="true"
            show-sizer
            :show-elevator="true"
            :total="total"
            :page-size="filter.size"
            :current="filter.page + 1"
            class="pageTable"
            @on-page-size-change="onPageSizeChange"
            @on-change="changePage"
          ></Page>
        </Col>
      </Row>
    </Card>
    <Modal v-model="isOpen" width="300" :closable="false" footer-hide class="modal">
      <img :src="form.img" style="width:100%;" />
    </Modal>
    <Modal title="新增/编辑商品" :mask-closable="false" v-model="addEditShow">
      <Form :model="form" ref="addEditForm" :rules="rules" :label-width="80">
        <FormItem prop="name" label="零食名称">
          <Input class="wd300" maxlength="10" v-model="form.name" placeholder="请输入零食名称"></Input>
        </FormItem>
        <FormItem prop="intro" label="零食简介">
          <Input
            class="wd300"
            type="textarea"
            maxlength="50"
            :autosize="{minRows: 2,maxRows: 5}"
            v-model="form.intro"
            placeholder="请输入零食简介"
          ></Input>
        </FormItem>
        <FormItem prop="price" label="零食单价">
          <InputNumber
          :formatter="value => value.toFixed(2)" :active-change="false"
          :min="0" class="wd300" v-model="form.price" placeholder="请输入零食单价"></InputNumber>
        </FormItem>
        <FormItem prop="amount" label="库存数量">
          <InputNumber :formatter="value => value.toFixed(0)" :min="0" class="wd300" v-model="form.amount" placeholder="请输入库存数量"></InputNumber>
        </FormItem>
        <FormItem prop="productTime" label="生产日期">
          <DatePicker v-model="form.productTime" type="date" :options="options" placeholder="选择生产日期" class="wd300"></DatePicker>
        </FormItem>
        <FormItem prop="storeTime" label="保质期">
          <InputNumber :min="0" :formatter="value => value.toFixed(0)" class="wd300" v-model="form.storeTime" placeholder="请输入保质期"></InputNumber>
        </FormItem>
        <FormItem prop="img">
          <Upload
            :style="{width:'140px',float:'left'}"
            :before-upload="handleUpload"
            action="//jsonplaceholder.typicode.com/posts/"
          >
            <Button>上传零食图片</Button>
          </Upload>
          <img :src="form.img" style="width；30px;height: 30px;" @click="isOpen = true" />
        </FormItem>
      </Form>
      <div slot="footer" class="modal-footer">
        <Button type="primary" @click="addEdit">提交</Button>
        <Button type="error" @click="cancle">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import utils from '@/common/utils'
export default {
  data() {
    const checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('零食名称不能为空'))
      } else {
        if (/^\s+$/.test(value)) {
          callback(new Error('零食名称不能为空格'))
        }
        callback()
      }
    }
    const checkIntro = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('零食介绍不能为空'))
      } else {
        if (/^\s+$/.test(value)) {
          callback(new Error('零食介绍不能为空格'))
        }
        callback()
      }
    }
    return {
      shops: '',
      shopsList: [], // 展示的数据
      shopsData: [], // 该商家所拥有的商品
      total: 0,
      filter: {
        page: 0,
        size: 10
      }, // 翻页条件
      filters: {
        onlineState: -1,
      }, // 查询条件
      isOpen: false,
      img: '',
      addEditType: 'add',
      addEditShow: false,
      form: {
        id: '',
        ownerId: '',
        name: '',
        intro: '',
        price: 0,
        amount: 0,
        productTime: '',
        storeTime: 0,
        img: '',
        isSafe: ''
      },
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        intro: [
          { validator: checkIntro, trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传零食图片', trigger: 'blur,change' }
        ]
      },
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      reviewNote: '',
      statusList: [
        { value: 0, label: '待审核' },
        { value: 1, label: '上架' },
        { value: 2, label: '下架' },
        { value: 3, label: '审核不通过' },
      ],
      loginUser: {}, // 当前登录者的信息
      columnshops: [
        {
          title: 'ID',
          width: 80,
          key: 'id',
          align: 'center'
        },
        {
          title: '商品名称',
          key: 'name',
          width: 100,
          align: 'center'
        },
        {
          title: '商品图片',
          align: 'center',
          width: 100,
          render: (h, _this) => {
            return h('img', {
              attrs: {
                src: _this.row.img
              },
              style: {
                width: '30px',
                height: '30px'
              },
              on: {
                click: () => {
                  this.isOpen = true
                  this.img = _this.row.img
                }
              }
            })
          }
        },
        {
          title: '商品单价',
          key: 'price',
          width: 120,
          sortable: true,
          align: 'center',
          render: (h, _this) => {
            return h('div',_this.row.price.toFixed(2))
          },
        },
        {
          title: '商品库存',
          key: 'amount',
          width: 120,
          sortable: true,
          align: 'center'
        },
        {
          title: '商品介绍',
          key: 'intro',
          width: 160,
          align: 'center'
        },
        {
          title: '是否处于保质期内',
          key: 'isSafe',
          width: 100,
          align: 'center',
          render: (h, _this) => {
            let flag = _this.row.isSafe ? '是' : '否'
            return h('div', flag)
          },
        },
        {
          title: '状态',
          key: 'onlineState',
          width: 100,
          align: 'center',
          render: (h, _this) => {
            let status = ''
            switch (_this.row.onlineState) {
              case 0: status = '待审核'; break;
              case 1: status = '上架'; break;
              case 2: status = '下架'; break;
              case 3: status = '审核不通过'; break;
              default: break;
            }
            return h('div', status)
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, _this) => {
            let flagText = ''
            let display = ''
            let subDsiabled = false
            let delDisabled = false
            let editDisabled = false
            if (_this.row.onlineState === 3) {
              flagText = '提交'
            } else if (_this.row.onlineState === 1) {
              flagText = '下架'
              delDisabled = true
              editDisabled = true
            } else if (_this.row.onlineState === 2) {
              flagText = '上架'
            } else {
              display = 'none'
            }
            if(!_this.row.isSafe) {
              subDsiabled = true
            }
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  disabled: subDsiabled
                },
                style: {
                  marginRight: '5px',
                  display: display
                },
                on: {
                  click: () => {
                    if (flagText === '提交') {
                      this.submit(_this.row)
                    } else {
                      this.updateOnlineState(_this.row)
                    }
                  }
                }
              }, flagText),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: editDisabled
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.edit(_this.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: delDisabled
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.del(_this.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  watch: {
    shops(newVal, oldVal) {
      this.shopsData = []
      let shopsALL = JSON.parse(this.shops)
      shopsALL.forEach(item => {
        if (item.ownerId === this.loginUser.id) {
          this.shopsData.push(item)
        }
      })
      this.query()
    },
    shopsList(newVal, oldVal) {
      this.total = newVal.length
    }
  },
  created() {
    this.shops = this.$local.getStore("shops") // 全部的商品
    this.loginUser = JSON.parse(this.$session.getStore("loginUser"))
  },
  methods: {
    changePage(index) {
      this.filter.page = index - 1
    },
    onPageSizeChange(index) {
      this.filter.size = index
    },
    // 阻止默认上传，将上传的图片转为base64
    handleUpload(file) {
      let fileName = file.name
      let render = new FileReader()
      render.readAsDataURL(file);
      render.onload = e => {
        this.form.img = e.target.result
      }
      return false
    },
    // 新增/编辑
    addEdit() {
      let type = this.addEditType
      let shopsALL = JSON.parse(this.shops)
      let params = {}
      Object.assign(params, this.form)
      params.productTime = new Date(params.productTime).getTime()
      // 判断
      if (new Date().getTime() >= (params.productTime + params.storeTime * 24 * 60 * 60 * 1000)) {
        params.isSafe = false
        params.onlineState = 3
      } else {
        if (params.isSafe === false && type === 'edit') {
          params.onlineState = 0
        } else if (type === 'add') {
          params.onlineState = 0
        }
        params.isSafe = true
      }

      if (type === 'add') {
        params.id = shopsALL[shopsALL.length-1].id + 1
        params.ownerId = this.loginUser.id
        shopsALL.push(params)
      } else if(type === 'edit'){
        for (let i = 0; i < shopsALL.length; i++) {
          if (params.id === shopsALL[i].id) {
            Object.assign(shopsALL[i], params)
            break;
          }
        }
      }
      this.shops = JSON.stringify(shopsALL)
      this.$local.setStore('shops', this.shops)
      this.addEditShow = false
      this.$refs['addEditForm'].resetFields()
    },
    // 改变上下架状态
    updateOnlineState(row) {
      let shopsALL = JSON.parse(this.shops)

      for (let i = 0; i < shopsALL.length; i++) {
        if (shopsALL[i].id === row.id) {
          if (shopsALL[i].onlineState === 1) {
            shopsALL[i].onlineState = 2
          } else if (shopsALL[i].onlineState === 2) {
            shopsALL[i].onlineState = 1
          }
          break;
        }
      }
      this.shops = JSON.stringify(shopsALL)
      this.$local.setStore('shops', this.shops)
    },
    // 提交审核
    submit(row) {
      let shopsALL = JSON.parse(this.shops)
      for (let i = 0; i < shopsALL.length; i++) {
        if (row.id === shopsALL[i].id) {
          shopsALL[i].onlineState = 0
          break;
        }
      }
      this.shops = JSON.stringify(shopsALL)
      this.$local.setStore('shops', this.shops)
    },
    // 新增
    add(){
      this.addEditType = 'add'
      this.addEditShow = true
    },
    // 编辑
    edit(row) {
      Object.assign(this.form, row)
      this.form.productTime = utils.formatDate.format(new Date(row.productTime), 'yyyy-MM-dd')
      this.addEditType = 'edit'
      this.addEditShow = true
    },
    // 删除
    del(id) {
      let shopsALL = JSON.parse(this.shops)
      for (let i = 0; i < shopsALL.length; i++) {
        if (shopsALL[i].id === id) {
          shopsALL.splice(i,1)
        }
      }
      this.shops = JSON.stringify(shopsALL)
      this.$local.setStore('shops', this.shops)
    },
    cancle() {
      this.addEditShow = false
      this.$refs['addEditForm'].resetFields()
    },
    query() {
      let params = {}
      let data = []
      this.shopsList = []
      Object.assign(params, this.filters)
      if (params.onlineState === -1) {
        Object.assign(data, this.shopsData)
      } else {
        this.shopsData.forEach((item, index) => {
          if (params.onlineState === item.onlineState) {
            data.push(item)
          }
        });
      }
      Object.assign(this.shopsList, data)
    }
  },
}
</script>

<style scoped>
.wd300 {
  width: 300px;
}
</style>
