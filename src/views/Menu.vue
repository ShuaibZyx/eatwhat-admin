<template>
  <el-card>
    <div class="menu" v-if="admin && admin.menuAuth === 1">
      <div class="title">
        <el-alert title="菜谱管理界面" type="success" center :closable="false">
        </el-alert>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          size="small"
          round
          icon="el-icon-plus"
          @click="addMenuClick"
          >添加新菜谱</el-button
        >
      </div>
      <div class="table">
        <el-table
          :data="
            menu.filter(
              (data) =>
                !menuSearch ||
                data.menuName.toLowerCase().includes(menuSearch.toLowerCase())
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
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="desc">
                <div class="desc-title">
                  <span>描述信息:</span>
                </div>
                <div class="brief">{{ scope.row.menuBrief || "暂无" }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="菜谱名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.menuName || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.menuPut"
                :preview-src-list="menuImgs"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>

          <el-table-column label="组成" align="center">
            <template slot-scope="scope">
              {{ scope.row.menuEle || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="口味" align="center">
            <template slot-scope="scope">
              {{ scope.row.menuTaste || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="菜系" align="center" width="100">
            <template slot-scope="scope">
              {{ scope.row.menuCuis || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="难度" align="center">
            <template slot-scope="scope">
              <el-rate
                v-model="scope.row.menuLevel"
                disabled
                text-color="#ff9900"
              >
              </el-rate>
            </template>
          </el-table-column>

          <el-table-column label="价格" align="center" width="100">
            <template slot-scope="scope">
              {{ scope.row.menuPrice }} 元
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="menuSearch"
                size="mini"
                placeholder="输入菜谱名称搜索"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="showUpdateMenu(scope.row.menuId)"
                >编辑</el-button
              >
              <el-popconfirm
                title="确定删除该菜谱?此操作不可逆"
                style="margin-left: 5px"
                @confirm="deleteMenu(scope.row.menuId)"
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

    <!-- 添加菜谱的dialog -->
    <el-dialog
      title="添加菜谱"
      :visible.sync="addMenuDialogVisible"
      width="40%"
      :center="true"
      @close="addMenuDialogClosed"
    >
      <el-form
        :model="addMenuForm"
        label-width="80px"
        size="small"
        ref="addMenuFormRef"
        :rules="addMenuFormRules"
      >
        <el-form-item label="菜谱名称" prop="menuName">
          <el-input
            prefix-icon="el-icon-food"
            v-model="addMenuForm.menuName"
            autocomplete="off"
            maxlength="50"
            :clearable="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="菜谱组成">
          <el-tag
            style="margin: 5px"
            :key="tag"
            v-for="tag in dynamicIngredientTags"
            closable
            :disable-transitions="false"
            @close="handleIngredientClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputIngredientVisible"
            v-model="inputIngredientValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ 原料</el-button
          >
        </el-form-item>

        <el-form-item label="预估价格" prop="menuPrice">
          <el-input
            v-model.number="addMenuForm.menuPrice"
            autocomplete="off"
            prefix-icon="el-icon-wallet"
            :clearable="true"
            maxlength="5"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="菜谱口味" prop="menuTaste">
          <el-select
            v-model="addMenuForm.menuTaste"
            filterable
            clearable
            placeholder="请选择菜谱口味"
          >
            <el-option
              v-for="item in menuTastes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜谱图片">
          <el-upload
            action="http://121.37.102.50:3006/menu/upload"
            ref="upload"
            :on-change="uploadImg"
            :on-success="uploadImgSuccess"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            list-type="picture"
            :limit="1"
            :disabled="uploadImgBtnVisible"
          >
            <el-button
              v-show="!uploadImgBtnVisible"
              size="small"
              type="primary"
              plain
              round
              >选择图片</el-button
            >
          </el-upload>
        </el-form-item>

        <el-form-item label="菜谱菜系" prop="menuCuis">
          <el-select
            v-model="addMenuForm.menuCuis"
            filterable
            clearable
            placeholder="请选择菜谱菜系"
          >
            <el-option
              v-for="item in menuCuis"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上手难度" prop="menuLevel">
          <el-input
            v-model.number="addMenuForm.menuLevel"
            autocomplete="off"
            prefix-icon="el-icon-star-off"
            :clearable="true"
            maxlength="1"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="菜谱简介">
          <el-input
            type="textarea"
            :rows="4"
            v-model.number="addMenuForm.menuBrief"
            autocomplete="off"
            prefix-icon="el-icon-star-off"
            :clearable="true"
            minlength="1"
            maxlength="255"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="addMenuDialogVisible = false"
          round
          plain
          size="small"
          type="info"
          >取 消</el-button
        >
        <el-button type="primary" @click="addMenu" round plain size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 更新菜谱信息的dialog -->
    <el-dialog
      title="更新菜谱信息"
      :visible.sync="updateMenuDialogVisible"
      width="40%"
      :center="true"
    >
      <el-form
        :model="updateMenuForm"
        label-width="80px"
        size="small"
        ref="updateMenuFormRef"
        :rules="addMenuFormRules"
      >
        <el-form-item label="菜谱名称" prop="menuName">
          <el-input
            prefix-icon="el-icon-food"
            v-model="updateMenuForm.menuName"
            autocomplete="off"
            maxlength="50"
            :clearable="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="菜谱组成">
          <el-tag
            style="margin: 5px"
            :key="tag"
            v-for="tag in dynamicIngredientTags"
            closable
            :disable-transitions="false"
            @close="handleIngredientClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputIngredientVisible"
            v-model="inputIngredientValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ 原料</el-button
          >
        </el-form-item>

        <el-form-item label="预估价格" prop="menuPrice">
          <el-input
            v-model.number="updateMenuForm.menuPrice"
            autocomplete="off"
            prefix-icon="el-icon-wallet"
            :clearable="true"
            maxlength="5"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="菜谱口味" prop="menuTaste">
          <el-select
            v-model="updateMenuForm.menuTaste"
            filterable
            clearable
            placeholder="请选择菜谱口味"
          >
            <el-option
              v-for="item in menuTastes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜谱图片">
          <el-upload
            action="http://121.37.102.50:3006/menu/upload"
            ref="updateUpload"
            :on-change="uploadImg"
            :on-success="updateImgSuccess"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            list-type="picture"
            :limit="1"
            :disabled="uploadImgBtnVisible"
          >
            <el-button
              v-show="!uploadImgBtnVisible"
              size="small"
              type="primary"
              plain
              round
              >选择图片</el-button
            >
          </el-upload>
        </el-form-item>

        <el-form-item label="菜谱菜系" prop="menuCuis">
          <el-select
            v-model="updateMenuForm.menuCuis"
            filterable
            clearable
            placeholder="请选择菜谱菜系"
          >
            <el-option
              v-for="item in menuCuis"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上手难度" prop="menuLevel">
          <el-input
            v-model.number="updateMenuForm.menuLevel"
            autocomplete="off"
            prefix-icon="el-icon-star-off"
            :clearable="true"
            maxlength="1"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="菜谱简介">
          <el-input
            type="textarea"
            :rows="4"
            v-model.number="updateMenuForm.menuBrief"
            autocomplete="off"
            prefix-icon="el-icon-star-off"
            :clearable="true"
            minlength="1"
            maxlength="255"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="updateMenuDialogVisible = false"
          round
          plain
          size="small"
          type="info"
          >取 消</el-button
        >
        <el-button type="primary" @click="updateMenu" round plain size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      menu: [],
      menuSearch: "",
      menuImgs: [],

      //添加新菜谱的dialog对话框可见性
      addMenuDialogVisible: false,
      //更新菜谱信息的dialog对话框可见性
      updateMenuDialogVisible: false,
      inputIngredientVisible: false,
      //添加图片按钮的可见性
      uploadImgBtnVisible: false,

      //添加新菜谱的对象
      addMenuForm: {
        menuName: "",
        menuId: "",
        menuEle: "",
        menuTaste: "",
        menuCuis: "",
        menuBrief: "",
        menuLevel: "",
        menuPut: "",
        menuPrice: "",
      },

      //更新菜谱的对象
      updateMenuForm: {
        menuName: "",
        menuId: "",
        menuEle: "",
        menuTaste: "",
        menuCuis: "",
        menuBrief: "",
        menuLevel: "",
        menuPut: "",
        menuPrice: "",
      },

      //添加菜谱表单验证规则
      addMenuFormRules: {
        menuName: [
          { required: true, message: "请输入菜谱名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        menuTaste: [
          { required: true, message: "请输入菜谱口味", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        menuCuis: [
          { required: true, message: "请输入菜谱菜系", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        menuLevel: [
          { required: true, message: "请填写上手难度", trigger: "blur" },
          {
            min: 1,
            max: 5,
            type: "number",
            message: "难度在1-5颗⭐",
            trigger: "blur",
          },
        ],
        menuPrice: [
          { required: true, message: "请填写菜谱预估价格", trigger: "blur" },
          {
            min: 1,
            max: 10000,
            type: "number",
            message: "价格在1万元以下",
            trigger: "blur",
          },
        ],
      },

      //菜谱组成原料数组
      dynamicIngredientTags: [],
      //新的tag名字
      inputIngredientValue: "",
      //菜谱口味数组
      menuTastes: [
        {
          label: "甜",
          value: "甜",
        },
        {
          label: "酸",
          value: "酸",
        },
        {
          label: "辣",
          value: "辣",
        },
        {
          label: "咸",
          value: "咸",
        },
        {
          label: "酸",
          value: "酸",
        },
        {
          label: "酸辣",
          value: "酸辣",
        },
        {
          label: "酸甜",
          value: "酸甜",
        },
        {
          label: "清淡",
          value: "清淡",
        },
        {
          label: "苦涩",
          value: "苦涩",
        },
        {
          label: "鲜香",
          value: "鲜香",
        },
      ],
      //菜谱菜系数组
      menuCuis: [
        {
          label: "川湘菜",
          value: "川湘菜",
        },
        {
          label: "鲁菜",
          value: "鲁菜",
        },
        {
          label: "东北菜",
          value: "东北菜",
        },
        {
          label: "西北菜",
          value: "西北菜",
        },
        {
          label: "粤菜",
          value: "粤菜",
        },
        {
          label: "徽菜",
          value: "徽菜",
        },
        {
          label: "西餐",
          value: "西餐",
        },
        {
          label: "主食",
          value: "主食",
        },
      ],
    };
  },
  computed: {
    admin() {
      return this.$store.state.admin;
    },
  },
  methods: {
    //获取所有菜谱
    async getMenu() {
      const { data: menuRes } = await this.$http.get("menu");
      this.menu = menuRes.data;
      //存入数组图片，用于查看大图
      menuRes.data.forEach((item) => {
        this.menuImgs.push(item.ingrePut);
      });
      console.log(this.menu)
    },

    //关闭新加菜谱的dialog对话框时触发
    addMenuDialogClosed() {
      this.$refs.addMenuFormRef.resetFields();
      this.addMenuForm.menuPut = "";
      this.uploadImgBtnVisible = false;
    },

    //处理原料tag关闭事件
    handleIngredientClose(tag) {
      this.dynamicIngredientTags.splice(
        this.dynamicIngredientTags.indexOf(tag),
        1
      );
    },

    //处理对于tag回车事件或失去焦点的方法，添加新的菜谱原料
    handleInputConfirm() {
      let inputValue = this.inputIngredientValue;
      if (inputValue) {
        this.dynamicIngredientTags.push(inputValue);
      }
      this.inputIngredientVisible = false;
      this.inputIngredientValue = "";
    },

    //点击新+原料事件触发方法
    showInput() {
      this.inputIngredientVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //上传图片前验证方法
    uploadImg(file, fileList) {
      if (file.status === "ready") {
        //文件类型，只能上传图片
        const isIMAGE = file.raw.type === "jpeg" || "png" || "jpg";
        //文件大小，小于2M
        const isLt1M = file.size / 1024 / 1024 < 2;
        if (!isIMAGE) {
          this.$message.warning("上传文件只能是图片格式!");
          fileList.pop();
          return;
        }
        if (!isLt1M) {
          this.$message.warning("上传文件大小不能超过 2MB!");
          fileList.pop();
          return;
        }
        this.uploadImgBtnVisible = true;
      }
    },

    //添加菜谱图片上传成功的回调
    uploadImgSuccess(response, file, fileList) {
      //将图片路径存储至对象中
      this.addMenuForm.menuPut = response.data;
      this.$message.success("图片上传成功,请填写完成后点击确定按钮");
    },

    //更新食材图片上传成功的回调
    updateImgSuccess(response, file, fileList) {
      //将图片路径存储至对象中
      this.updateMenuForm.menuPut = response.data;
      this.$message.success("图片上传成功,请填写完成后点击确定按钮");
    },

    //添加菜谱方法
    addMenu() {
      //表单验证开始
      this.$refs.addMenuFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("添加新菜谱验证失败");
          return;
        }
        //添加菜谱编号
        this.addMenuForm.menuId = this.guid().slice(1, 10);
        //添加菜谱组成，以|分隔
        //菜谱组成字符串
        this.addMenuForm.menuEle = this.dynamicIngredientTags.join("|");
        const { data: addMenuRes } = await this.$http.post(
          "menu",
          this.addMenuForm
        );
        if (addMenuRes.code !== 200) {
          this.$message.error("添加菜谱失败");
          this.getMenu();
          return;
        }
        this.getMenu();
        this.$message.success("添加菜谱成功！");
        this.dynamicIngredientTags = [];
      });
      this.addMenuDialogVisible = false;
      this.$refs.upload.uploadFiles = [];
      this.uploadImgBtnVisible = false;
    },

    //删除菜谱的方法
    async deleteMenu(menuId) {
      const { data: deleteMenuRes } = await this.$http.delete("menu/" + menuId);
      if (deleteMenuRes.code !== 200) {
        this.$message.error("删除菜谱失败");
        this.getMenu();
        return;
      }
      this.getMenu();
      this.$message.success("删除菜谱成功");
    },

    //点击编辑按钮
    async showUpdateMenu(menuId) {
      const { data: MenuRes } = await this.$http.get("menu/" + menuId);
      this.updateMenuForm = MenuRes.data[0];
      this.dynamicIngredientTags = MenuRes.data[0].menuEle.split("|");
      this.updateMenuDialogVisible = true;
    },

    //更新菜谱信息的方法
    updateMenu() {
      this.$refs.updateMenuFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("更新菜谱信息验证失败");
          return;
        }
        //表单验证通过
        //将菜谱组成变为字符串并赋值
        this.updateMenuForm.menuEle = this.dynamicIngredientTags.join("|");
        const {data: updateMenuRes} = await this.$http.put("menu", this.updateMenuForm);
        if (updateMenuRes.code !== 200) {
          this.$message.error("服务器错误 更新失败!")
          this.getMenu();
          return;
        }
        this.getMenu();
        this.$message.success("更新菜谱信息成功");
      });
      this.updateMenuDialogVisible = false;
      this.$refs.updateUpload.uploadFiles = [];
      this.uploadImgBtnVisible = false;
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

    addMenuClick() {
      this.addMenuDialogVisible = true;
      this.dynamicIngredientTags = [];
    },
  },
  created() {
    this.getMenu();
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
