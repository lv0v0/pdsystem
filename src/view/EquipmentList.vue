<template>
  <div>

    <div style="margin: 7px 0">
      <!--placeholder:默认提示   -->
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="名称" value="1"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
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

    <el-table :data="tableData" @selection-change="handleSelectionChange" border   :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="设备名称" width="140">
      </el-table-column>
      <el-table-column prop="utype" label="设备型号" width="120">
      </el-table-column>
      <el-table-column prop="wprocess" label="设备工序">
      </el-table-column>
      <el-table-column prop="resPerson" label="责任人">
      </el-table-column>
      <el-table-column prop="ttype" label="工具类型">
      </el-table-column>
      <el-table-column prop="plantId" label="所属厂房">
      </el-table-column>
      <el-table-column prop="house" label="生产产品">
      </el-table-column>
      <el-table-column prop="state" label="设备状态">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.state === '故障'">故障</el-tag>
          <el-tag type="process" v-if="scope.row.state === '工作'">工作</el-tag>
          <el-tag type="success" v-if="scope.row.state === '空闲'">空闲</el-tag>
          <el-tag type="warning" v-if="scope.row.state === '维修'">维修</el-tag>
        </template>
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
        <el-form-item label="设备名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-select clearable v-model="form.utype" placeholder="请选择厂房" style="width: 100%">
            <el-option v-for="item in unitTypes" :key="item.id" :label="item.utype" :value="item.utype"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="所属厂房">
          <el-select clearable v-model="form.plantId" placeholder="请选择厂房" style="width: 100%">
            <el-option v-for="item in " :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="工具类型">
          <el-input v-model="form.ttype" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备工序">
          <el-input v-model="form.wprocess" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="责任人">
          <el-input v-model="form.resPerson" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select  v-model="form.state" placeholder="空闲" style="width: 100%">
            <el-option value="空闲"></el-option>
            <el-option value="维修"></el-option>
            <el-option value="工作"></el-option>
            <el-option value="故障"></el-option>
          </el-select>
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
  name: "V_Material",
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
      unitTypes:[],
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods:{
    //将事件绑定到方法中
    load(){
      this.request.get("/eqlist/page", {
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          name:this.name
        }
      }).then(res=>{
        this.tableData = res.data.records
        this.total = res.data.total
      })

      this.request.get("/unittype").then(res => {
        console.log(res.data)
        this.unitTypes = res.data
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
      this.request.post("/eqlist", this.form).then(res => {
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
      this.request.delete("/eqlist/" + id).then(res =>{
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
      this.request.post("/eqlist/del/batch", ids).then(res =>{
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

    tableRowClassName(row,rowIndex) {
      console.log(rowIndex)
      console.log(row.row.state)
      if (row.row.state === "故障") {
        return 'warning-row';
      } else if (row.row.state === "空闲") {
        return 'success-row';
      }else if(row.row.state === "维修"){
        return 'maintain-row'
      }
      return '';
    }


  }
}
</script>

<style>
.el-table .warning-row {
  background: #FE9271;
}
.el-table .success-row {
  background: #BFF466;
}
.el-table .maintain-row {
  background: #FECF71;
}

</style>