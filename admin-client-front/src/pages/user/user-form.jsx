import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {
  formRef = React.createRef();
  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  render() {

    const {roles, user} = this.props
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout} onChange={this.props.setForm}>
        <Item label='username' name='username' initialValue={user.username}>
              <Input placeholder='Please enter username' />
        </Item>

        {
          user._id ? null : (
            <Item label='password' name="password" initialValue={user.password}>
                  <Input type='password' placeholder='Please enter password'/>
            </Item>
          )
        }

        <Item label='phone' name='phone' initialValue={user.phone}>
              <Input placeholder='Please enter phone number'/>
        </Item>

        <Item label='email' name='email' initialValue={user.email}>
              <Input placeholder='Please enter email'/>
        </Item>

        <Item label='role' name='role_id' initialValue={user.role_id}>
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
        </Item>
      </Form>
    )
  }
}

export default UserForm