import React, {Component} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {Form, Input, Button} from 'antd'
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {connect} from 'react-redux'

import './login.less'
import logo from '../../assets/images/logo.png'
import {login} from '../../redux/actions'

import Home from '../home/home'
import Admin from '../admin/admin'

class Login extends Component {

    /*
        Handle submit action when click the submit button
    */
    handleSubmit = (values) => {
        const {username, password} = values
        // call the asyncronous login function
        this.props.login(username, password)
    }

    handleSubmitFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        

        // If the user is already logged in, automatically jump to the admin page
        const user = this.props.user
        if (user && user._id) {
            return <Routes><Route path="*" element={<Navigate to="/" />}/></Routes>
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React + Node: Content Management System</h1>
                </header>
                <section className="login-content">
                    <div
                        className={user.errorMsg
                            ? 'error-msg show'
                            : 'error-msg'}>{user.errorMsg}</div>
                    <h2>User Login</h2>
                    <Form onFinish={this.handleSubmit} onFinishFailed={this.handleSubmitFailed} className="login-form">
                        {/* Validity requirements for username/password
                                        1). No blank
                                        2). Must be greater than or equal to 4 digits
                                        3). Must be less than or equal to 12 digits
                                        4). Must be composed of letters, numbers or underscores */
                        }
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'Username cannot be blank'
                                }, {
                                    min: 4,
                                    message: 'Username must be greater than or equal to 4 digits'
                                }, {
                                    max: 12,
                                    message: 'Username must be less than or equal to 12 digits'
                                }, {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Username must be composed of letters, numbers or underscores'
                                }
                            ]}
                            initialValue = 'admin'>
                            <Input
                                prefix={<UserOutlined style = {{ color: 'rgba(0,0,0,.25)' }}/>}
                                placeholder="username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'Password cannot be blank'
                                }, {
                                    min: 4,
                                    message: 'Password must be greater than or equal to 4 digits'
                                }, {
                                    max: 12,
                                    message: 'Password must be less than or equal to 12 digits'
                                }, {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Password must be composed of letters, numbers or underscores'
                                }
                            ]}>

                            <Input
                                prefix={<LockOutlined style = {{ color: 'rgba(0,0,0,.25)' }}/>}
                                type="password"
                                placeholder="password"/>

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
                {/* <div className="login-blank" /> */}
            </div>
        )
    }
}

export default connect(state => ({user: state.user}), {login})(Login)