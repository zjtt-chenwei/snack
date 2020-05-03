let users = [
  // 管理员
  {
    'id': 1,
    'loginName': 'admin', // 账号/用户名
    'password': '123456', // 密码
    'role': 'ADMIN', // 角色
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'examine': 1, // 是否经过审核 0待审核 1审核通过
  },
  // 商家
  {
    'id': 2,
    'loginName': 'zyj',
    'password': '888888',
    'phone': '18100170000', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 1, // 是否经过审核(判断该账户是否有权限进入下一级页面) 0待审核
  },
  {
    'id': 3,
    'loginName': 'cw',
    'password': '888888',
    'phone': '18100170001', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 0, // 是否经过审核(判断该账户是否有权限进入下一级页面) 1审核通过
  },
  {
    'id': 4,
    'loginName': 'c111',
    'password': '888888',
    'phone': '18100170003', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 2, // 判断该账户是否有权限进入下一级页面 2无权
  },
  {
    'id': 5,
    'loginName': 'c111',
    'password': '888888',
    'phone': '18100170003', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 2, // 判断该账户是否有权限进入下一级页面 2无权
  },
  {
    'id': 6,
    'loginName': 'c111',
    'password': '888888',
    'phone': '18100170003', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 2, // 判断该账户是否有权限进入下一级页面 2无权
  },
  {
    'id': 7,
    'loginName': 'c111',
    'password': '888888',
    'phone': '18100170003', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 2, // 判断该账户是否有权限进入下一级页面 2无权
  },
  {
    'id': 8,
    'loginName': 'c111',
    'password': '888888',
    'phone': '18100170003', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 2, // 判断该账户是否有权限进入下一级页面 2无权
  },
  {
    'id': 9,
    'loginName': 'c111',
    'password': '888888',
    'phone': '18100170003', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 2, // 判断该账户是否有权限进入下一级页面 2无权
  },
  {
    'id': 10,
    'loginName': 'c111',
    'password': '888888',
    'phone': '18100170003', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 2, // 判断该账户是否有权限进入下一级页面 2无权
  },
  {
    'id': 11,
    'loginName': 'c111',
    'password': '888888',
    'phone': '18100170003', // 手机号码
    'role': 'BUSINESS',
    'createTime': new Date('2019-12-12 15:36:25').getTime(), // 创建时间
    'yyzzURL': require('../assets/logo.png'), // 营业执照照片
    'examine': 2, // 判断该账户是否有权限进入下一级页面 2无权
  },
];

export default users
