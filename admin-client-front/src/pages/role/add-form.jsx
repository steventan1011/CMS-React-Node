import React, {Component} from 'react'
import {
  Form,
  Input
} from 'antd'

import withRouter from '../../utils/withRouter'

const Item = Form.Item


class AddForm extends Component {

  render() {
    // specifying the Item layout
    const formItemLayout = {
      labelCol: { span: 4 },  // the width of the left label
      wrapperCol: { span: 15 }, // the width of the right wrap
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