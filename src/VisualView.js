import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge'



function sendRequest(context,body,callback){
    fetch(`${context}/vd__/show.do`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json;application/text',
        },
        body:JSON.stringify(body)
    })
        .catch(err => alert(err))
        .then(resp => resp.json())
        .then(content=>callback(content))
}

export default class DataView {
    constructor(id,el = 'chart',params={}){
        this.init = null;
        this.render = null;
        this.el=el;
        this.id=id;
        this.chart=null;
        this.context = window.assetPath || "";
        console.log("context",this.context);
        if (id)
            sendRequest(this.context,{id,params},body =>body.success&&this.renderChart(body.data));
    }
    async renderChart(body){
        try {
            let {script, rawOption, data} = body;
            eval(`${script};this.init=initiation;this.render=render`);
            if (this.init && isFunction(this.init)) {
                this.chart = await this.init(this.el);
                if (this.chart) {
                    const option = merge(rawOption, data);
                    this.render && this.render(this.chart, option);
                }
            }
        } catch (err) {
            console.error(`eval initiation error:${err}`, 5)
        }
    }

    updateChart(params){
        if(this.id)
            sendRequest(this.context,{id:this.id,params},body =>{
                if(body.success){
                    let {rawOption, data} = body.data;
                    if (this.chart) {
                        const option = merge(rawOption, data);
                        console.log('update',this,option,)
                        this.render && this.render(this.chart, option);
                    }
                }
            })

    }
}