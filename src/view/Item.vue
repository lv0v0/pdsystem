<template xmlns:el-col="http://www.w3.org/1999/html">
  <div class="clearfix">
    <el-row>
    <el-col :span="18">
      <div v-if="tableData.length<=0" style="display:flex;justify-content: center; align-items:center;height:750px;font-size: 30px;color: #dfeaeb">暂无数据</div>
      <el-card class="test" v-for="item in tableData" :key="item.id" shadow="hover">
        <el-row class="content" type="flex" align="center" style="margin-top: 15px">
          <el-col :span="3">
            <div class="circle1" style="margin-top: -5px" v-if="item.state === '1'"></div>
            <div class="circle2" style="margin-top: -5px" v-if="item.state === '2'"></div>
          </el-col>
          <el-col :span="6" style="margin-top: -7px">
            <div>{{ item.name }}</div>
            <div style="font-size: 7px">{{ item.description }}</div>
          </el-col>
          <el-col :span="10">
            <div style=" width: 150px;border-radius: 7px;text-align: center;background-color: #D3EAFA">
              {{item.eqcount}}/{{item.eqlimit}}台
            </div>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="handleEdit(item)" style="margin-right: 5px">编辑<i class="el-icon-circle-plus-outline"></i></el-button>
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
            <i class="el-icon-arrow-down" @click="disVis(item.id)"></i>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-show="test[item.id]" style="border-top:2px dashed gray">
            <div style="margin-top: 10px"><i class="el-icon-paperclip"></i>基本信息</div>
            <el-row style="margin-top: 10px;
                    border: 1px solid #F2F7FA;
                    border-radius: 23px;
                    overflow: hidden;
                    margin-bottom: 15px"
            >
              <el-col :span="17" style="height: 100px;background-color: #F2F7FA">
                <el-row class="details">
                  <span>项目编号:{{item.itnumber}}</span>
                </el-row>
                <el-row class="details">
                  <span>创建时间:{{item.createtime}}</span>
                </el-row>
              </el-col>
              <el-col :span="7" style="height: 100px">
                <el-row class="details">
                  <span><i class="el-icon-s-custom" style="margin-right: 40px"></i>{{item.resPerson}}</span>
                </el-row>
                <el-row class="details">
                  <span><i class="el-icon-phone" style="margin-right: 40px"></i></span>
                </el-row>
              </el-col>
            </el-row>
            <el-card shadow="never">
              12345
            </el-card>
          </div>
        </el-collapse-transition>
      </el-card>
    </el-col>
    <el-col :span="6" style="margin-top: 10px">
      <el-card shadow="hover" style="height: 750px">
        <div>
          <span style="font-size: 15px">搜索项目</span>
        </div>
        <div style="margin: 10px 0">
          <!--placeholder:默认提示   -->
          <el-input style="width: 270px;margin-bottom: 10px" placeholder="请输入名称" suffix-icon="el-icon-search"
                    v-model="name"></el-input>
          <el-button style="width: 130px" @click="load">搜索</el-button>
          <el-button style="margin-left: 10px; width: 130px" @click="reset" type="warning">重置</el-button>
        </div>
        <div>
          <span style="font-size: 15px">快捷按钮</span>
        </div>
        <div style="margin:10px 0">
          <el-button type="success" @click="handleAdd" style="width: 270px">新增项目<i class="el-icon-circle-plus-outline"></i></el-button>
        </div>
      </el-card>
    </el-col>
    </el-row>


    <el-dialog title="设备信息" :visible.sync="dialogFormVisible" width="50%">
      <el-form label-width="150px" label-position="left">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目授权设备数">
          <el-input v-model="form.eqlimit" autocomplete="off"></el-input>
        </el-form-item>
        <el-date-picker
            label="项目开始时间"
            v-model="form.createtime"
            type="datetime"
            placeholder="选择日期时间">
        </el-date-picker>
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
  name: "V_Item",
  data() {
    return {
      tableData: [],
      name: "",
      total: 0,
      pageNum: 1,
      pageSize: 5,
      dialogFormVisible: false,
      form: {},
      multipleSelection: [],
      serverIp: serverIp,
      test: {},
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods: {
    //将事件绑定到方法中
    load() {
      this.request.get("/item/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name:this.name
        }
      }).then(res => {
        this.tableData = res.data.records
        this.tableData.forEach((item) => {
          this.test[item.id] = false
        })

        this.total = res.data.total
        console.log(res)
      })

    },

    //获取当前页码，并将此页码写入并重新绑定
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },

    //重置按钮，清空
    reset() {
      this.name = ""
      this.load()
    },

    //打开新增功能
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },

    //新增/编辑用户信息
    save() {
      this.request.post("/item", this.form).then(res => {
        if (res.code === '200') {
          this.$message.success("保存成功")
        } else {
          this.$message.error("保存失败")
        }
        this.dialogFormVisible = false;
        this.load()
      })
    },

    //删除信息
    del(id) {
      this.request.delete("/item/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("删除成功")
        } else {
          this.$message.error("删除失败")
        }
        this.dialogFormVisible = false;
        this.load()
      })
    },

    delBatch() {
      let ids = this.multipleSelection.map(v => v.id) //[{},{},{}] =>[1,2,3]
      this.request.post("/item/del/batch", ids).then(res => {
        if (res) {
          this.$message.success("批量删除成功")
        } else {
          this.$message.error("删除失败")
        }
        this.dialogFormVisible = false;
        this.load()
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
    },


    disVis(id) {
      this.test[id] = !this.test[id]

      this.test = Object.assign({}, this.test)
      console.log(this.test)
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

<style scoped>

.test {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
}

.content {
  margin-bottom: 10px;
}
.circle1 {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: pink;
}

.circle2 {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: orange;
}

.details{
  margin: 20px 20px;
}

.clearfix:after {
  clear: both
}


</style>