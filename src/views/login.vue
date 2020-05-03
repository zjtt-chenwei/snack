<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <div class="box">
        <p slot="title">登录</p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="loginName" style="margin-bottom:10px">
              <Input v-model="form.loginName" placeholder="请输入账户名" style="background: #fff;">
                <Icon type="ios-person" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                class="password-input"
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
              >
                <Icon type="md-unlock" slot="prefix" />
              </Input>
            </FormItem>
            <router-link to="regist">去注册</router-link>
            <FormItem>
              <Button
                @click="handleSubmit"
                type="primary"
                long
                size="large"
                style="margin-top: 10px;height:40px;font-size:18px"
                :disabled="!(this.form.loginName&&this.form.password)"
              >登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        loginName: "",
        password: ""
      }, // 提交的表单
      rules: {
        loginName: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ]
      } // 表单规则
    }
  },
  methods: {
    // 登录提交
    handleSubmit() {
      let users = JSON.parse(this.$local.getStore("users"))
      let exist = false
      let resource = '' // 资源树
      let loginShops = []
      for (let i = 0; i < users.length; i++) {
        if (users[i].loginName === this.form.loginName) {
          if (users[i].password === this.form.password) {
            // 判断该账户是否有权限进入下一级页面
            if (users[i].examine === 1) {
              if (users[i].role === "ADMIN") {
                /* 判断登录者身份 admin-返回全部的商品信息 商家返回对应的 */
                resource = this.$local.getStore("resourcesAdmin")
              } else {
                resource = this.$local.getStore("resourcesCustom")
              }
              // 保存访问权限树
              this.$session.setStore("resource", resource)
              this.$session.setStore("loginUser", JSON.stringify(users[i]))
              let toPath = JSON.parse(resource)[0].children[0].name
              console.log(toPath);
              this.$router.push({ name: toPath })
              // 保存登录者的身份信息
              this.$session.setStore('parentActiveName', JSON.parse(resource)[0].name)
              this.$session.setStore('childMenu', JSON.stringify(JSON.parse(resource)[0].children))
              this.$session.setStore('childActiveName', toPath)

            } else if (users[i].examine === 0) {
              this.$Message.error("您还未经过管理员审核！")
              return;
            } else if (users[i].examine === 2) {
              this.$Message.error("您的账号已被冻结")
              return;
            }
          } else {
            this.$Message.error("密码错误")
            return;
          }
          exist = true
        }
      }
      if (!exist) {
        this.$Message.error("不存在该账号")
      }
    }
  },
  created() {
    if (this.$route.params && Object.keys(this.$route.params).length !== 0) {
      this.form = this.$route.params
    }
  },
}
</script>

<style lang="css" scoped>
.login {
  width: 100%;
  height: 100%;
  background: rgb(20, 86, 185);
}
.login-con {
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translateY(-60%);
  width: 372px;
}
.login-con .box {
  background: #ffffff;
  border-radius: 5px;
  padding: 20px 30px 5px;
}
.box p {
  line-height: 20px;
  color: #26394d;
  text-align: center;
  height: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #26394d;
  letter-spacing: 0;
  margin-bottom: 10px;
}
.form-con {
  padding: 10px 0 0;
  text-align: right;
}
.login-con .ivu-form-item {
  margin-bottom: 20px !important;
}
.login-con .ivu-form-item input {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  padding: 4px 7px 4px 50px;
}
</style>
