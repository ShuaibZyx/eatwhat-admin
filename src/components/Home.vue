<template>
  <div>
    <!-- 主结构 -->
    <!-- 第一层 -->

    <el-container>
      <!-- 头 -->
      <el-header>
        <Header></Header>
      </el-header>
      <!-- 第二层 -->

      <el-container>
        <!-- 侧边栏 -->
        <el-aside
          style="margin-top: 22px"
          :width="isCollapse ? '70px' : '180px'"
        >
          <Aside></Aside>
        </el-aside>

        <!-- 第三层 -->
        <el-container>
          <!-- 体 -->
          <el-main>
            <router-view></router-view>
          </el-main>

          <!-- 底 -->
          <el-footer>
            <Footer></Footer>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "./Aside";
import Header from "./Header";
import Footer from "./Footer";
export default {
  name: "Home",
  computed: {
    isCollapse() {
      return this.$store.state.isCollapse;
    },
  },
  components: {
    Aside,
    Header,
    Footer,
  },
  mounted() {
    //存入vuex中admin对象,方便组件通信控制权限
    var admin = JSON.parse(window.sessionStorage.getItem("admin"));
    this.$store.commit("SetAdmin", admin);
  },
};
</script>
