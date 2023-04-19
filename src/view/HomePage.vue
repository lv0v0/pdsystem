<template>
  <div style="min-width: 1200px">
    <!--在加入任何图标之前，都需要设置一个div，指定id，宽高比例等    -->
    <!--el-col；流式布局    -->
    <el-row :gutter="10" style="margin-bottom: 10px;margin-top: 5px">
      <el-col :span="6">
        <el-card style="color:#409EFF">
          <div><i class="el-icon-user-solid"></i>用户总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">
            {{total}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color:#E6A23C">
          <div><i class="el-icon-s-home"></i>设备总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">
            {{eqTotal}}台
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color:#67C23A">
          <div><i class="el-icon-money" />项目总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">
            {{itTotal}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color:#F56C6C">
          <div ><i class="el-icon-warning"></i>故障机器</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">
            {{eqErTotal}}台
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 5px;" :gutter="10">
      <el-col style="margin-bottom: 5px;" :gutter="10" :span="18">
        <el-row style="margin-bottom: 10px;" :gutter="7">
          <el-col :span = "12">
            <el-card class="box-card" style="width: 464px;min-width: 464px" shadow="always">
              <div id="main" style="width: 420px;height: 350px"></div>
            </el-card>
          </el-col>
          <el-col :span= "4">
            <el-card class="box-card" style="width: 464px; min-width: 464px;" shadow="always">
              <div id="pie" style="width: 420px;height: 350px"></div>
            </el-card>
          </el-col>
        </el-row >
        <el-row>
          <el-card class="box-card" style="width: 938px;height: 250px" shadow="always">
            <div id="line" style="width: 900px;height: 230px"></div>
          </el-card>
        </el-row>
      </el-col>
      <el-col style="margin-bottom: 5px;" :gutter="10" :span="6">
        <el-card class="box-card" style="width: 300px;height: 650px" shadow="always">
          <div style="width: 100px;height: 200px">待设计</div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "HomePage",
  data(){
    return{
      total:0,
      eqTotal:0,
      eqErTotal:0,
      itTotal:0,
    }
  },

  mounted() {//页面元素渲染之后再出发
    //利用echart构建图表
    //折线图
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option = {
      title: {
        text: '各季度员工数量统计',
        subtext: "趋势图",
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度", "第二季度", "第三季度", "第四季度"]
      },
      yAxis: {
        type: 'value'
      },
      //柱状图：bar 折线图：line
      series: [
        {
          data: [],
          type: 'line'
        },
        {
          data: [],
          type: 'bar'
        }
      ]
    };

    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);
    var pieoption = {
      title: {
        text: '设备运行情况总览',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          label: {  //饼状图图形上的文本标签
            normal: {
              show: true,
              position: 'inner', //标签的位置
              textStyle: {
                fontWeight: 300,
                fontSize: 16  //文件的字体大小
              },
              formatter: '{d}%'
            }
          },
          data: [],//填空
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    var lineDom = document.getElementById('line');
    var lineChart = echarts.init(lineDom);
    var lineoption;

    lineoption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };

    lineChart.setOption(lineoption);


    this.request.get("/echarts/members").then(res => {
      //填空
      //option.xAxis.data = res.data.x;
      option.series[0].data = res.data;
      option.series[1].data = res.data;
      //数据准备完毕后再set
      myChart.setOption(option);
    })

    this.request.get("/echarts/eqnembers").then(res => {
      //饼图
      pieoption.series[0].data = [
        {name: '闲置', value: res.data[0]},
        {name: '维修', value: res.data[1]},
        {name: '工作', value: res.data[2]},
        {name: '故障', value: res.data[3]}
      ]
      pieChart.setOption(pieoption);
    })


    //获取用户总数
    this.request.get("/homepage/userTotal").then(res => {
      console.log(res);
      this.total = res;
    })

    //获取设备总数
    this.request.get("/homepage/eqTotal").then(res => {
      console.log(res);
      this.eqTotal = res;
    })

    //获取报警设备总数
    this.request.get("/homepage/eqErTotal").then(res => {
      this.eqErTotal = res;
    })

    //获取项目总数
    this.request.get("/homepage/itTotal").then(res => {
      this.itTotal = res;
    })
  }
}
</script>

<style scoped>

</style>