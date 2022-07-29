<template>
  <el-card>
    <div class="user" v-if="admin && admin.userAuth === 1">
      <div class="title">
        <el-alert
          title="用户管理界面"
          type="success"
          center
          :closable="false"
        ></el-alert>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          size="small"
          round
          icon="el-icon-plus"
          @click="addUserDialogVisible = true"
          >添加用户</el-button
        >
      </div>
      <div class="table">
        <el-table
          :data="
            user.filter(
              (data) =>
                !userSearch ||
                data.userName.toLowerCase().includes(userSearch.toLowerCase())
            )
          "
          style="width: 100%"
          fit
          lazy
          :stripe="true"
          :border="true"
          :highlight-current-row="true"
          empty-text="🥶正在努力加载中..."
        >
          <el-table-column label="用户昵称" align="center">
            <template slot-scope="scope">
              {{ scope.row.userName || "神秘人" }}
            </template>
          </el-table-column>

          <el-table-column label="性别" align="center" width="100">
            <template slot-scope="scope">
              {{ scope.row.userGend || "隐私" }}
            </template>
          </el-table-column>

          <el-table-column label="手机账号" align="center">
            <template slot-scope="scope">
              {{ scope.row.userNumb || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="喜好" align="center">
            <template slot-scope="scope">
              {{ scope.row.userLike || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="住址" align="center">
            <template slot-scope="scope">
              {{ scope.row.userAdd || "未知" }}
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="userSearch"
                size="mini"
                placeholder="输入用户名称搜索"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="showUpdateUser(scope.row.userId)"
                >编辑</el-button
              >
              <el-popconfirm
                title="确定删除该用户?此操作不可逆"
                style="margin-left: 5px"
                @confirm="deleteUser(scope.row.userId)"
              >
                <el-button slot="reference" type="danger" size="mini" plain
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-else>
      <el-result
        icon="warning"
        title="权限提示"
        subTitle="您无权管理此项,请向最高管理员申请权限"
      >
        <template slot="extra">
          <el-button type="primary" size="medium" @click="$router.push('/')"
            >返回</el-button
          >
        </template>
      </el-result>
    </div>

    <!-- 添加新用户的dialog -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="45%"
      :center="true"
      @close="addUserDialogClosed"
    >
      <el-form
        :model="addUserForm"
        label-width="80px"
        size="small"
        ref="addUserFormRef"
        :rules="addUserFormRules"
      >
        <el-form-item label="用户昵称" prop="userName">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="addUserForm.userName"
            autocomplete="off"
            maxlength="8"
            :clearable="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户性别" prop="userGend">
          <el-radio-group v-model="addUserForm.userGend">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="用户电话" prop="userNumb">
          <el-input
            v-model.number="addUserForm.userNumb"
            autocomplete="off"
            prefix-icon="el-icon-phone"
            :clearable="true"
            maxlength="11"
          ></el-input>
        </el-form-item>

        <el-form-item label="登陆密码" prop="userPwd">
          <el-input
            v-model="addUserForm.userPwd"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            :clearable="true"
            minlength="6"
            maxlength="13"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="用户喜好" prop="userLike">
          <el-input
            v-model="addUserForm.userLike"
            autocomplete="off"
            prefix-icon="el-icon-sugar"
            :clearable="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户住址" prop="userAdd">
          <el-cascader
            style="width: 100%"
            v-model="addUserForm.userAdd"
            :options="citys"
            filterable
            clearable
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="addUserDialogVisible = false"
          round
          plain
          size="small"
          type="info"
          >取 消</el-button
        >
        <el-button type="primary" @click="addUser" round plain size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 更新用户的dialog -->
    <el-dialog
      title="更新用户信息"
      :visible.sync="updateUserDialogVisible"
      width="45%"
      :center="true"
    >
      <el-form
        :model="updateUserForm"
        label-width="80px"
        size="small"
        ref="updateUserFormRef"
        :rules="addUserFormRules"
      >
        <el-form-item label="用户昵称" prop="userName">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="updateUserForm.userName"
            autocomplete="off"
            maxlength="8"
            :clearable="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户性别" prop="userGend">
          <el-radio-group v-model="updateUserForm.userGend">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="用户电话" prop="userNumb">
          <el-input
            v-model.number="updateUserForm.userNumb"
            autocomplete="off"
            prefix-icon="el-icon-phone"
            :clearable="true"
            maxlength="11"
          ></el-input>
        </el-form-item>

        <el-form-item label="登陆密码" prop="userPwd">
          <el-input
            v-model="updateUserForm.userPwd"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            :clearable="true"
            minlength="6"
            maxlength="13"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="用户喜好" prop="userLike">
          <el-input
            v-model="updateUserForm.userLike"
            autocomplete="off"
            prefix-icon="el-icon-sugar"
            :clearable="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户住址" prop="userAdd">
          <el-cascader
            style="width: 100%"
            v-model="updateUserForm.userAdd"
            :options="citys"
            filterable
            clearable
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="updateUserDialogVisible = false"
          round
          plain
          size="small"
          type="info"
          >取 消</el-button
        >
        <el-button type="primary" @click="updateUser" round plain size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import citys from "../js/citys";
export default {
  name: "User",
  data() {
    return {
      user: [],
      userSearch: "",
      //添加新用户的dialog可见性
      addUserDialogVisible: false,
      //更新用户信息的dialog可见性
      updateUserDialogVisible: false,
      //添加新用户的对象
      addUserForm: {
        userId: "",
        userPwd: "123456",
        userName: "神秘人",
        userNumb: "",
        userLike: "",
        userAdd: "",
        userGend: "男",
      },

      //更新新用户时的对象
      updateUserForm: {
        userId: "",
        userPwd: "",
        userName: "",
        userNumb: "",
        userLike: "",
        userAdd: "",
        userGend: "",
      },

      //添加用户表单验证规则
      addUserFormRules: {
        userName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            min: 1,
            max: 8,
            message: "长度在 1 到 8 个字符",
            trigger: "blur",
          },
        ],
        userPwd: [
          { required: true, message: "请输入用户登录密码", trigger: "blur" },
          {
            min: 6,
            max: 13,
            message: "长度在 6 到 13 个字符",
            trigger: "blur",
          },
        ],
        userNumb: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern:
              /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/,
            message: "手机号码格式不符合",
            trigger: "blur",
          },
        ],
        userLike: [],
        userAdd: [{ required: true, message: "住址不可为空", trigger: "blur" }],
        userGend: [
          { required: true, message: "性别不可为空", trigger: "blur" },
        ],
      },

      //城市地址级联选择器数据
      citys,
    };
  },
  computed: {
    admin() {
      return this.$store.state.admin;
    },
  },
  methods: {
    //获取用户数据
    async getUser() {
      const { data: userRes } = await this.$http.get("user");
      this.user = userRes.data;
      console.log(this.user)
    },

    //添加用户的dialog对话框关闭时触发
    addUserDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },

    //添加新用户方法
    addUser() {
      //表单验证开始
      this.$refs.addUserFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("添加新用户验证失败");
          return;
        }
        //表单验证通过
        //首先检验该用户是否已经存在(电话号码)
        for (let i = 0; i < this.user.length; i++) {
          if (this.user[i].userNumb === this.addUserForm.userNumb) {
            this.$message.warning("该用户已存在,请勿重复添加");
            return;
          }
        }
        //该用户不存在
        this.addUserForm.userId = this.guid();
        this.addUserForm.userAdd = this.getLocationTransform(
          this.addUserForm.userAdd
        );
        const { data: addUserRes } = await this.$http.post(
          "user",
          this.addUserForm
        );
        if (addUserRes.code !== 200) {
          this.$message.error("服务器错误 添加用户失败!");
          this.getUser();
          return;
        }
        this.getUser();
        this.$message.success("添加新用户成功");
      });
      this.addUserDialogVisible = false;
    },

    //点击编辑按钮
    async showUpdateUser(userId) {
      const { data: userRes } = await this.$http.get("user/" + userId);
      this.updateUserForm = userRes.data[0];
      this.updateUserDialogVisible = true;
    },

    //点击确定发起更新请求
    updateUser() {
      //表单验证开始
      this.$refs.updateUserFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("更新用户信息验证失败");
          return;
        }
        const { data: isRepeatRes } = await this.$http.get(
          "user/login" + this.updateUserForm.userNumb
        );
        if (isRepeatRes.data.length > 0) {
          this.$message.error("账号重复 请重试");
          return;
        }
        //表单验证通过
        this.updateUserForm.userAdd = this.getLocationTransform(
          this.updateUserForm.userAdd
        );
        //发起请求
        const { data: updateUserRes } = await this.$http.put(
          "user",
          this.updateUserForm
        );
        if (updateUserRes.code !== 200) {
          this.$message.error("服务器错误 更新失败");
          this.getUser();
          return;
        }
        this.getUser();
        this.$message.success("更新用户信息成功");
      });
      this.updateUserDialogVisible = false;
    },

    //删除用户方法
    async deleteUser(userId) {
      const { data: deleteUserRes } = await this.$http.delete("user/" + userId);
      if (deleteUserRes.code !== 200) {
        this.$message.error("删除用户失败");
        this.getUser();
        return;
      }
      this.getUser();
      this.$message.success("删除用户成功！");
    },

    //获取唯一id的方法
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    //将用户的城市编号转化为中文显示
    getLocationTransform(cityArr) {
      //将所需要的城市编码信息列出来
      const location = cityArr;
      const locationProvince = location[0];
      const locationCity = location[1];
      const locationArea = location[2];
      //创建数组保存查询到的数组，减少查询次数
      var provinceArr = [];
      var cityArr = [];
      //最后用于存放城市中文字符的字符串
      var tansformLocation = "";
      //第一次得到省和市级数组
      this.citys.forEach((item) => {
        if (item.value === locationProvince) {
          tansformLocation = tansformLocation + item.label;
          provinceArr = item.children;
        }
      });
      //第二次得到市和区域级数组
      provinceArr.forEach((item) => {
        if (item.value === locationCity) {
          tansformLocation = tansformLocation + "/" + item.label;
          cityArr = item.children;
        }
      });
      //第三次得到完整省市区字符串
      cityArr.forEach((item) => {
        if (item.value === locationArea) {
          tansformLocation = tansformLocation + "/" + item.label;
        }
      });
      //返回该字符串
      return tansformLocation;
    },
  },
  created() {
    this.getUser();
  },
};
</script>
