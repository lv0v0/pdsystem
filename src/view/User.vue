<template>
  <div>

    <div style="margin: 7px 0">
      <!--placeholder:默认提示   -->
      <el-input style="width: 200px" placeholder="请输入用户名" suffix-icon="el-icon-search" v-model="username"></el-input>
      <el-button style="margin-left: 5px;" @click="load">搜索</el-button>
      <el-button style="margin-left: 5px;" @click="reset" type="warning">重置</el-button>
    </div>

    <div style="margin-bottom:5px">
      <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
      <el-button type="primary" @click="delBatch">批量删除<i class="el-icon-remove-outline"></i></el-button>
      <el-upload
          :action="'http://'+ serverIp +':9090/user/import'" style="display: inline-block;margin: 0 10px"
          :show-file-list="false" accept=".xlsx" :on-success="handleExcelImportSuccess" >
        <el-button type="primary">导入<i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button type="primary" @click="exp">导出<i class="el-icon-top"></i></el-button>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="id" width="80">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="140">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column prop="role" label="角色">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.role ==='ROLE_ADMIN'">管理员</el-tag>
          <el-tag type="primary" v-if="scope.row.role ==='ROLE_DEPARTMENT'">部门</el-tag>
          <el-tag type="primary" v-if="scope.row.role ==='ROLE_USER'">普通员工</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="lookTask(scope.row.works)" v-if="scope.row.role === 'ROLE_DEPARTMENT'">查看任务<i class="el-icon-edit"></i></el-button>
          <el-button type="success" @click="lookEmpTask(scope.row.empWorks)" v-if="scope.row.role === 'ROLE_EMPLOYEE'">查看已选任务<i class="el-icon-edit"></i></el-button>
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

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select clearable v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="工作信息" :visible.sync="vis" width="30%">
      <el-table :data="works" border stripe>
        <el-table-column prop="name" label="任务名称"></el-table-column>
        <el-table-column prop="score" label="分数"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="已接任务" :visible.sync="empvis" width="30%">
      <el-table :data="empWorks" border stripe>
        <el-table-column prop="name" label="任务名称"></el-table-column>
        <el-table-column prop="score" label="分数"></el-table-column>
      </el-table>
    </el-dialog>

  </div>

</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "V_User",
  data(){
    return{
      tableData: [],
      username:"",
      total:0,
      pageNum:1,
      pageSize:5,
      dialogFormVisible:false,
      form:{},
      multipleSelection:[],
      roles:[],
      serverIp:serverIp,
      works:[],
      empWorks:[],
      vis:false,
      empvis:false,

    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods:{
    //将事件绑定到方法中
    load(){
      this.request.get("/user/page", {
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          username:this.username
        }
      }).then(res=>{
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })

      this.request.get("/role").then(res => {
        this.roles = res.data
      })



      /*fetch("http://localhost:9090/user/page?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&username=" +this.username)
          .then(res => res.json())
          .then(res => {
        console.log(res)
        this.tableData = res.data
        this.total = res.total
      })*/
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
      this.username=""
      this.load()
    },

    //打开新增功能
    handleAdd(){
      this.dialogFormVisible = true
      this.form = {}
    },

    //新增/编辑用户信息
    save(){
      this.request.post("/user", this.form).then(res => {
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
      this.request.delete("/user/" + id).then(res =>{
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
      this.request.post("/user/del/batch", ids).then(res =>{
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

    lookTask(works){
      this.works = works
      this.vis = true
    },

    lookEmpTask(empWorks){
      this.empWorks = empWorks
      this.empvis = true
    },

    //导出
    exp(){
      window.open(`http://${serverIp}:9090/user/export`)
    },

    //导入成功时的触发提示
    handleExcelImportSuccess(){
      this.$message.success("文件导入成功")
      this.load()
    },

  }
}
</script>

<style scoped>

</style>