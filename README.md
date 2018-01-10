React图表组件


## 1.时间轴<br>
- 初始化<br>
Toolkit.TimeAxis(el,config)
- 配置参数
```
  ticks:节点
     String:text:"6时",
     function:click:'点击节点回调',
  tickWidth:节点宽度,
  selected:时间轴初始化选择节点,
  onSelectedUpdate:时间轴更新回调,
  axisStyle:时间轴样式
    textColor:文字颜色,
  playingDuration:PropTypes.number
```
- 方法
## 2.油量表<br>
- 初始化<br>
Toolkit.Gauge(el,config)
- 配置参数
```
 size:表盘区域大小
 min:最小值
 max:最大值
 majorTicks:大分格数量
 minaorTicks:小分格数量
 transitionDuratio
 color:表盘颜色
 background:表盘背景色
```
- 方法

## 3.滚动数字<br>
- 初始化<br>
Toolkit.RollingNumber(el,config)
- 配置
```
length 面板数字长度(整数部分)
value: 输入值,
fix:小数点保留位数
```
- 方法
```
```
## 4.可拖动窗口<br>

## 5.Echart图表
- 初始化<br>
