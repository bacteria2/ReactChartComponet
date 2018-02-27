import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge'



export default class DataView {
    constructor(id,el = 'chart'){
        this.init = null;
        this.render = null;
        this.el=el;
        const context = window.assetPath || "";
        if (id)
            fetch(`${context}/vd__/show.do?id=${id}`)
                .catch(err => alert(err))
                .then(resp => resp.json())
                .then(body =>body.success&&this.renderChart(body.data))

    }

    async renderChart(body){
        try {
            let {script, rawOption, data} = body;
            eval(`${script};this.init=initiation;this.render=render`);
            if (this.init && isFunction(this.init)) {
                const chart = await this.init(this.el);
                if (chart) {
                    const option = merge(rawOption, data)
                    this.render && this.render(chart, option);
                }
            }
        } catch (err) {
            console.error(`eval initiation error:${err}`, 5)
        }
    }
}