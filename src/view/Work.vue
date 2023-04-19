<template>
  <div>
    <div style="margin: 7px 0">
      <!--placeholder:默认提示   -->
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button style="margin-left: 5px;" @click="load">搜索</el-button>
      <el-button style="margin-left: 5px;" @click="reset" type="warning">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd"  v-if="user.role === 'ROLE_ADMIN'">新增<i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
          style="margin-left: 5px"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="您确定删除吗？"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference" v-if="user.role === 'ROLE_ADMIN'">批量删除<i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="Id" width="80">
      </el-table-column>
      <el-table-column prop="name" label="工作名称" width="140">
      </el-table-column>
      <el-table-column prop="score" label="分数" width="120">
      </el-table-column>
      <el-table-column prop="times" label="时间" width="100">
      </el-table-column>
      <el-table-column prop="state" label="状态">
      </el-table-column>
      <el-table-column prop="manager" label="发布人">
      </el-table-column>
      <el-table-column prop="enable" label="启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc" @change="changeEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="selectTask(scope.row.id)">接单</el-button>
          <el-button type="success" @click="handleEdit(scope.row)" v-if="user.role === 'ROLE_ADMIN'">编辑<i class="el-icon-edit"></i></el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference" v-if="user.role === 'ROLE_ADMIN'">删除<i class="el-icon-remove-outline"></i></el-button>
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

    <el-dialog title="任务信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分数">
          <el-input v-model="form.score" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="form.times" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发布人">
          <el-select clearable v-model="form.managerId" placeholder="请选择">
            <el-option v-for="item in teachers" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
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
export default {
  name: "V_Work",
  data(){
    return{
      form:{},
      tableData:[],
      name:'',
      multipleSelection:[],
      pageNum:1,
      pageSize:10,
      total:0,
      dialogFormVisible:false,
      teachers:[],
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}

    }
  },
  created() {
    this.load()
  },
  methods:{
    //将事件绑定到方法中
    load(){
      this.request.get("/work/page", {
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          name:this.name,
        }
      }).then(res=>{
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })

      this.request.get("/user/role/ROLE_DEPARTMENT").then(res=>{
        console.log(res)
        this.teachers = res.data
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

    //删除信息
    del(id){
      this.request.delete("/work/" + id).then(res =>{
        if(res.data){
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
      this.request.post("/work/del/batch", ids).then(res =>{
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

    selectTask(workId){
      this.request.post('/work/employeeTask/' + this.user.id + "/" + workId).then(res=>{
        if(res.code === '200'){
          this.$message.success("选课成功")
        }else {
          this.$message.error(res.msg)
        }
      })
    },

    changeEnable(row){
      this.request.post("/work/update",row).then(res => {
        if (res.code === '200'){
          this.$message.success("操作成功")
        }
      })
    },
    handleFileUploadSuccess(res) {
      console.log(res)
      this.load()
    },

    save() {
      this.request.post("/work", this.form).then(res => {
        if (res.code === '200') {
          this.$message.success("保存成功")
        } else {
          this.$message.error("保存失败")
        }
        this.dialogFormVisible = false;
        this.load()
      })
    },
    //打开新增功能
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },

    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
    },
  }
}
</script>

<style scoped>

</style>