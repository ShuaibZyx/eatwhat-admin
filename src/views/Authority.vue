<template>
  <el-card>
    <div class="authority" v-if="admin && admin.power === 1">
      <div class="title">
        <el-alert title="权限管理界面" type="success" center :closable="false">
        </el-alert>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          size="small"
          round
          icon="el-icon-plus"
          @click="addAdminDialogVisible = true"
          >添加新管理员</el-button
        >
      </div>
      <div class="table">
        <el-table
          :data="
            admins.filter(
              (data) =>
                !adminSearch ||
                data.adminName.toLowerCase().includes(adminSearch.toLowerCase())
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
          <el-table-column label="管理员昵称" align="center">
            <template slot-scope="scope">
              {{ scope.row.adminName || "神秘人" }}
            </template>
          </el-table-column>

          <el-table-column label="手机号码" align="center">
            <template slot-scope="scope">
              {{ scope.row.adminNumb || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="登陆账号" align="center">
            <template slot-scope="scope">
              {{ scope.row.adminAcco || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="管理权限" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.menuAuth === 1" style="margin-right: 5px"
                >菜谱</el-tag
              >
              <el-tag
                v-if="scope.row.ingredientAuth === 1"
                style="margin-right: 5px"
                >食材</el-tag
              >
              <el-tag v-if="scope.row.userAuth === 1" style="margin-right: 5px"
                >用户</el-tag
              >

              <el-tag
                v-if="
                  scope.row.userAuth === 0 &&
                  scope.row.ingredientAuth === 0 &&
                  scope.row.menuAuth === 0
                "
                style="margin-right: 5px"
                >暂无权限</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="adminSearch"
                size="mini"
                placeholder="输入管理员名称搜索"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="showUpdateAdmin(scope.row.adminId)"
                >编辑</el-button
              >
              <el-button
                type="primary"
                size="mini"
                plain
                @click="resetPassword(scope.row.adminId)"
                >重置密码</el-button
              >
              <el-popconfirm
                title="确定删除该用户?此操作不可逆"
                style="margin-left: 5px"
                @confirm="deleteAdmin(scope.row.adminId)"
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
      title="添加管理员"
      :visible.sync="addAdminDialogVisible"
      width="37%"
      :center="true"
      @close="addAdminDialogClosed"
    >
      <el-form
        :model="addAdminForm"
        label-width="80px"
        size="small"
        ref="addAdminFormRef"
        :rules="addAdminFormRules"
      >
        <el-form-item label="昵称" prop="adminName">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="addAdminForm.adminName"
            autocomplete="off"
            maxlength="8"
            :clearable="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="adminNumb">
          <el-input
            v-model.number="addAdminForm.adminNumb"
            autocomplete="off"
            prefix-icon="el-icon-phone"
            :clearable="true"
            maxlength="11"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="adminPass">
          <el-input
            v-model="addAdminForm.adminPass"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            :clearable="true"
            minlength="6"
            maxlength="10"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="权限">
          <el-switch
            v-model="addAdminForm.menuAuth"
            active-text="菜谱"
            :active-value="1"
            :inactive-value="0"
            style="margin: 5px"
          >
          </el-switch>
          <el-switch
            v-model="addAdminForm.ingredientAuth"
            active-text="食材"
            :active-value="1"
            :inactive-value="0"
            style="margin: 5px"
          >
          </el-switch>
          <el-switch
            v-model="addAdminForm.userAuth"
            active-text="用户"
            :active-value="1"
            :inactive-value="0"
            style="margin: 5px"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="addAdminDialogVisible = false"
          round
          plain
          size="small"
          type="info"
          >取 消</el-button
        >
        <el-button type="primary" @click="addAdmin" round plain size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 更新管理员的dialog -->
    <el-dialog
      title="更新管理员信息"
      :visible.sync="updateAdminDialogVisible"
      width="37%"
      :center="true"
    >
      <el-form
        :model="updateAdminForm"
        label-width="80px"
        size="small"
        ref="updateAdminFormRef"
        :rules="addAdminFormRules"
      >
        <el-form-item label="昵称" prop="adminName">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="updateAdminForm.adminName"
            autocomplete="off"
            maxlength="8"
            :clearable="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="电话号码" prop="adminNumb">
          <el-input
            v-model.number="updateAdminForm.adminNumb"
            autocomplete="off"
            prefix-icon="el-icon-phone"
            :clearable="true"
            maxlength="11"
          ></el-input>
        </el-form-item>

        <el-form-item label="权限">
          <el-switch
            v-model="updateAdminForm.menuAuth"
            active-text="菜谱"
            :active-value="1"
            :inactive-value="0"
            style="margin: 5px"
          >
          </el-switch>
          <el-switch
            v-model="updateAdminForm.ingredientAuth"
            active-text="食材"
            :active-value="1"
            :inactive-value="0"
            style="margin: 5px"
          >
          </el-switch>
          <el-switch
            v-model="updateAdminForm.userAuth"
            active-text="用户"
            :active-value="1"
            :inactive-value="0"
            style="margin: 5px"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="updateAdminDialogVisible = false"
          round
          plain
          size="small"
          type="info"
          >取 消</el-button
        >
        <el-button type="primary" @click="updateAdmin" round plain size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "Authority",
  data() {
    return {
      //添加新的管理员Dialog对话框可见性
      addAdminDialogVisible: false,
      //更新管理员信息Dialog对话框可见性
      updateAdminDialogVisible: false,
      //所有除最高管理员之外的管理员
      admins: [],
      //添加新管理员表单对象
      addAdminForm: {
        adminId: "",
        adminNumb: "",
        adminName: "",
        power: 0,
        adminPass: "",
        adminAcco: "",
        menuAuth: 0,
        ingredientAuth: 0,
        userAuth: 0,
      },

      //更新管理员的表单对象
      updateAdminForm: {
        adminNumb: "",
        adminName: "",
        menuAuth: 0,
        ingredientAuth: 0,
        userAuth: 0,
      },

      //管理员表单验证规则
      addAdminFormRules: {
        adminName: [
          { required: true, message: "请输入管理员昵称", trigger: "blur" },
          {
            min: 1,
            max: 8,
            message: "长度在 1 到 8 个字符",
            trigger: "blur",
          },
        ],
        adminPass: [
          { required: true, message: "请输入管理员登录密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
        adminNumb: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern:
              /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/,
            message: "电话号码格式不符",
            trigger: "blur",
          },
        ],
      },

      //管理员列表搜索条件
      adminSearch: "",
    };
  },
  computed: {
    admin() {
      return this.$store.state.admin;
    },
  },
  methods: {
    //获得所有管理员
    async getAdmins() {
      const { data: adminsRes } = await this.$http.get("admin");
      if (adminsRes.code !== 200) {
        this.$message.error("管理员信息加载失败");
        return;
      }
      this.admins = adminsRes.data;
    },

    //添加管理员的dialog对话框关闭时触发
    addAdminDialogClosed() {
      this.$refs.addAdminFormRef.resetFields();
    },

    //点击添加按钮添加管理员
    addAdmin() {
      //表单验证开始
      this.$refs.addAdminFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("添加新管理员验证失败");
          return;
        }
        //判断管理员是否已经存在
        for (let i = 0; i < this.admins.length; i++) {
          if (this.admins[i].adminNumb === this.addAdminForm.adminNumb) {
            //该管理员已存在
            this.$message.warning("该管理员已存在,请勿重复添加");
            return;
          }
        }
        //该管理员不存在
        //填入管理员id与管理员登录账号
        this.addAdminForm.adminId = this.guid();
        this.addAdminForm.adminAcco = this.guid().slice(1, 8);
        const { data: addAdminRes } = await this.$http.post(
          "admin",
          this.addAdminForm
        );
        if (addAdminRes.code === 200) {
          this.$message.success("添加新管理员成功");
          this.getAdmins();
        } else {
          this.$message.error("服务器错误");
          this.getAdmins();
        }
        this.addAdminDialogVisible = false;
      });
    },

    //点击编辑按钮
    async showUpdateAdmin(adminId) {
      const { data: adminRes } = await this.$http.get("admin/" + adminId);
      this.updateAdminForm = { ...this.updateAdminForm, ...adminRes.data[0] };
      this.updateAdminDialogVisible = true;
    },

    //点击确定发起更新请求
    updateAdmin() {
      //表单验证开始
      this.$refs.updateAdminFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("更新管理员信息验证失败");
          return;
        }
        //表单验证通过,发起请求
        const { data: updateRes } = await this.$http.put(
          "admin",
          this.updateAdminForm
        );
        if (updateRes.code === 200) {
          this.getAdmins();
          this.$message.success("更新管理员信息成功");
        } else {
          this.getAdmins();
          this.$message.error("服务器错误");
        }
      });
      this.updateAdminDialogVisible = false;
    },

    //删除用户方法
    async deleteAdmin(adminId) {
      const { data: deleteAdminRes } = await this.$http.delete(
        "admin/" + adminId
      );
      if (deleteAdminRes.code === 200) {
        this.getAdmins();
        this.$message.success("删除管理员成功！");
      } else {
        this.getAdmins();
        this.$message.error("服务器错误");
      }
    },

    //重置管理员密码方法
    async resetPassword(adminId) {
      const { data: resetPasswordRes } = await this.$http.post(
        "admin/password/" + adminId,
        {
          password: "123456",
        }
      );
      if (resetPasswordRes.code === 200) {
        this.$message.success("密码重置成功");
      } else {
        this.$message.error("服务器错误");
      }
    },

    //获取唯一id值方法
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
  },
  created() {
    this.getAdmins();
  },
};
</script>

<style scoped></style>
