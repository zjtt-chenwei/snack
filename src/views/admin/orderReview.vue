<template>
  <div>
    <Row>
      <Col :span="24" style="padding: 15px 15px;z-index:2;text-align:left;">
        <Form :inline="true">
          <Form-item>
            <span>订单状态：</span>
            <Select v-model="filters.status" style="width:200px;">
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
        订单管理
      </p>
      <!--列表-->
      <Table
        :data="ordersList.slice(filter.page*filter.size, ((filter.page+1)*filter.size))"
        :columns="columnorders"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders:'',
      usersList:[],
      ordersList: [], // 展示的user数据
      ordersData: [], // 本地存储的user数据
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
      columnorders: [
        {
          title: 'ID',
          width: 80,
          key: 'id',
          align: 'center'
        },
        {
          title: '卖家手机号码',
          align: 'center',
          key: 'salePhone'
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
        }
      ]
    }
  },
  watch: {
    ordersList(newVal, oldVal) {
      this.total = newVal.length
    }
  },
  created() {
    this.usersList = JSON.parse(this.$local.getStore("users"))
    this.orders = this.$local.getStore("orders")
    this.ordersData = JSON.parse(this.orders)
    this.ordersList = JSON.parse(this.orders)
  },
  methods: {
    changePage(index) {
      this.filter.page = index - 1
    },
    onPageSizeChange(index) {
      this.filter.size = index
    },
    query() {
      let params = {}
      let data = []
      this.ordersList = []
      Object.assign(params, this.filters)
      console.log(params);
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

</style>
