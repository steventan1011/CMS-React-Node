import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteUser, reqFindUserById, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'

export default class User extends Component {

  state = {
    users: [], // user list
    roles: [], // role list
    isShow: false, // whether to show confirmation box
    form: {
      username: '', 
      password: '', 
      phone: '', 
      email: '', 
      role_id: '' 
    },  // the form of Modal
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

  // to transfer props to the UserForm
  setForm = (event) => {
    console.log(event)
    let {form} = this.state
    form[event.target.id] = event.target.value
    this.setState({form})
  }

  /*
  add or update user
   */
  addOrUpdateUser = async () => {

    this.setState({isShow: false})

    console.log(this.state.form)
    const user = this.state.form
    if (this.user) {
      user._id = this.user._id
    }

    const preUser = await reqFindUserById(user._id)
    for (let key in user) {
      if (user[key] === '') {
        user[key] = preUser[key]
      }
    }

    const result = await reqAddOrUpdateUser(user)
    if(result.status===0) {
      message.success(`${this.user ? 'update' : 'add'} user successfully`)
      this.getUsers()
    }
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

    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>

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
          onCancel={() => {
            this.setState({isShow: false})
          }}
        >
          <UserForm
            setForm={this.setForm}
            roles={roles}
            user={user}
          />
        </Modal>

      </Card>
    )
  }
}