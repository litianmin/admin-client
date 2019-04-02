<template>
  <el-form ref="form" :model="gameInfo" label-width="80px" style="margin-top:1rem; padding: 1rem 2rem;">
    <el-form-item label="游戏名称">
      <el-input clearable v-model="gameInfo.name" class="input-width-one"></el-input>
    </el-form-item>

    <el-form-item label="游戏类型">
      <el-select v-model="gameInfo.platform" placeholder="请选择游戏平台">
        <el-option label="端游" value="pc"></el-option>
        <el-option label="手游" value="mobile"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="游戏logo">
      <el-upload
        class="avatar-uploader"
        action="/api/upload"
        :headers="uploadHeader"
        :data="logoImgUploadData"
        :show-file-list="false"
        :on-success="handleLogoSuccess"
        :before-upload="beforeImgUpload">
        <img v-if="gameInfo.logoImg" :src="gameInfo.logoImg" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="宣传图片">
      <el-upload
        action="/api/upload"
        :headers="uploadHeader"
        :data="displayImgUploadData"
        list-type="picture-card"
        :on-preview="gameDisplayImgPreview"
        :on-success="gameDisplayImgSuccess"
        :on-remove="gameDisplayImgRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>

    <el-form-item label="下载链接">
      <el-input autosize type="textarea" class="textarea-width-one" size="medium" v-model="gameInfo.downloadLink"></el-input>
    </el-form-item>

    <el-form-item label="简单描述">
      <el-input rows="5" type="textarea" class="textarea-width-one" size="medium" v-model="gameInfo.briefDesc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>


  </el-form>

</template>

<script>
import { getToken } from '@/utils/auth.js'
export default {
  data() {
    return {
      gameInfo: {
        name: '',
        platform: '',
        logoImg: '',
        logoMiniImg: '',
        downloadLink: '',
        briefDesc: ''
      },
      myArr: {},
      uploadHeader: {
        "self-token": getToken()
      },
      logoImgUploadData: {
        imgTp: 'gamelogo'
      },
      displayImgUploadData: {
        imgTp: 'gameDisplayImg'
      },
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    onSubmit() {
      console.log(this.gameInfo.name)
      console.log('submit!');
    },
    handleLogoSuccess(res, file) {
      console.log()

      // 结果返回代码和图片链接
      // if(res.code == 20000) { // 上传成功，保存图片
      //   this.gameInfo.logoImg = res.origin_img
      //   this.gameInfo.logoMiniImg = res.mini_img
      // }
      // console.log(res)
      this.gameInfo.logoImg = URL.createObjectURL(file.raw);
    },
    beforeImgUpload(file) {

      // logo 上传之前判断是否符合图片的格式和尺寸
      const imgTp = (file.type === 'image/jpeg' || file.type === 'image/png')
      const imgSize = file.size / 1024 / 1024 < 2

      if (!imgTp) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!imgSize) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return imgTp && imgSize
    },
    gameDisplayImgRemove(file, fileList) {
      console.log(file.uid)
      for(let k in this.myArr) {
        console.log(k)
        if(file.uid == k) {
          delete this.myArr[k]
        }
      }
      console.log(this.myArr)
    },
    gameDisplayImgPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    gameDisplayImgSuccess(res, file) {
      this.myArr[file.uid] = res.mini_img
      console.log(this.myArr)
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


.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 245px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
}

.el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 245px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
}

</style>

