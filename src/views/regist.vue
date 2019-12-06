<template>
  <div class="regist" @keydown.enter="handleSubmit">
    <div class="regist-con">
      <div class="box">
        <p slot="title">注册</p>
        <div class="form-con">
          <Form ref="registForm" :model="form" :rules="rules">
            <FormItem prop="loginName">
              <Input v-model="form.loginName" placeholder="请输入账户名" style="background: #fff;">
                <Icon type="ios-person" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="phone">
              <Input v-model="form.phone" placeholder="请输入手机号" style="background: #fff;">
                <Icon type="md-phone-portrait" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码" password>
                <Icon type="md-unlock" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="checkPass" :style="{textAlign: 'left'}">
              <Input type="password" v-model="form.checkPass" placeholder="请再输入密码" password>
                <Icon type="md-unlock" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="yyzzURL">
              <Upload
                :style="{width:'140px',float:'left'}"
                :before-upload="handleUpload"
                action="//jsonplaceholder.typicode.com/posts/"
              >
                <Button icon="ios-cloud-upload-outline">上传营业执照</Button>
              </Upload>
              <img :src="form.yyzzURL" style="width；30px;height: 30px;" @click="isOpen = true" />
            </FormItem>
            <router-link to="login">去登录</router-link>
            <FormItem>
              <Button
                @click="handleSubmit"
                type="primary"
                long
                size="large"
                style="margin-top: 10px;height:40px;font-size:18px"
              >注册</Button>
            </FormItem>
          </Form>
        </div>
        <Modal v-model="isOpen" width="300" :closable="false" footer-hide class="modal">
          <img :src="form.yyzzURL" style="width:100%;" />
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const checkUserName = (rule, value, callback) => {
      if (!/^[A-Za-z_][A-Za-z0-9_)]+$/.test(value)) {
        callback(new Error("用户名以字母或下划线开头，由字母、数字、下划线组成"))
      } else if (value.length < 2 || value.length > 10) {
        callback(new Error("用户名的长度为2-10"))
      } else {
        callback()
      }
    }
    const checkPhone = (rlue, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号"))
      } else {
        callback()
      }
    }
    // <!--验证密码-->
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请输入密码"))
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.registForm.validateField("checkPass"); // 验证再确认密码
        }
        callback()
      }
    }
    // <!--二次验证密码-->
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        loginName: "",
        phone: "",
        password: "",
        checkPass: "",
        yyzzURL: ""
      }, // 提交的表单
      rules: {
        loginName: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { validator: checkUserName, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateCheckPass, trigger: 'blur' },
        ],
        yyzzURL: [
          { required: true, message: '请上传营业执照', trigger: 'blur,change' }
        ]
      }, // 表单规则
      isOpen: false
    }
  },
  methods: {
    // 阻止默认上传，将上传的图片转为base64
    handleUpload(file) {
      let fileName = file.name
      let render = new FileReader()
      render.readAsDataURL(file);
      render.onload = e => {
        this.form.yyzzURL = e.target.result
      }
      return false
    },
    // 注册提交
    handleSubmit() {
      this.$refs['registForm'].validate(valid => {
        if (valid) {
          let users = JSON.parse(this.$local.getStore("users"))
          for (let i = 0; i < users.length; i++) {
            if (users[i].loginName === this.form.loginName) {
              this.$Message.error("已存在用户名")
              return;
            }
          }
          let param = {}
          Object.assign(param, this.form)
          param.createTime = new Date().getTime()
          param.role = "BUSINESS"
          param.examine = 0
          param.id = users[users.length - 1].id + 1
          users.push(param)
          console.log(users);
          this.$local.setStore("users", JSON.stringify(users))
          this.$Message.success("注册请求成功，请等待管理员审核！")
          this.$router.push({
            name: 'login',
            params: {
              loginName: this.form.loginName,
              password: this.form.password
            }
          })
          this.$refs['registForm'].resetFields()
        } else {
          return false
        }
      })
    }
  },
}
</script>

<style lang="css" scoped>
.regist {
  width: 100%;
  height: 100%;
  background: rgb(20, 86, 185);
}
.regist-con {
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translateY(-60%);
  width: 372px;
}
.regist-con .box {
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
.icon-style {
  position: absolute;
  z-index: 1;
  height: 20px;
  margin-top: 10px;
  width: 40px;
  line-height: 20px;
  text-align: center;
  border-right: 1px solid #dddee1;
}
.regist-con .ivu-form-item {
  margin-bottom: 20px !important;
}
.regist-con .ivu-form-item input {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  padding: 4px 7px 4px 50px;
}
.regist .regist-con .password-input input {
  padding-right: 40px;
}
</style>
<style>
.modal .ivu-modal .ivu-modal-body {
  padding: 0 !important;
}
</style>

