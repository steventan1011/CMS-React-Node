import axios from 'axios'
import {message} from 'antd'

// use axios and promise to asyncronously request data from backend
export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        if (type === 'GET') { 
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        promise
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                message.error('请求出错了: ' + error.message)
            })
        })

}

// login: ajax('/login', {username: 'Tom', passsword: '12345'}, 'POST').then()
// addUser: ajax('/manage/user/add', {username: 'Tom', passsword: '12345', phone: '13712341234'}, 'POST').then()