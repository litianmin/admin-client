<template>
  <el-form ref="form" :model="form" label-width="80px" style="margin-top:1rem; padding: 1rem 2rem;">
    <el-form-item label="游戏名称">
      <el-input clearable v-model="form.name" class="input-width-one"></el-input>
    </el-form-item>

    <el-form-item label="游戏类型">
      <el-select v-model="form.region" placeholder="请选择游戏平台">
        <el-option label="端游" value="shanghai"></el-option>
        <el-option label="手游" value="beijing"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="游戏logo">
      <el-upload
        class="avatar-uploader"
        action="/api/upload"
        :headers="myheader"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="宣传图片">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>

    <el-form-item label="下载链接">
      <el-input autosize type="textarea" class="textarea-width-one" size="medium" v-model="form.desc"></el-input>
    </el-form-item>

    <el-form-item label="简单描述">
      <el-input rows="5" type="textarea" class="textarea-width-one" size="medium" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>


  </el-form>

</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      myheader: {
        "self-token": 'sorry-ucantnontdothat'
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.form.name)
      console.log('submit!');
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }

  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }

  .input-width-one{ width: 25rem; }
  .textarea-width-one{ width:28rem; }
</style>

