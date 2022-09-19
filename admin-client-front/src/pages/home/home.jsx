import React, {Component} from 'react'
import {
  Card,
  Statistic,
  DatePicker,
  Timeline
} from 'antd'
import moment from 'moment'
import {ArrowDownOutlined, ArrowUpOutlined, ReloadOutlined, QuestionCircleOutlined} from "@ant-design/icons";

import Line from './line'
import Bar from './bar'
import './home.less'

const dateFormat = 'YYYY/MM/DD'
const {RangePicker} = DatePicker

export default class Home extends Component {

  state = {
    isVisited: true
  }

  handleChange = (isVisited) => {
    return () => this.setState({isVisited})
  }

  render() {
    const {isVisited} = this.state

    return (
      <div className='home'>
        <Card
          className="home-card"
          title="Product Quantity"
          extra={<QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)'}}/>}
          style={{width: 250}}
          headStyle={{color: 'rgba(0,0,0,.45)'}}
        >
          <Statistic
            value={1128163}
            suffix=""
            style={{fontWeight: 'bolder'}}
          />
          <Statistic
            value={15}
            valueStyle={{fontSize: 15}}
            prefix={'week-on-week'}
            suffix={<div>%<ArrowDownOutlined style={{color: 'red', marginLeft: 10}}/></div>}
          />
          <Statistic
            value={10}
            valueStyle={{fontSize: 15}}
            prefix={'day-to-day'}
            suffix={<div>%<ArrowUpOutlined style={{color: '#3f8600', marginLeft: 10}}/></div>}
          />
        </Card>

        <Line/>

        <Card
          className="home-content"
          title={<div className="home-menu">
            <span className={isVisited ? "home-menu-active home-menu-visited" : 'home-menu-visited'}
                  onClick={this.handleChange(true)}>Views</span>
            <span className={isVisited ? "" : 'home-menu-active'} onClick={this.handleChange(false)}>Sales</span>
          </div>}
          extra={<RangePicker
            defaultValue={[moment('2019/01/01', dateFormat), moment('2019/06/01', dateFormat)]}
            format={dateFormat}
          />}
        >
          <Card
            className="home-table-left"
            title={isVisited ? 'Visit Trends' : 'Sales Trends'}
            bodyStyle={{padding: 0, height: 275}}
            extra={<ReloadOutlined/>}
          >
            <Bar/>
          </Card>

          <Card title='Tasks' extra={<ReloadOutlined/>} className="home-table-right">
            <Timeline>
              <Timeline.Item color="green">New version iteration</Timeline.Item>
              <Timeline.Item color="green">Complete the first version of the website design</Timeline.Item>
              <Timeline.Item color="red">
                <p>Joint debugging interface</p>
                <p>Functional acceptance</p>
              </Timeline.Item>
              <Timeline.Item>
                <p>Login function design</p>
                <p>ASD</p>
                <p>Page layout</p>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Card>
      </div>
    )
  }
}