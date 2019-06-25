<template>
  <div>

    <div class="line"></div>

    <div style="margin-top:.5rem; padding:.5rem; width:100%; height:auto; border-bottom:1px solid #e0e0e0;">

      <!-- <el-input size="small" clearable placeholder="请输入内容" class="input-with-select" style="width:30rem;">
        <el-select size="small" slot="prepend" placeholder="请选择">
          <el-option label="餐厅名" value="1"></el-option>
          <el-option label="订单号" value="2"></el-option>
          <el-option label="用户电话" value="3"></el-option>
        </el-select>
        <el-button size="small" slot="append" icon="el-icon-search"></el-button>
      </el-input> -->

      <el-button @click="createActivity" icon="el-icon-circle-plus-outline" size="small" type="primary" style="margin-left:2rem; background:#00bcd4;">
        创建活动
      </el-button>

      <el-button icon="el-icon-refresh" size="small" type="primary" style="margin-left:2rem; background:#00bcd4;">
        刷新全部
      </el-button>

    </div>

  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

</style>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      createActivity () {
        this.$router.push('/official/create')
      }, 
      test(obj) {
        console.log(this.search_tp)
      }
    }
  }
</script>