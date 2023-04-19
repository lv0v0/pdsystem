<template>
  <div>

    <div style="margin: 7px 0">
      <!--placeholder:默认提示   -->
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button style="margin-left: 5px;" @click="load">搜索</el-button>
      <el-button style="margin-left: 5px;" @click="reset" type="warning">重置</el-button>
    </div>

    <div style="margin-bottom:5px">
      <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
      <el-button type="primary" @click="delBatch">批量删除<i class="el-icon-remove-outline"></i></el-button>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="工具名称" width="140">
      </el-table-column>
      <el-table-column prop="tnumber" label="工具型号" width="120">
      </el-table-column>
      <el-table-column prop="brandId" label="工具品牌" width="120">
      </el-table-column>
      <el-table-column prop="type" label="工具类别" width="120">
      </el-table-column>
      <el-table-column prop="description" label="设备描述" >
      </el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference">删除<i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">

      <!--分页查询-->
      <!--pageNum 和 pageSize 由前端传递          -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"

          :current-page="pageNum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog title="设备信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="工具名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工具型号">
          <el-input v-model="form.tnumber" :step="2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select clearable v-model="form.brandId" placeholder="请选择品牌" style="width: 100%">
            <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工具类别">
          <el-input v-model="form.type" :step="2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工具描述">
          <el-input v-model="form.description" :step="2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "V_UnitType",
  data(){
    return{
      tableData: [],
      name:"",
      total:0,
      pageNum:1,
      pageSize:5,
      dialogFormVisible:false,
      form:{},
      multipleSelection:[],
      serverIp:serverIp,
      brands:[],
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods:{
    //将事件绑定到方法中
    load(){
      this.request.get("/tool/page", {
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          name:this.name
        }
      }).then(res=>{
        this.tableData = res.data.records
        this.total = res.data.total
      })

      this.request.get("/brand").then(res => {
        console.log(res.data)
        this.brands = res.data
      })

    },

    //获取当前页码，并将此页码写入并重新绑定
    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.load()
    },

    //重置按钮，清空
    reset(){
      this.name=""
      this.load()
    },

    //打开新增功能
    handleAdd(){
      this.dialogFormVisible = true
      this.form = {}
    },

    //新增/编辑用户信息
    save(){
      this.request.post("/tool", this.form).then(res => {
        if(res.code === '200'){
          this.$message.success("保存成功")
        }else {
          this.$message.error("保存失败")
        }
        this.dialogFormVisible = false;
        this.load()
      })
    },

    //删除信息
    del(id){
      this.request.delete("/tool/" + id).then(res =>{
        if(res.code === '200'){
          this.$message.success("删除成功")
        }else {
          this.$message.error("删除失败")
        }
        this.dialogFormVisible = false;
        this.load()
      })
    },

    delBatch(){
      let ids = this.multipleSelection.map(v => v.id) //[{},{},{}] =>[1,2,3]
      this.request.post("/unittype/del/batch", ids).then(res =>{
        if(res){
          this.$message.success("批量删除成功")
        }else {
          this.$message.error("删除失败")
        }
        this.dialogFormVisible = false;
        this.load()
      })
    },

    handleSelectionChange(val){
      this.multipleSelection = val
    },

    handleEdit(row){
      this.form = row
      this.dialogFormVisible = true
    },


  }
}
</script>

<style scoped>

</style>