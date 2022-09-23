import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Form,
  Input
} from 'antd'
import {connect} from 'react-redux'

import {PAGE_SIZE} from "../../utils/constants"
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AuthForm from './auth-form'
import {formateDate} from '../../utils/dateUtils'
import {logout} from '../../redux/actions'

const Item = Form.Item

class Role extends Component {

  

  state = {
    roles: [], // List of all roles
    role: {}, // selected role
    inputTxt: '', // input role name
    isShowAdd: false, // Whether to display the add interface
    isShowAuth: false, // Whether to display the auth interface
  }

  constructor (props) {
    super(props)
    this.addFormRef = React.createRef()
    this.authFormRef = React.createRef()
    this.initColumn()
  }

  initColumn = () => {
    this.columns = [
      {
        title: 'Role name',
        dataIndex: 'name'
      },
      {
        title: 'Create time',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: 'Auth time',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: 'Authorizer',
        dataIndex: 'auth_name'
      },
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status===0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }


  onRow = (role) => {
    return {
      onClick: event => { 
        console.log('row onClick()', role)
        this.setState({
          role
        })
      },
    }
  }

  setInputTxt = (event) => {
    this.setState({inputTxt: event.target.value})
  }

  /*
  add role
   */ 
  addRole = async () => {
    this.addFormRef.current.validateFields()
      .then(async (values) => {
        // hide confirmation box
        this.setState({
          isShowAdd: false
        })

        // collect input data
        const {roleName} = values
        this.addFormRef.current.resetFields()

        // request to add role
        const result = await reqAddRole(roleName)
        // request to add role
        if (result.status===0) {
          message.success('Added role successfully')
          const role = result.data
          this.setState(state => ({
            roles: [...state.roles, role]
          }))

        } else {
          message.error('Failed to add role')
        }
      })
      .catch(_ => message.error('Failed to add role'))
  }

  /*
  update role
   */
  updateRole = async () => {

    // hide confirmation box
    this.setState({
      isShowAuth: false
    })

    const role = this.state.role
    // get the latest menus
    const menus = this.authFormRef.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = this.props.user.username

    // request to update role
    const result = await reqUpdateRole(role)
    if (result.status===0) {
      if (role._id === this.props.user.role_id) {
        this.props.logout()
        message.success('Current role successfully')
      } else {
        message.success('Updated role successfully')
        this.setState({
          roles: [...this.state.roles]
        })
      }
    }
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {

    const {roles, role, isShowAdd, isShowAuth} = this.state

    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>Add role</Button> &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>Set role auth</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({
                role
              })
            }

          }}
          onRow={this.onRow}
        />

        <Modal
          title="Add role"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false})
            this.addFormRef.current.resetFields()
          }}
        >
          <Form ref={this.addFormRef}>
            <Item label='Role name' {...{
              labelCol: { span: 4 },
              wrapperCol: { span: 15 },
            }}
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
        </Modal>

        <Modal
          title="Set role auth"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false})
          }}
        >
          <AuthForm ref={this.authFormRef} role={role}/>
        </Modal>
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(Role)