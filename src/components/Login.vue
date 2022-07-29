<template>
  <div class="login_container">
    <div class="login_box" ref="loginBoxRef">
      <div class="avatar_box">
        <img src="../assets/imgs/cabbage.jpg" alt="图标" />
      </div>

      <!-- 登录表单区域开始 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="60px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item label="账号" prop="adminAcco">
          <el-input
            v-model="loginForm.adminAcco"
            type="text"
            prefix-icon="el-icon-s-custom"
            clearable
            @keyup.enter.native="login"
            @focus.once="showClearBox"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="adminPass">
          <el-input
            v-model="loginForm.adminPass"
            type="password"
            prefix-icon="el-icon-lock"
            clearable
            minlength="6"
            maxlength="10"
            validate-event
            show-password
            @keyup.enter.native="login"
            @focus.once="showClearBox"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button
            type="warning"
            @click="forgetPassword"
            size="medium"
            round
            plain
            >忘记密码</el-button
          >
          <el-button type="primary" @click="login" size="medium" round plain
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 登录表单区域结束 -->
    </div>
  </div>
</template>

<script>
import "../assets/css/login.less";
import "../js/lineconnect.js";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        adminAcco: "",
        adminPass: "",
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        adminAcco: [{ required: true, message: "请输入账号", trigger: "blur" }],
        //验证密码是否合法
        adminPass: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //登录所用方法
    login() {
      //首先进行数据验证
      this.$refs.loginFormRef.validate(async (valid) => {
        //验证不通过直接返回
        if (!valid) return;
        //管理员账号不涉及注册，直接发送请求
        const { data: loginRes } = await this.$http.get(
          "admin/login/" + this.loginForm.adminAcco
        );
        if (loginRes.data.length !== 1) {
          this.$message.warning("该账号不存在");
          return;
        }
        if (loginRes.data[0].adminPass !== this.loginForm.adminPass) {
          this.$message.warning("密码错误,请重试");
          return;
        }
        //存入session用于权限判断
        window.sessionStorage.setItem("admin", JSON.stringify(loginRes.data[0]))
        //登录操作完成后跳转路由
        this.$router.push("/home");
        //显示登陆成功提示消息
        if (loginRes.data[0].adminAcco === "no-one") {
          this.$message.success("✨欢迎你!最高管理员:" + loginRes.data[0].adminName);
        } else {
          this.$message.success(
            `✨欢迎你 ${loginRes.data[0].adminName || "神秘人"}`
          );
        }
      });
    },

    //点击登陆页面的box时将透明度复原
    showClearBox() {
      this.$refs.loginBoxRef.style.opacity = 1;
    },

    //点击忘记密码按钮触发方法
    forgetPassword() {
        this.$message({
        showClose: true,
        duration: 5000,
        type: "success",
        message: "请联系主管重置密码,QQ:2061055218🤓",
        center: true,
      });
    },
  },
  mounted() {
    //在login组件挂载时将透明度变为0.7
    this.$refs.loginBoxRef.style.opacity = 0.7;
  },
};
</script>
