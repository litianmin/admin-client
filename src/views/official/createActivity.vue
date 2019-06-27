<template>
  <el-form ref="form" label-width="80px" style="margin-top:1rem; padding: 1rem 2rem;">
    <el-form-item label="活动标题">
      <el-input clearable v-model="Title" class="input-width-one" placeholder="不能超过25个字符" maxlength="25"></el-input>
    </el-form-item>

    <el-form-item label="活动类型">
      <el-select v-model="Type" placeholder="请选择游戏平台">
        <el-option label="官方组队" value="1"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="活动时间">
      <el-date-picker
        v-model="Time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>

    <!-- BEGIN 活动选址 -->
    <el-form-item label="活动地点">
      <svg-icon icon-class="locate" style="font-size:20px;" />
      <span style="font-size:12px; color:#757575;">{{ Venue.addr }}</span>

      <div id="container" style="width:650px; height:450px; position:relative;" tabindex="0">
        <div id="pickerBox" style="position:absolute; top:10px; right:20px; z-index:999;">
            <input id="pickerInput" style="width:300px; border-radius:.3rem; padding:.5rem; border:1px solid #009688;" placeholder="输入关键字选取地点" />
            <div id="poiInfo"></div>
        </div>
      </div>
    </el-form-item>
    <!-- END 活动选址 -->


    <el-form-item label="宣传图片">
      <el-upload
        class="avatar-uploader"
        action="/api/upload"
        :headers="uploadHeader"
        :data="logoImgUploadData"
        :show-file-list="false"
        :on-success="handleImgUploadSuccess"
        :before-upload="beforeImgUpload">
        <img v-if="DisplayImg" :src="DisplayImg" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="招募人数">
      <el-input clearable v-model="RecruitNumb" class="input-width-one" placeholder="请输入招募人数"></el-input>
    </el-form-item>

    <!-- BEGIN 详细内容编辑 -->
    <el-form-item label="主要内容">
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
import { CreateGame } from '@/api/game.js'
import E from 'wangeditor'

import mymap from '@/assets/js/AMap.js'

export default {
  data() {
    return {
      Title: '',
      Type: '1',
      Time: [new Date(), new Date()],
      Venue: {
        addr: '',
        lng: 0,
        lat: 0,
        name: ''
      }, 
      DisplayImgForSave: '',


      DisplayImg: '',
      RecruitNumb: '',

      uploadHeader: {
        "self-token": getToken()
      },
      logoImgUploadData: {
        imgTp: 'officialActivity'
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
      imgTp: 'officialActivityDetail'
    }
    editor.customConfig.uploadImgHeaders = {
      'self-token': getToken()
    }
    editor.customConfig.uploadImgMaxLength = 5

    editor.customConfig.debug = true

    editor.create()



    // 创建一个高德地图
    let map = new AMap.Map('container', {
      zoom: 10
    })

    AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

        let poiPicker = new PoiPicker({
            //city:'北京',
            input: 'pickerInput'
        })

        //初始化poiPicker, 并且指定处理选择地址后的函数
        mymap.poiPickerReady(poiPicker, map, newThis.dealwithChooseAddr)
    })

  },
  methods: {
    onSubmit() {
      
      // 提交游戏基本信息
      let title = this.Title
      let time = this.Time
      let venue = this.Venue
      let recruitNumb = this.RecruitNumb
      let detail = this.EditorContent

      if(title.length == 0) {
        this.$message('活动标题不能为空')
        return
      }

      let activityBeginTime = parseInt(time[0].getTime() / 1000)  // 活动开始时间
      let activityEndTime = parseInt(time[1].getTime() / 1000)  // 活动结束时间

      if(venue.name == '') {
        this.$message('活动地址不能为空')
        return
      }

      if(this.DisplayImgForSave == '') {
        this.$message('展示图片不能为空')
        return
      }

      if(detail.length == 0) {
        this.$message('活动详细内容不能为空')
        return
      }

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


    // gameDisplayImgRemove(file, fileList) {
    //   console.log(file.uid)
    //   for(let k in this.displayImgArr) {
    //     console.log(k)
    //     if(file.uid == k) {
    //       delete this.displayImgArr[k]
    //     }
    //   }
    //   console.log(this.displayImgArr)
    // },
    // gameDisplayImgPreview(file) {
    //   this.dialogImageUrl = file.url
    //   this.dialogVisible = true
    // },
    // gameDisplayImgSuccess(res, file) {
    //   this.displayImgArr[file.uid] = res.mini_img
    //   console.log(this.displayImgArr)
    // },

    dealwithChooseAddr (addrObj) {  // 选择地址后做处理
      this.Venue.addr = addrObj.address
      this.Venue.name = addrObj.name
      let obj = addrObj.location.split(',') 
      this.Venue.lng = Number(obj[0])
      this.Venue.lat = Number(obj[1])
      console.log(this.Venue)
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

