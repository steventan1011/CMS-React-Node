import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'


export default class Line extends Component {

  state = {
    sales: [5, 20, 36, 10, 10, 20], // sales
    stores: [6, 10, 25, 20, 15, 10], // inventory
  }

  update = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce((pre, store) => {
        pre.push(store-1)
        return pre
      }, []),
    }))
  }


  getOption = (sales, stores) => {
    return {
      title: {
        text: 'Chart'
      },
      tooltip: {},
      legend: {
        data:['Sales', 'Inventory']
      },
      xAxis: {
        data: ["Shirt","Sweater","Trousers","Shoes","Socks","Skirt"]
      },
      yAxis: {},
      series: [{
        name: 'Sales',
        type: 'line',
        data: sales
      }, {
        name: 'Inventory',
        type: 'line',
        data: stores
      }]
    }
  }

  render() {
    const {sales, stores} = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>Update</Button>
        </Card>

        <Card title='Line Chart'>
          <ReactEcharts option={this.getOption(sales, stores)} />
        </Card>

      </div>
    )
  }
}