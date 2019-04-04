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
        <img v-if="gameInfo.logoImg" :src="gameInfo.logo" class="avatar">
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
import { CreateGame } from '@/api/game.js'
export default {
  data() {
    return {
      gameInfo: {
        name: '',
        platform: '',
        logo: '',
        logoImg: '',
        logoMiniImg: '',
        downloadLink: '',
        briefDesc: ''
      },
      displayImgArr: {},
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
      // 提交游戏基本信息
      // console.log('游戏名称：'+this.gameInfo.name)
      // console.log('游戏平台：'+this.gameInfo.platform)
      // console.log('游戏logo原图：'+this.gameInfo.logoImg)
      // console.log('游戏logo缩略图：'+this.gameInfo.logoMiniImg)
      // console.log('游戏展示图：'+this.displayImgArr)
      // console.log('游戏下载链接：'+this.gameInfo.downloadLink)
      // console.log('游戏简单描述：'+this.gameInfo.briefDesc)
      // console.log('submit!')

      if(!!this.gameInfo.name === false) {
        this.$message('游戏名称不能为空')
        return
      }

      if(!!this.gameInfo.logoImg === false) {
        this.$message('游戏logo不能为空')
        return
      }

      if(!!this.gameInfo.displayImgArr === false) {
        this.$message('展示内容不能为空')
        return
      }

      // 组装信息
      let gameInfoPost = {}
      let displayImgList = []
      for(let k in this.displayImgArr) {
        displayImgList.push(this.displayImgArr[k])
      }

      // 提交数据
      CreateGame(this.gameInfo.name, this.gameInfo.platform, this.gameInfo.logoImg, this.gameInfo.logoMiniImg, displayImgList, this.gameInfo.downloadLink, this.gameInfo.briefDesc).then((data)=>{
        if(data.code == 20000) {
          this.$message('添加成功')
          this.$router.push('/game')
        }
      })
    },
    handleLogoSuccess(res, file) {

      // 结果返回代码和图片链接
      if(res.code == 20000) { // 上传成功，保存图片
        this.gameInfo.logoImg = res.origin_img
        this.gameInfo.logoMiniImg = res.mini_img
      }
      this.gameInfo.logo = URL.createObjectURL(file.raw);
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
      for(let k in this.displayImgArr) {
        console.log(k)
        if(file.uid == k) {
          delete this.displayImgArr[k]
        }
      }
      console.log(this.displayImgArr)
    },
    gameDisplayImgPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    gameDisplayImgSuccess(res, file) {
      this.displayImgArr[file.uid] = res.mini_img
      console.log(this.displayImgArr)
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

