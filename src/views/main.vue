<template>
  <div class="main">
    <Layout :style="{height: '100%'}">
      <Header class="flex">
        <Menu mode="horizontal" theme="dark" :active-name="parentActiveName" @on-select="changeParent">
          <!-- <div class="layout-logo"></div> -->
          <div class="layout-nav">
            <MenuItem v-for="(item, index) in parentMenu" :key="index" :name="item.name">{{item.title}}</MenuItem>
          </div>
        </Menu>
        <Dropdown style="color:white;" @on-click="select">
              {{loginUser.loginName}}
              <!-- <Icon type="ios-arrow-down"></Icon> -->
          <DropdownMenu slot="list">
              <DropdownItem name="pass">修改密码</DropdownItem>
              <DropdownItem name="loginOut">登出</DropdownItem>
          </DropdownMenu>
      </Dropdown>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu :active-name="childActiveName" theme="light" width="auto"  @on-select="changeChild">
            <MenuItem v-for="(item, i) in childMenu" :key="i" :name="item.name" :to="item.name">{{item.title}}</MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <router-view></router-view>
        </Layout>
      </Layout>
    </Layout>
    <Modal v-model="showModal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
      <!-- <p style="color:red;font-size:12px" v-show="loginMsgShow">{{loginMsg}}</p> -->
      <Form ref="editPasswordForm" :model="form" :label-width="100" label-position="right" :rules="passwordValidate">
          <FormItem label="新密码" prop="newPass" style="margin-bottom:20px !important">
              <Input v-model="form.newPass" type="password" placeholder="请输入新密码" ></Input>
          </FormItem>
          <FormItem label="确认新密码" prop="rePass" style="margin-bottom:20px !important">
              <Input v-model="form.rePass" type="password" placeholder="请再次输入新密码"></Input>
          </FormItem>
      </Form>
      <div slot="footer">
          <Button type="text" @click="cancelEditPass">取消</Button>
          <Button type="primary" @click="saveEditPass">保存</Button>
      </div>
  </Modal>
  </div>
</template>

<script>
export default {
  computed: {

  },
  data() {
    // <!--验证密码-->
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请输入密码"))
      } else {
        // if (this.form.rePass !== "") {
        //   // 验证再确认密码
        //   this.$refs.registForm.validateField("rePass");
        // }
        callback()
      }
    }
    // <!--二次验证密码-->
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请输入密码"));
      } else if (value !== this.form.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
        parentActiveName: "",
        childActiveName: "",
        parentMenu: [],
        childMenu: [],
        loginUser: {},
        showModal: false,
        form: {
          newPass: '',
          rePass: ''
        },
        passwordValidate: {
          newPass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          rePass: [
            { validator: validateCheckPass, trigger: 'blur' },
          ]
        },
    }
  },
  watch: {
  },
  created() {
      this.parentMenu = JSON.parse(this.$session.getStore("resource"))
      this.parentActiveName = this.$session.getStore('parentActiveName')
      this.childMenu = JSON.parse(this.$session.getStore('childMenu'))
      this.childActiveName = this.$session.getStore('childActiveName')
      this.loginUser = JSON.parse(this.$session.getStore('loginUser'))
  },
  methods: {
      changeParent(name) {
        this.$session.setStore('parentActiveName', name)
        if(name === 'userManage') {
            this.childMenu = this.parentMenu[0].children
        } else if(name === 'shopManage'){
            this.childMenu = this.parentMenu[1].children
        }
        this.$session.setStore('childMenu', this.childMenu)
        this.$router.push({path: '/'+this.childMenu[0].name})
        this.$nextTick(()=>{
          this.childActiveName = this.childMenu[0].name
          this.$session.setStore('childActiveName', this.childActiveName)
        })
      },
      changeChild(name) {
        this.$session.setStore('childActiveName', name)
      },
      cancelEditPass () {
        this.showModal = false;
        this.$refs['editPasswordForm'].resetFields();
      },
      select(name) {
        if(name === 'pass') {
          this.showModal = true
        } else if (name === 'loginOut'){
          this.$session.removeStore('loginUser')
          this.$session.removeStore("resource")
          this.$session.removeStore('childMenu')
          this.$session.removeStore('parentActiveName')
          this.$session.removeStore('childActiveName')
          this.$router.push('/login')
        }
      },
      saveEditPass () {
        this.$refs['editPasswordForm'].validate(valid => {
          if(valid){
            let id = this.loginUser.id
            let users = JSON.parse(this.$local.getStore('users'))
            for (let i = 0; i < users.length; i++) {
              if(users[i].id === id) {
                users[i].password = this.form.newPass
              }
              break
            }
            this.$local.setStore('users',JSON.parse(users))
            this.showModal = false
          } else {
            return false
          }
        })
      }
  },
}
</script>

<style scoped>
.main {
    width: 100%;
    height: 100%;
}
.flex {
  display: flex;
  justify-content: space-between;
}
</style>
