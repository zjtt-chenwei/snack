let shops = [
  {
    id: 1,
    ownerId: 2, // 所属者
    name: '香肠', // 零食名称
    img: require('../assets/logo.png'), // 商品图片
    price: 2.00, // 单价
    amount: 1265, // 库存数量
    intro: '不辣的', // 零食介绍 (50字以内)
    productTime: new Date('2019-10-12').getTime(), // 生产日期
    storeTime: 180, // 保质期
    onlineState: 0, // 商品状态 0待审核 1上架 2下架
    isSafe: true // 是否处于保质期内
  },
  {
    id: 2,
    ownerId: 2, // 所属者
    name: '香肠', // 零食名称
    img: require('../assets/logo.png'), // 商品图片
    price: 2.00, // 单价
    amount: 1265, // 库存数量
    intro: '不辣的', // 零食介绍 (50字以内)
    productTime: new Date('2019-10-12').getTime(), // 生产日期
    storeTime: 180, // 保质期
    onlineState: 1, // 商品状态 0待审核 1上架 2下架 3审核不通过
    isSafe: true // 是否处于保质期内
  },
  {
    id: 3,
    ownerId: 2, // 所属者
    name: '香肠', // 零食名称
    img: require('../assets/logo.png'), // 商品图片
    price: 2.00, // 单价
    amount: 1265, // 库存数量
    intro: '不辣的', // 零食介绍 (50字以内)
    productTime: new Date('2019-10-12').getTime(), // 生产日期
    storeTime: 180, // 保质期
    onlineState: 2, // 商品状态 0待审核 1上架 2下架 3审核不通过
    isSafe: true // 是否处于保质期内
  },
  {
    id: 4,
    ownerId: 2, // 所属者
    name: '香肠', // 零食名称
    img: require('../assets/logo.png'), // 商品图片
    price: 2.00, // 单价
    amount: 1265, // 库存数量
    intro: '不辣的', // 零食介绍 (50字以内)
    productTime: new Date('2019-10-12').getTime(), // 生产日期
    storeTime: 180, // 保质期
    onlineState: 3, // 商品状态 0待审核 1上架 2下架 3审核不通过
    isSafe: true // 是否处于保质期内
  },
  {
    id: 5,
    ownerId: 2, // 所属者
    name: '香肠', // 零食名称
    img: require('../assets/logo.png'), // 商品图片
    price: 2.00, // 单价
    amount: 1265, // 库存数量
    intro: '不辣的', // 零食介绍 (50字以内)
    productTime: new Date('2019-10-12').getTime(), // 生产日期
    storeTime: 10, // 保质期
    onlineState: 1, // 商品状态 0待审核 1上架 2下架 3审核不通过
    isSafe: true // 是否处于保质期内
  },
]
export default shops
