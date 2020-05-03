<template>
  <div>
    <Row>
      <Col :span="24" style="padding: 15px 15px;z-index:2;text-align:left;">
        <Form :inline="true">
          <Form-item>
            <span>状态：</span>
            <Select v-model="filters.onlineState" style="width:200px;">
              <Option :value="-1">全部</Option>
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item>
            <Button type="primary" v-on:click="query">查询</Button>
          </Form-item>
        </Form>
      </Col>
    </Row>
    <Card style="width: 100%;"
          dis-hover
          class="card">
      <p slot="title" style="text-align:left">
        <Icon type="ios-film-outline"></Icon>
        商品管理
      </p>
      <!--列表-->
      <Table
        :data="shopsList.slice(filter.page*filter.size, ((filter.page+1)*filter.size))"
        :columns="columnshops"
        highlight-current-row
        style="width: 100%;height:100%">
      </Table>

      <!--工具条-->
      <Row class-name="page-box">
        <Col :span="24">
        <Page :show-total="true"
              show-sizer
              :show-elevator="true"
              :total="total"
              :page-size="filter.size"
              :current="filter.page + 1"
              class="pageTable"
              @on-page-size-change="onPageSizeChange"
              @on-change="changePage"></Page>
        </Col>
      </Row>
    </Card>
    <Modal v-model="isOpen" width="300" :closable="false" footer-hide class="modal">
      <img :src="img" style="width:100%;" />
    </Modal>
    <Modal title="商品审核" :mask-closable="false" v-model="reviewShow">
      <Form>
        <FormItem>
          <Input
            v-model="reviewNote"
            type="textarea"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入备注"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="modal-footer">
        <Button type="primary" @click="commitReview(true)">通过</Button>
        <Button type="error" @click="commitReview(false)">不通过</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shops:'',
      usersList:[],
      shopsList: [], // 展示的user数据
      shopsData: [], // 本地存储的user数据
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
      reviewId: '',
      reviewShow: false,
      reviewNote: '',
      statusList: [
        { value: 0, label: '待审核'},
        { value: 1, label: '上架'},
        { value: 2, label: '下架'},
        { value: 3, label: '审核不通过'},
      ],
      columnshops: [
        {
          title: 'ID',
          width: 80,
          key: 'id',
          align: 'center'
        },
        {
          title: '店主',
          align: 'center',
          render: (h, _this) => {
            let ownName = ''
            for (let i = 0; i < this.usersList.length; i++) {
              if (_this.row.ownerId === this.usersList[i].id) {
                ownName = this.usersList[i].loginName
                break;
              }
            }
            return h('div',ownName)
          }
        },
        {
          title: '店主号码',
          align: 'center',
          render: (h, _this) => {
            let phone = ''
            for (let i = 0; i < this.usersList.length; i++) {
              if (_this.row.ownerId === this.usersList[i].id) {
                phone = this.usersList[i].phone
                break;
              }
            }
            return h('div',phone)
          }
        },
        {
          title: '商品名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '商品图片',
          align: 'center',
          render: (h, _this) => {
            return h('img',{
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
        // {
        //   title: '生产日期',
        //   key: 'productTime',
        //   align: 'center',
        //   render: (h, _this) => {
        //     let time = utils.formatDate.format(new Date(_this.row.productTime), 'yyyy-MM-dd hh:mm:ss')
        //     return h('div', time)
        //   }
        // },
        {
          title: '状态',
          key: 'onlineState',
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
            let flagColor = ''
            let display = ''
            if (_this.row.onlineState === 0) {
              flagText = '审核'
              flagColor = 'info'
            } else if (_this.row.onlineState === 1) {
              flagText = '下架'
              flagColor = 'info'
            } else if (_this.row.onlineState === 2) {
              flagText = '上架'
              flagColor = 'info'
            } else {
              flagColor = 'info'
              display = "none"
            }
            return h('div', [
              h('Button', {
                props: {
                  type: flagColor,
                  size: 'small',
                },
                style: {
                  marginRight: '5px',
                  display: display
                },
                on: {
                  click: () => {
                    if (flagText === '审核') {
                      this.reviewShow = true
                      this.reviewId = _this.row.id
                      // this.reviewNote = _this.row.reviewNote ? _this.row.reviewNote : ''
                    } else {
                      this.updateOnlineState(_this.row)
                    }
                  }
                }
              }, flagText)
            ])
          }
        }
      ]
    }
  },
  watch: {
    shopsList(newVal, oldVal) {
      this.total = newVal.length
    }
  },
  created() {
    this.usersList = JSON.parse(this.$local.getStore("users"))
    this.shops = this.$local.getStore("shops")
    this.shopsData = JSON.parse(this.shops)
    this.shopsList = JSON.parse(this.shops)
  },
  methods: {
    changePage(index) {
      this.filter.page = index - 1
    },
    onPageSizeChange(index) {
      this.filter.size = index
    },
    commitReview(flag) {
      for (let i = 0; i < this.shopsData.length; i++) {
        if (this.shopsData[i].id === this.reviewId) {
          if (flag) {
            this.shopsData[i].onlineState = 1
            this.shopsData[i].reviewNote = this.reviewNote
          } else {
            this.shopsData[i].onlineState = 3
            this.shopsData[i].reviewNote = this.reviewNote
          }
          this.shops = JSON.stringify(this.shopsData)
          this.$local.setStore('shops', this.shops)
          this.reviewShow = false
          this.query()
          return
        }
      }
    },
    updateOnlineState(row) {
      for (let i = 0; i < this.shopsData.length; i++) {
        if (this.shopsData[i].id === row.id) {
          if (this.shopsData[i].onlineState === 1) {
            this.shopsData[i].onlineState = 2
          } else if (this.shopsData[i].onlineState === 2) {
            this.shopsData[i].onlineState = 1
          }
          this.shops = JSON.stringify(this.shopsData)
          this.$local.setStore('shops', this.shops)
          this.query()
          return
        }
      }
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

</style>
