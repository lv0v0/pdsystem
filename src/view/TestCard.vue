<template>
  <div>
    <el-col :span="18">
      <el-card class="test" v-for="item in tableData" :key="item.id">
        <el-row class="content">
          <div>{{ item.id }}</div>
          <div>{{ item.name }}</div>
          <div>{{ item.level }}--{{ test[item.id] }}</div>
          <button @click="disVis(item.id)">下拉框</button>
        </el-row>
        <el-row v-show="test[item.id]">
          <el-card>
            12345
          </el-card>
          <el-card>
            12345
          </el-card>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="6" style="margin-top: 10px">
      <el-card>
        <div>
          <span style="font-size: 15px">搜索项目</span>
        </div>
        <div style="margin: 10px 0">
          <!--placeholder:默认提示   -->
          <el-input style="width: 270px;margin-bottom: 10px" placeholder="请输入名称" suffix-icon="el-icon-search"
                    v-model="name"></el-input>
          <el-button style="margin-left: 5px;" @click="load">搜索</el-button>
          <el-button style="margin-left: 5px;" @click="reset" type="warning">重置</el-button>
        </div>
      </el-card>
    </el-col>
  </div>

</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "V_UnitType",
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
      this.request.get("/brand/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name
        }
      }).then(res => {
        this.tableData = res.data.records
        this.tableData.forEach((item) => {
          this.test[item.id] = false
        })

        this.total = res.data.total
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
      this.request.post("/brand", this.form).then(res => {
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
      this.request.delete("/brand/" + id).then(res => {
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
      this.request.post("/brand/del/batch", ids).then(res => {
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

</style>