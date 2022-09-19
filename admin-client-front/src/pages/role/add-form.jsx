import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

import withRouter from '../../utils/withRouter'

const Item = Form.Item

/*
添加分类的form组件
 */
class AddForm extends Component {

  render() {
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form>
        <Item label='Role name' {...formItemLayout}
          name="roleName"
          rules={[
            { 
              required: true, 
              message: 'Role name must be entered'
            }]}
            initialValue=''>
            <Input placeholder='Please enter a role name' onChange={this.props.setInputTxt} />
        </Item>
      </Form>
    )
  }
}

export default withRouter(AddForm)