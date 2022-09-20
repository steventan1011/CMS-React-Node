import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Form,
  Input,
  Select
} from 'antd'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";

const Item = Form.Item
const Option = Select.Option

export default class User extends Component {

  userFormRef = React.createRef()

  state = {
    users: [], // user list
    roles: [], // role list
    isShow: false, // whether to show confirmation box
  }

  initColumns = () => {
    this.columns = [
      {
        title: 'Username',
        dataIndex: 'username'
      },
      {
        title: 'Email',
        dataIndex: 'email'
      },

      {
        title: 'Phone',
        dataIndex: 'phone'
      },
      {
        title: 'Create time',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: 'Role',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: 'Operation',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>Update</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
          </span>
        )
      },
    ]
  }

  /*
  According to the array of roles, generate an object containing all role names (the attribute name uses the role id value)
   */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    this.roleNames = roleNames
  }

  /*
  show add interface
   */
  showAdd = () => {
    this.user = null 
    this.setState({isShow: true})
  }

  /*
  show update interface
   */
  showUpdate = (user) => {
    this.user = user // 保存user
    this.setState({
      isShow: true
    })
  }

  /*
  delete user by id
   */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('删除用户成功!')
          this.getUsers()
        }
      }
    })
  }

  /*
  add or update user
   */
  addOrUpdateUser = async () => {

    this.setState({isShow: false})

    const user = this.userFormRef.current.getFieldsValue()
    this.userFormRef.current.resetFields()
    if (this.user) {
      user._id = this.user._id
    }

    const result = await reqAddOrUpdateUser(user)
    if(result.status===0) {
      message.success(`${this.user ? 'Update' : 'Add'} user successfully`)
      this.getUsers()
    }
  }

  handleCancel = () => {
    this.userFormRef.current.resetFields()
    this.setState({isShow: false})
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status===0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  componentDidMount () {
    this.initColumns()
    this.getUsers()
  }


  render() {

    const {users, roles, isShow} = this.state
    const user = this.user || {}

    const title = <Button type='primary' onClick={this.showAdd}>Add user</Button>

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: 2}}
        />

        <Modal
          title={user._id ? 'Update user' : 'Add user'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={this.handleCancel}
        >
          <Form ref={this.userFormRef} {...{
            labelCol: { span: 4 }, 
            wrapperCol: { span: 15 }, 
          }}>
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
        </Modal>

      </Card>
    )
  }
}