<template>
  <div>
    <Row>
      <Col :span="16" style="padding: 15px 15px;z-index:2;text-align:left;">
        <Form :inline="true">
          <Form-item>
            <span>订单状态：</span>
            <Select v-model="filters.status" style="width:200px;">
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
    </Row>
    <Card style="width: 100%;" dis-hover class="card">
      <p slot="title" style="text-align:left">
        <Icon type="ios-film-outline"></Icon>订单管理
      </p>
      <!--列表-->
      <Table
        :data="ordersList.slice(filter.page*filter.size, ((filter.page+1)*filter.size))"
        :columns="columnorders"
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
  </div>
</template>

<script>
import utils from '@/common/utils'
export default {
  data() {
    return {
      orders: '',
      ordersList: [], // 展示的数据
      ordersData: [], // 该商家所拥有的商品
      total: 0,
      filter: {
        page: 0,
        size: 10
      }, // 翻页条件
      filters: {
        status: -1,
      }, // 查询条件
      statusList: [
        { value: 0, label: '已关闭'},
        { value: 1, label: '交易中'},
        { value: 2, label: '已付款'},
        { value: 3, label: '已结束'},
      ],
      loginUser: {}, // 当前登录者的信息
      columnorders: [
        {
          title: 'ID',
          width: 80,
          key: 'id',
          align: 'center'
        },
        {
          title: '买家手机号码',
          align: 'center',
          key: 'buyPhone'
        },
        {
          title: '订单商品名称',
          align: 'center',
          key: 'shopName',
        },
        {
          title: '订单商品数量',
          align: 'center',
          key: 'shopNum',
        },
        {
          title: '订单商品单价(元)',
          align: 'center',
          key: 'shopPrice',
        },
        {
          title: '总金额(元)',
          align: 'center',
          render: (h, _this) => {
            let totalPrice = _this.row.shopPrice * _this.row.shopNum
            return h('div',totalPrice)
          }
        },
        {
          title: '订单状态',
          key: 'status',
          align: 'center',
          render: (h, _this) => {
            let status = ''
            switch (_this.row.status) {
              case 0: status = '已关闭'; break;
              case 1: status = '交易中'; break;
              case 2: status = '已付款'; break;
              case 3: status = '已结束'; break;
              default: break;
            }
            return h('div', status)
          }
        },
        {
          title: '订单创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, _this) => {
            let show = 'none'
            if (_this.row.status === 1) {
              show = 'block'
            }
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                },
                style: {
                  marginRight: '5px',
                  display: show
                },
                on: {
                  click: () => {
                    this.close(_this.row.id)
                  }
                }
              }, '关闭订单')
            ])
          }
        }
      ]
    }
  },
  watch: {
    orders(newVal, oldVal) {
      this.ordersData = []
      let ordersALL = JSON.parse(this.orders)
      ordersALL.forEach(item => {
        if (item.saleId === this.loginUser.id) {
          this.ordersData.push(item)
        }
      })
      this.query()
    },
    ordersList(newVal, oldVal) {
      this.total = newVal.length
    }
  },
  created() {
    this.orders = this.$local.getStore("orders") // 全部的商品
    this.loginUser = JSON.parse(this.$session.getStore("loginUser"))
  },
  methods: {
    changePage(index) {
      this.filter.page = index - 1
    },
    onPageSizeChange(index) {
      this.filter.size = index
    },
    // 关闭订单
    close(id) {
      let ordersALL = JSON.parse(this.orders)
      for (let i = 0; i < ordersALL.length; i++) {
        if (ordersALL[i].id === id) {
          ordersALL[i].status = 0
        }
      }
      this.orders = JSON.stringify(ordersALL)
      this.$local.setStore('orders', this.orders)
    },
    query() {
      let params = {}
      let data = []
      this.ordersList = []
      Object.assign(params, this.filters)
      if (params.status === -1) {
        Object.assign(data, this.ordersData)
      } else {
        this.ordersData.forEach((item, index) => {
          if (params.status === item.status) {
            data.push(item)
          }
        });
      }
      Object.assign(this.ordersList, data)
    }
  },
}
</script>

<style scoped>
.wd300 {
  width: 300px;
}
</style>
