<template>
  <div>
    <Row>
      <Col :span="24" style="padding: 15px 15px;z-index:2;text-align:left;">
        <Form :inline="true">
          <Form-item>
            <Input v-model="filters.name" placeholder="请输入用户名" @on-enter="query"></Input>
          </Form-item>
          <Form-item>
            <Input v-model="filters.phone" placeholder="请输入手机号码" @on-enter="query"></Input>
          </Form-item>
          <Form-item>
            <Button type="primary" v-on:click="query">查询</Button>
          </Form-item>
        </Form>
      </Col>
    </Row>
    <Card style="width: 100%;" dis-hover class="card">
      <p slot="title" style="text-align:left">
        <Icon type="ios-film-outline"></Icon>用户管理
      </p>
      <!--列表-->
      <Table
        :data="usersList.slice(filter.page*filter.size, ((filter.page+1)*filter.size))"
        :columns="columnusers"
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
      <img :src="yyzzURL" style="width:100%;" />
    </Modal>
    <Modal title="商家审核" :mask-closable="false" v-model="reviewShow">
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
import utils from '../../common/utils'
export default {
  data() {
    return {
      users: '',
      usersList: [], // 展示的user数据
      usersData: [], // 本地存储的user数据
      total: 0,
      filter: {
        page: 0,
        size: 10
      }, // 翻页条件
      filters: {
        name: '',
        phone: ''
      }, // 查询条件
      isOpen: false,
      yyzzURL: '',
      reviewId: '',
      reviewShow: false,
      reviewNote: '',
      columnusers: [
        {
          title: 'ID',
          width: 80,
          key: 'id',
          align: 'center'
        },
        {
          title: '用户名',
          key: 'loginName',
          align: 'center'
        },
        {
          title: '手机号码',
          key: 'phone',
          align: 'center'
        },
        {
          title: '角色',
          key: 'role',
          align: 'center',
          render: (h, _this) => {
            // console.log(_this.row.role);
            let role = ''
            if (_this.row.role === "ADMIN") {
              role = '管理员'
            } else {
              role = '商家'
            }
            return h('div', role)
          }
        },
        {
          title: '营业执照',
          align: 'center',
          render: (h, _this) => {
            return h('img', {
              attrs: {
                src: _this.row.yyzzURL
              },
              style: {
                width: '30px',
                height: '30px'
              },
              on: {
                click: () => {
                  this.isOpen = true
                  this.yyzzURL = _this.row.yyzzURL
                }
              }
            })
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          render: (h, _this) => {
            let time = utils.formatDate.format(new Date(_this.row.createTime), 'yyyy-MM-dd hh:mm:ss')
            return h('div', time)
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, _this) => {
            let flagText = ''
            let flagColor = ''
            let disabled = false
            if (_this.row.examine === 0) {
              flagText = '审核'
              flagColor = 'info'
            } else if (_this.row.examine === 1) {
              flagText = '冻结'
              flagColor = 'warning'
            } else if (_this.row.examine === 2) {
              flagText = '解冻'
              flagColor = 'success'
            }
            if (_this.row.role === 'ADMIN') {
              disabled = true
            }
            return h('div', [
              h('Button', {
                props: {
                  type: flagColor,
                  size: 'small',
                  disabled: disabled
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    if (flagText === '审核') {
                      this.reviewShow = true
                      this.reviewId = _this.row.id
                      this.reviewNote = _this.row.reviewNote ? _this.row.reviewNote : ''
                    } else {
                      this.updateExamine(_this.row)
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
    usersList(newVal, oldVal) {
      this.total = newVal.length
    }
  },
  created() {
    this.users = this.$local.getStore("users")
    this.usersList = JSON.parse(this.users)
    this.usersData = JSON.parse(this.users)
  },
  methods: {
    changePage(index) {
      this.filter.page = index - 1
    },
    onPageSizeChange(index) {
      this.filter.size = index
    },
    commitReview(flag) {
      for (let i = 0; i < this.usersData.length; i++) {
        if (this.usersData[i].id === this.reviewId) {
          if (flag) {
            this.usersData[i].examine = 1
          } else {
            this.usersData.splice(i, 1)
          }
          this.users = JSON.stringify(this.usersData)
          this.$local.setStore('users', this.users)
          this.reviewShow = false
          this.query()
          return
        }
      }
    },
    updateExamine(row) {
      for (let i = 0; i < this.usersData.length; i++) {
        if (this.usersData[i].id === row.id) {
          if (this.usersData[i].examine === 1) {
            this.usersData[i].examine = 2
          } else if (this.usersData[i].examine === 2) {
            this.usersData[i].examine = 1
          }
          this.users = JSON.stringify(this.usersData)
          this.$local.setStore('users', this.users)
          this.query()
          return
        }
      }
    },
    query() {
      let params = {}
      let data = []
      this.usersList = []
      Object.assign(params, this.filters)
      if (params.name === '') {
        Object.assign(data, this.usersData)
      } else {
        this.usersData.forEach((item, index) => {
          if (params.name === item.loginName) {
            data.push(item)
          }
        });
      }
      if (params.phone === '') {
        Object.assign(this.usersList, data)
      } else {
        data.forEach((item, index) => {
          let patt = new RegExp(params.phone);
          if (patt.test(item.phone)) {
            this.usersList.push(item)
          }
        });
      }
    }
  },
}
</script>

<style scoped>
.pageTable {
  text-align: right;
  margin: 20px 0;
}
</style>
