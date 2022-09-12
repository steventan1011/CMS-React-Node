import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Form, Icon, Input, Button, message} from 'antd'
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item

class Login extends Component {

    /*
    Handle submit action when click the submit button
    */
    handleSubmit = (event) => {
        // default for blocking events from blank
        event.preventDefault()

        // validate all form fields
        this
            .props
            .form
            .validateFields(async (err, values) => {
                // if succuss
                if (!err) {
                    // console.log('submit ajax request', values) request login
                    const {username, password} = values
                    const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
                    // console.log('request susscessfully', result)
                    if (result.status === 0) { // success
                        // prompt login successful
                        message.success('Login Successfully')

                        // save the user data
                        const user = result.data
                        memoryUtils.user = user // keep it in the memory
                        storageUtils.saveUser(user) // keep it in the local

                        // jump to the admin page (no need to go back to login)
                        this
                            .props
                            .history
                            .replace('/')

                    } else { // fail
                        // give the fail message
                        message.error(result.msg)
                    }

                } else {
                    console.log('Login failed!')
                }
            });
    }

    /*
    Custom authentication for passwords
    Validity requirements for username/password
      1). No blank
      2). Must be greater than or equal to 4 digits
      3). Must be less than or equal to 12 digits
      4). Must be composed of letters, numbers or underscores
    */
    validatePwd = (rule, value, callback) => {
        console.log('validatePwd()', rule, value)
        if (!value) {
            callback('No blank')
        } else if (value.length < 4) {
            callback('Must be greater than or equal to 4 digits')
        } else if (value.length > 12) {
            callback('Must be less than or equal to 12 digits')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('Must be composed of letters, numbers or underscores')
        } else {
            callback() // pass all
        }
    }

    render() {
        return (
        // 如果用户已经登陆, 自动跳转到管理界面
        const user = memoryUtils.user if (user && user._id) {
            return <Redirect to='/'/>
        }

        // 得到具强大功能的form对象
        const form = this.props.form const {
            getFieldDecorator
    } = form;

    return (
        <div className="login">
            <header className="login-header">
                <img src={logo} alt="logo"/>
                <h1>React项目: 后台管理系统</h1>
            </header>
            <section className="login-content">
                <h2>用户登陆</h2>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Item>
                        {
                            /*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
               */
                        }
                        {
                            getFieldDecorator('username', { // 配置对象: 属性名是特定的一些名称
                                // 声明式验证: 直接使用别人定义好的验证规则进行验证
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: '用户名必须输入'
                                    }, {
                                        min: 4,
                                        message: '用户名至少4位'
                                    }, {
                                        max: 12,
                                        message: '用户名最多12位'
                                    }, {
                                        pattern: /^[a-zA-Z0-9_]+$/,
                                        message: '用户名必须是英文、数字或下划线组成'
                                    }
                                ],
                                initialValue: 'admin', // 初始值
                            })(
                                <Input
                                    prefix={<Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)' }}/>}
                                    placeholder="用户名"/>
                            )
                        }
                    </Item>
                    <Form.Item>
                        {
                            getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.validatePwd
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type = "lock" style = {{ color: 'rgba(0,0,0,.25)' }}/>}
                                    type="password"
                                    placeholder="密码"/>
                            )
                        }

                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        </div>
    )
}
}

const WrapLogin = Form(Login)
export default WrapLogin