<template>
  <el-form ref="form" label-width="80px" style="margin-top:1rem; padding: 1rem 2rem;">
    <el-form-item label="文章标题">
      <el-input clearable v-model="Title" class="input-width-one" placeholder="不能超过40个字符" maxlength="40"></el-input>
    </el-form-item>

    <el-form-item label="文章类型">
      <el-select v-model="Type" placeholder="请选择类型">
        <el-option label="话 题" value="1"></el-option>
        <el-option label="美 文" value="1"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="展示时间">
      <el-date-picker
        v-model="ShowTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>

    <el-form-item label="展示图片">
      <el-upload
        class="avatar-uploader"
        action="/api/upload"
        :headers="uploadHeader"
        :data="ImgUploadData"
        :show-file-list="false"
        :on-success="handleImgUploadSuccess"
        :before-upload="beforeImgUpload">
        <img v-if="DisplayImg" :src="DisplayImg" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <!-- BEGIN 详细内容编辑 -->
    <el-form-item label="文章内容">
      <div ref="editor" style="width:65rem;"></div>
    </el-form-item>


    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>


  </el-form>

</template>

<script>
import { getToken } from '@/utils/auth.js'
import newApi from '@/api/official.js'
import E from 'wangeditor'

export default {
  data() {
    return {
      Title: '',
      Type: '1',
      ShowTime: [new Date(), new Date()],
      DisplayImgForSave: '',
      DisplayImg: '',
      uploadHeader: {
        "self-token": getToken()
      },
      ImgUploadData: {
        imgTp: 'article'
      },

      EditorContent: '',

    }
  },
  mounted () {
    let newThis = this

    // 创建富文本框
    let editor = new E(this.$refs.editor)
    editor.customConfig.onchange = (html) => {
      this.EditorContent = html
    }
    editor.customConfig.uploadImgServer = '/api/upload'
    editor.customConfig.uploadImgParams = {
      imgTp: 'articleDetail'
    }
    editor.customConfig.uploadImgHeaders = {
      'self-token': getToken()
    }
    editor.customConfig.uploadFileName = 'file'

    editor.customConfig.uploadImgMaxLength = 5

    editor.customConfig.debug = true

    editor.create()

  },
  methods: {
    onSubmit() {
      
      // 提交游戏基本信息
      let title = this.Title
      let time = this.ShowTime
      let detail = this.EditorContent

      if(title.length == 0) {
        this.$message('活动标题不能为空')
        return
      }

      let displayBeginTime = parseInt(time[0].getTime() / 1000)  // 活动开始时间
      let displayEndTime = parseInt(time[1].getTime() / 1000)  // 活动结束时间

      if(this.DisplayImgForSave == '') {
        this.$message('展示图片不能为空')
        return
      }

      if(detail.length == 0) {
        this.$message('文章内容不能为空')
        return
      }

      let data = {
        title: title,
        type: Number(this.Type),
        displayBeginTime,
        displayEndTime,
        displayImg: this.DisplayImgForSave,
        cont: detail,
      }

      newApi.CreateOfficialActivity(data).then((resp)=>{
        console.log(resp)
      })
      
    },


    handleImgUploadSuccess(res, file) { // 上传图片成功处理
      console.log(res)
      // 结果返回代码和图片链接
      if(res.code == 20000) { // 上传成功，保存图片
        this.DisplayImgForSave = res.msg
        this.DisplayImg = URL.createObjectURL(file.raw);
      }else{
        this.$message(res.msg)
      }
    },


    beforeImgUpload(file) { // 图片上传之前做判断

      // logo 上传之前判断是否符合图片的格式和尺寸
      const imgTp = (file.type === 'image/jpeg' || file.type === 'image/png')
      const imgSize = file.size / 1024 / 1024 < 5

      if (!imgTp) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!imgSize) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return imgTp && imgSize
    },

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
    display: flex;
    align-content: center;
    justify-content: center;
    width:245px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 245px;
    height: 148px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    max-width: 245px;
    max-height: 148px;
    display: inline-block;
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

    /* .amap-demo {
      height: 300px;
    } */

    .search-box {
      position: absolute;
      top: 55px;
      left: 20px;
    }

    .amap-page-container {
      margin-top:-2rem;
      margin-bottom:4rem;
      width:600px;;
      height:400px;
      position: relative;
    }

</style>

