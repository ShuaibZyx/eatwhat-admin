<template>
  <el-card>
    <div class="ingredient" v-if="admin && admin.ingredientAuth === 1">
      <div class="title">
        <el-alert title="食材管理界面" type="success" center :closable="false">
        </el-alert>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          size="small"
          round
          icon="el-icon-plus"
          @click="addIngredientDialogVisible = true"
          >添加新食材</el-button
        >
      </div>
      <div class="table">
        <el-table
          :data="
            ingredient.filter(
              (data) =>
                !ingredientSearch ||
                data.ingreName
                  .toLowerCase()
                  .includes(ingredientSearch.toLowerCase())
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
          <el-table-column label="食材名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.ingreName || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.ingrePut"
                :preview-src-list="ingredientImgs"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>

          <el-table-column label="产地" align="center">
            <template slot-scope="scope">
              {{ scope.row.ingreAdd || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="属性" align="center">
            <template slot-scope="scope">
              {{ scope.row.ingreAttr || "未知" }}
            </template>
          </el-table-column>

          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              {{ scope.row.ingrePrice || "0" }} 元
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="ingredientSearch"
                size="mini"
                placeholder="输入食材名称搜索"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="showUpdateIngredient(scope.row.ingreId)"
                >编辑</el-button
              >
              <el-popconfirm
                title="确定删除该食材?此操作不可逆"
                style="margin-left: 5px"
                @confirm="deleteIngredient(scope.row.ingreId)"
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

    <!-- 添加食材的dialog -->
    <el-dialog
      title="添加食材"
      :visible.sync="addIngredientDialogVisible"
      width="40%"
      :center="true"
      @close="addIngredientDialogClosed"
    >
      <el-form
        :model="addIngredientForm"
        label-width="80px"
        size="small"
        ref="addIngredientFormRef"
        :rules="addIngredientFormRules"
      >
        <el-form-item label="食材名称" prop="ingreName">
          <el-input
            prefix-icon="el-icon-watermelon"
            v-model="addIngredientForm.ingreName"
            autocomplete="off"
            maxlength="50"
            :clearable="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="食材产地" prop="ingreAdd">
          <el-cascader
            style="width: 100%"
            v-model="addIngredientForm.ingreAdd"
            :options="citys"
            filterable
            clearable
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="食材属性" prop="ingreAttr">
          <el-select
            v-model="addIngredientForm.ingreAttr"
            filterable
            clearable
            placeholder="请选择食材属性"
          >
            <el-option
              v-for="item in ingreAttrs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="食材图片">
          <el-upload
            action="http://121.37.102.50:3006/ingredient/upload"
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

        <el-form-item label="预估价格" prop="ingrePrice">
          <el-input
            v-model.number="addIngredientForm.ingrePrice"
            autocomplete="off"
            prefix-icon="el-icon-coin"
            :clearable="true"
            minlength="1"
            maxlength="10"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="addIngredientDialogVisible = false"
          round
          plain
          size="small"
          type="info"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="addIngredient"
          round
          plain
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 更新食材信息的dialog -->
    <el-dialog
      title="更新食材信息"
      :visible.sync="updateIngredientDialogVisible"
      width="40%"
      :center="true"
    >
      <el-form
        :model="updateIngredientForm"
        label-width="80px"
        size="small"
        ref="updateIngredientFormRef"
        :rules="addIngredientFormRules"
      >
        <el-form-item label="食材名称" prop="ingreName">
          <el-input
            prefix-icon="el-icon-watermelon"
            v-model="updateIngredientForm.ingreName"
            autocomplete="off"
            maxlength="50"
            :clearable="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="食材产地" prop="ingreAdd">
          <el-cascader
            style="width: 100%"
            v-model="updateIngredientForm.ingreAdd"
            :options="citys"
            filterable
            clearable
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="食材属性" prop="ingreAttr">
          <el-select
            v-model="updateIngredientForm.ingreAttr"
            filterable
            clearable
            placeholder="请选择食材属性"
          >
            <el-option
              v-for="item in ingreAttrs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="食材图片">
          <el-upload
            action="http://121.37.102.50:3006/ingredient/upload"
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

        <el-form-item label="预估价格" prop="ingrePrice">
          <el-input
            v-model.number="updateIngredientForm.ingrePrice"
            autocomplete="off"
            prefix-icon="el-icon-coin"
            :clearable="true"
            minlength="1"
            maxlength="10"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="updateIngredientDialogVisible = false"
          round
          plain
          size="small"
          type="info"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="updateIngredient"
          round
          plain
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import citys from "../js/citys";
export default {
  name: "Ingredient",
  data() {
    return {
      ingredient: [],
      ingredientSearch: "",
      ingredientImgs: [],

      //添加新食材dialog对话框可见性
      addIngredientDialogVisible: false,
      //更新食材信息dialog可见性
      updateIngredientDialogVisible: false,
      //添加图片按钮的可见性
      uploadImgBtnVisible: false,

      //添加食材的表单对象
      addIngredientForm: {
        ingreName: "",
        ingreId: "",
        ingreAdd: "",
        ingreAttr: "",
        ingrePut: "",
        ingrePrice: "",
      },

      //更新食材的表单对象
      updateIngredientForm: {
        ingreName: "",
        ingreId: "",
        ingreAdd: "",
        ingreAttr: "",
        ingrePut: "",
        ingrePrice: "",
      },

      //添加食材的验证规则
      addIngredientFormRules: {
        ingreName: [
          { required: true, message: "请输入食材名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        ingreAdd: [
          { required: true, message: "请输入食材产地", trigger: "blur" },
        ],
        ingreAttr: [
          { required: true, message: "请输入食材属性", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        ingrePrice: [
          { required: true, message: "请输入食材价格", trigger: "blur" },
          {
            min: 1,
            max: 1000,
            type: "number",
            message: "价格低于1000元",
            trigger: "blur",
          },
        ],
      },

      //可选城市
      citys,
      //食材属性
      ingreAttrs: [
        {
          value: "热性",
          label: "热性",
        },
        {
          value: "温性",
          label: "温性",
        },
        {
          value: "平性",
          label: "平性",
        },
        {
          value: "凉性",
          label: "凉性",
        },
        {
          value: "寒性",
          label: "寒性",
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
    //获取所有食材
    async getIngredient() {
      const { data: ingredientRes } = await this.$http.get("ingredient");
      this.ingredient = ingredientRes.data;
      ingredientRes.data.forEach((item) => {
        this.ingredientImgs.push(item.ingrePut);
      });
      console.log(this.ingredient)
    },

    //添加食材dialog对话框关闭回调
    addIngredientDialogClosed() {
      this.$refs.addIngredientFormRef.resetFields();
      this.addIngredientForm.ingrePut = "";
      this.uploadImgBtnVisible = false;
    },

    //添加新食材方法
    addIngredient() {
      //表单验证开始
      this.$refs.addIngredientFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("添加新食材验证失败");
          return;
        }
        this.addIngredientForm.ingreId = this.guid().slice(1, 10);
        this.addIngredientForm.ingreAdd = this.getLocationTransform(
          this.addIngredientForm.ingreAdd
        );
        const { data: addIngredientRes } = await this.$http.post(
          "ingredient",
          this.addIngredientForm
        );
        if (addIngredientRes.code !== 200) {
          this.$message.error("添加新食材失败");
          return;
        }
        this.getIngredient();
        this.$message.success("添加新食材成功!");
      });
      this.addIngredientDialogVisible = false;
      this.uploadImgBtnVisible = false;
      this.$refs.upload.uploadFiles = [];
    },

    //删除食材的方法
    async deleteIngredient(ingreId) {
      const { data: deleteIngredientRes } = await this.$http.delete(
        "ingredient/" + ingreId
      );
      if (deleteIngredientRes.code !== 1) {
        this.$message.error("删除食材失败");
        return;
      }
      this.getIngredient();
      this.$message.success("删除食材成功");
    },

    //点击编辑按钮
    async showUpdateIngredient(ingreId) {
      const { data: ingredientRes } = await this.$http.get(
        "ingredient/" + ingreId
      );
      this.updateIngredientForm = ingredientRes.data[0];
      this.updateIngredientDialogVisible = true;
    },

    //更新食材信息的方法
    async updateIngredient() {
      //表单验证开始
      this.$refs.updateIngredientFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("更新食材信息验证失败");
          return;
        }
        this.updateIngredientForm.ingreAdd = this.getLocationTransform(
          this.updateIngredientForm.ingreAdd
        );
        //表单验证通过
        //发起请求
        const {data: updateIngredientRes} = await this.$http.put("ingredient", this.updateIngredientForm);
        if (updateIngredientRes.code !== 200) {
          this.$message.error("服务器错误 更新失败!")
          this.getIngredient();
          return;
        }
        this.getIngredient();
        this.$message.success("更新食材信息成功");
      });
      this.updateIngredientDialogVisible = false;
      this.$refs.updateUpload.uploadFiles = [];
      this.uploadImgBtnVisible = false;
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

    //添加食材图片上传成功的回调
    uploadImgSuccess(response, file, fileList) {
      //将图片路径存储至对象中
      this.addIngredientForm.ingrePut = response.data;
      this.$message.success("图片上传成功,请填写完成后点击确定按钮");
    },

    //更新食材图片上传成功的回调
    updateImgSuccess(response, file, fileList) {
      //将图片路径存储至对象中
      this.updateIngredientForm.ingrePut = response.data;
      this.$message.success("图片上传成功,请填写完成后点击确定按钮");
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
    this.getIngredient();
  },
};
</script>
