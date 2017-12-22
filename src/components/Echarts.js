export default class EchartWrapper {
    constructor(el,option){
        this.initating=false;
        this.__initChart(el,option);      
    }

    __initChart=async (el,option)=>{     
        if(!this.echarts){
          this.echarts=await import(/* webpackChunkName: "echarts" */ 'echarts')          
        }  
        if(this.echarts&&el)  {
            console.log(this.echarts,this.instance)  
            this.instance=this.echarts.init(el); 
        }        
        if(option&&this.instance)
          this.instance.setOption(option);  
        
        return this.instance;
    }
    
    setOption=async (option)=>{
        await this.__initChart(null,option)
    }

    getInstance=async ()=>{
      return await this.__initChart()
    }

}