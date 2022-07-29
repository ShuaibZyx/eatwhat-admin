<template>
  <div id="id">
    <el-menu
      class="el-menu-vertical-demo"
      :collapse-transition="false"
      :router="true"
      :collapse="isCollapse"
      :default-active="$route.path"
    >
      <el-menu-item index="/ingredient">
        <i class="el-icon-chicken"></i>
        <template slot="title">
          <span slot="title">食材管理</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/menu">
        <i class="el-icon-dish"></i>
        <template slot="title">
          <span slot="title">菜谱管理</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/user">
        <i class="el-icon-user"></i>
        <template slot="title">
          <span slot="title">用户管理</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/authority">
        <i class="el-icon-setting"></i>
        <template slot="title">
          <span slot="title">权限控制</span>
        </template>
      </el-menu-item>

      <el-menu-item>
        <i
          class="el-icon-arrow-right"
          v-if="isCollapse"
          @click="unCollapse"
        ></i>
        <i
          class="el-icon-arrow-left"
          v-if="!isCollapse"
          @click="collapse"
        ></i>
        <template slot="title">
          <span slot="title" v-if="isCollapse" @click="unCollapse"
            >展开</span
          >
          <span slot="title" v-if="!isCollapse" @click="collapse">折起</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    //折叠所用方法
    collapse() {
      this.isCollapse = true;
      this.$store.commit("SetIsCollapse", this.isCollapse);
    },
    //展开所用方法
    unCollapse(){
      this.isCollapse = false;
      this.$store.commit("SetIsCollapse", this.isCollapse);
    }
  },
};
</script>
