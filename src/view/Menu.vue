<template>
  <div>
    <div style="margin: 7px 0">
      <!--placeholder:默认提示   -->
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button style="margin-left: 5px;" @click="load">搜索</el-button>
      <el-button style="margin-left: 5px;" @click="reset" type="warning">重置</el-button>
    </div>

    <div style="margin-bottom:5px">
      <el-button type="primary" @click="handleAdd(false)">新增<i class="el-icon-circle-plus-outline"></i></el-button>
      <el-button type="primary" @click="delBatch">批量删除<i class="el-icon-remove-outline"></i></el-button>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="id" width="80">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="140">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="140">
      </el-table-column>
      <el-table-column prop="pagePath" label="页面路径" width="140">
      </el-table-column>
      <el-table-column label="图标" >
        <template slot-scope="scope">
          <i :class="scope.row.icon" style="font-size: 15px"/>
        </template>

      </el-table-column>
      <el-table-column prop="description" label="描述">
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">新增子菜单<i class="el-icon-plus"></i></el-button>
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


    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面路径">
          <el-input v-model="form.pagePath" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-select clearable v-model="form.icon" autocomplete="off" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
              <i :class="item.value" />{{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
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
  name: "V_Aside",
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
      options:[]
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods:{
    //将事件绑定到方法中
    load(){
      this.request.get("/menu", {
        params:{
          name:this.name
        }
      }).then(res=>{
        console.log(res)
        this.tableData = res.data
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
      this.menuName=""
      this.load()
    },

    //打开新增功能
    handleAdd(pid){
      this.dialogFormVisible = true
      this.form = {}
      if(pid){
        this.form.pid = pid
      }
    },

    //新增/编辑用户信息
    save(){
      this.request.post("/menu", this.form).then(res => {
        if(res.code === '200' ){
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
      this.request.delete("/menu/" + id).then(res =>{
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
      this.request.post("/menu/del/batch", ids).then(res =>{
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

      //请求图标的数据
      this.request.get("/menu/icons").then(res => {
        this.options = res.data
      })
    },

  }
}
</script>

<style scoped>

</style>