<template>
  <el-card>
    <div class="header">
      <div class="img-box">
        <img src="../assets/imgs/cabbage.jpg" alt="logo" width="100%" />
      </div>
      <span class="intro">欢迎使用吃啥-后台管理系统✨</span>
      <div class="title">
        <el-dropdown>
          <span style="cursor: pointer">
            {{ admin ? admin.adminName : "神秘人"}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user">
              <span>我的信息</span>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-error"
              ><span @click="logout">退出登录</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Header",
  computed: {
    admin() {
      return this.$store.state.admin;
    },
  },
  methods: {
    //退出登陆方法
    logout() {
      //清空vuex
      this.$store.commit("SetAdmin", {});
      //清空session
      window.sessionStorage.setItem("admin", JSON.stringify({}));
      //提示退出登录成功
      this.$message.success("已退出登录");
      //跳转至登陆页面
      this.$router.push("login");
    },
  },
};
</script>

<style scoped>
.intro {
  font-size: 1.6em;
  font-family: 楷体;
  color: transparent;
  background-image: linear-gradient(to right, yellow, skyblue, purple);
  background-clip: text;
  user-select: none;
  font-weight: 1000;
}
</style>
