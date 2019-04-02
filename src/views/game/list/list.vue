<template>
  <div>


<div class="line"></div>

<div style="margin-top:.5rem; padding:.5rem; width:100%; height:auto; border-bottom:1px solid #e0e0e0

;">

  <el-input size="small" clearable placeholder="请输入内容" v-model="search_cont" class="input-with-select" style="width:30rem;">
    <el-select size="small" v-model="search_tp" slot="prepend" placeholder="请选择">
      <el-option label="餐厅名" value="1"></el-option>
      <el-option label="订单号" value="2"></el-option>
      <el-option label="用户电话" value="3"></el-option>
    </el-select>
    <el-button size="small" slot="append" icon="el-icon-search"></el-button>
  </el-input>

  <el-button @click="createGame" icon="el-icon-circle-plus-outline" size="small" type="primary" style="margin-left:2rem;">
    新增游戏
  </el-button>

  <el-button icon="el-icon-refresh" size="small" type="primary" style="margin-left:2rem;">
    刷新全部
  </el-button>

</div>

<div class="line"></div>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="一周热评">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="一周组队">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="下载链接">
              <span>{{ props.row.category }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>


      <el-table-column label="游戏 ID" prop="id">

      <template slot-scope="scope">
        <div style="width:3rem; height:auto;">
          <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=634940746,532671922&fm=27&gp=0.jpg" style="max-width:100%;" alt="">
        </div>
      </template>

      </el-table-column>

      <el-table-column label="游戏名" prop="name">
      </el-table-column>
      <el-table-column label="图片logo" prop="desc">
      </el-table-column>
      <el-table-column label="热度" prop="desc">
      </el-table-column>
      <el-table-column label="平台" prop="desc">
      </el-table-column>

    </el-table>
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
        search_tp: '',
        search_cont: '',
        tableData: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }]
      }
    },
    methods: {
      createGame () {
        this.$router.push('/game/create')
      }, 
      test(obj) {
        console.log(this.search_tp)
      }
    }
  }
</script>