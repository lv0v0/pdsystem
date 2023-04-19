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
<!--      <el-upload
          :action="'http://'+ serverIp +':9090/user/import'" style="display: inline-block;margin: 0 10px"
          :show-file-list="false" accept=".xlsx" :on-success="handleExcelImportSuccess" >
        <el-button type="primary">导入<i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button type="primary" @click="exp">导出<i class="el-icon-top"></i></el-button>-->
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称" width="140">
      </el-table-column>
      <el-table-column prop="level" label="等级" width="120">
      </el-table-column>
      <el-table-column prop="linkman" label="联系人" width="120">
      </el-table-column>
      <el-table-column prop="telephone" label="联系电话" width="120">
      </el-table-column>
      <el-table-column prop="description" label="备注" >
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
        <el-form-item label="公司名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司等级">
          <el-input v-model="form.level" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司联络人">
          <el-input v-model="form.linkman" :step="2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.telephone" :step="2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
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
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods:{
    //将事件绑定到方法中
    load(){
      this.request.get("/brand/page", {
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          name:this.name
        }
      }).then(res=>{
        this.tableData = res.data.records
        this.total = res.data.total
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
      this.request.post("/brand", this.form).then(res => {
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
      this.request.delete("/brand/" + id).then(res =>{
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
      this.request.post("/brand/del/batch", ids).then(res =>{
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