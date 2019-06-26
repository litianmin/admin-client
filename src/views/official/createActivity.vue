<template>
  <el-form ref="form" label-width="80px" style="margin-top:1rem; padding: 1rem 2rem;">
    <el-form-item label="活动标题">
      <el-input clearable v-model="Title" class="input-width-one"></el-input>
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

    <el-form-item label="活动地点">
      <svg-icon icon-class="locate" style="font-size:20px;" />

      <!-- <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo">
          <el-amap-marker v-for="marker in markers" :position="marker" ></el-amap-marker>
        </el-amap>
      </div> -->


  <!-- <div class="test" style="width:600px; height:400px;">
    <div id="container" style="width:600px; height:400px;"></div>
  </div> -->


   <div id="container" style="width:600px; height:400px;" tabindex="0"></div>
   <div id="pickerBox">
       <input id="pickerInput" placeholder="输入关键字选取地点" />
       <div id="poiInfo"></div>
   </div>

    </el-form-item>


    <el-form-item label="宣传图片">
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

    <!-- <el-form-item label="宣传图片(640*320)">
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
    </el-form-item> -->

    <el-form-item label="招募人数">
      <el-input clearable v-model="gameInfo.name" class="input-width-one"></el-input>
    </el-form-item>

    <el-form-item label="主要内容">
      <div ref="editor" style=""></div>
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
     let self = this;
    return {
      Title: '',
      Type: '1',
      Time: [new Date(), new Date()],

      markers: [

      ],
      searchOption: {
        citylimit: false
      },
      mapCenter: [121.59996, 31.197646],


      value1: [new Date(), new Date()],
      gameInfo: {
        name: '',
        platform: '1',
        logo: '',
        logoImg: '',
        logoMiniImg: '',
        downloadLink: '',
        briefDesc: '',
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
      dialogVisible: false,
      gameTabs: [
        {value: 3, name: '角色扮演'},
        {value: 4, name: '3D'},
        {value: 5, name: '动作'},
      ],
      tabChoose: [],
      editorContent: '',

      map: null

    }
  },
  mounted () {
    var editor = new E(this.$refs.editor)
    editor.customConfig.onchange = (html) => {
      this.editorContent = html
    }
    editor.customConfig.uploadImgServer = '/upload'
    editor.create()



    // let that = this
    // mymap.MapLoader().then(AMap => {
    //   console.log('地图加载成功')
    //   that.map = new AMap.Map('container', {
    //     center: [117.000923, 36.675807],
    //     zoom: 11
    //   })
    // }, e => {
    //   console.log('地图加载失败' ,e)
    // })


    var map = new AMap.Map('container', {
      zoom: 10
    });

    AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

        var poiPicker = new PoiPicker({
            //city:'北京',
            input: 'pickerInput'
        });

        //初始化poiPicker
        mymap.poiPickerReady(poiPicker, map);
    });

  },
  watch: {
    tabChoose (val) {
      console.log(val)
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

      if(!!this.displayImgArr === false) {
        this.$message('展示内容不能为空')
        return
      }

      // 组装信息
      let gameInfoPost = {}
      let displayImgList = []
      for(let k in this.displayImgArr) {
        displayImgList.push(this.displayImgArr[k])
      }

      console.log(displayImgList) 
      // return

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
    },

        // addMarker: function() {
        //   let lng = 121.5 + Math.round(Math.random() * 1000) / 10000
        //   let lat = 31.197646 + Math.round(Math.random() * 500) / 10000
        //   this.markers.push([lng, lat])
        // },
        // onSearchResult(pois) {
        //   console.log(pois)
        //   return
        //   let latSum = 0
        //   let lngSum = 0
        //   if (pois.length > 0) {
        //     pois.forEach(poi => {
        //       let {lng, lat} = poi
        //       lngSum += lng
        //       latSum += lat
        //       this.markers.push([poi.lng, poi.lat])
        //     })
        //     let center = {
        //       lng: lngSum / pois.length,
        //       lat: latSum / pois.length
        //     }
        //     this.mapCenter = [center.lng, center.lat]
        //   }
        // },


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

