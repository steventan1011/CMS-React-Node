import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = ''

// login
export const reqLogin = (username, password) => ajax(BASE + '/login', {
    username,
    password
}, 'POST')

// get category lists
export const reqCategorys = (parentId) => ajax(
    BASE + '/manage/category/list',
    {parentId}
)

// add category
export const reqAddCategory = (categoryName, parentId) => ajax(
    BASE + '/manage/category/add',
    {
        categoryName,
        parentId
    },
    'POST'
)

// update category
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(
    BASE + '/manage/category/update',
    {
        categoryId,
        categoryName
    },
    'POST'
)

// get category
export const reqCategory = (categoryId) => ajax(
    BASE + '/manage/category/info',
    {categoryId}
)

// get product list
export const reqProducts = (pageNum, pageSize) => ajax(
    BASE + '/manage/product/list',
    {pageNum, pageSize}
)

// update product status
export const reqUpdateStatus = (productId, status) => ajax(
    BASE + '/manage/product/updateStatus',
    {
        productId,
        status
    },
    'POST'
)

/*
  search for a paginated list of products (according to product name/product description)
  searchType: productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(
    BASE + '/manage/product/search',
    {pageNum, pageSize, [searchType]: searchName}
)

// delete image by name
export const reqDeleteImg = (name) => ajax(
    BASE + '/manage/img/delete',
    {
        name
    },
    'POST'
)

// add or update product
export const reqAddOrUpdateProduct = (product) => ajax(
    BASE + '/manage/product/' + (
        product._id
            ? 'update'
            : 'add'
    ),
    product,
    'POST'
)

// get role list
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// add role
export const reqAddRole = (roleName) => ajax(
    BASE + '/manage/role/add',
    {
        roleName
    },
    'POST'
)

// update role
export const reqUpdateRole = (role) => ajax(
    BASE + '/manage/role/update',
    role,
    'POST'
)

// get user list
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// delete user by id
export const reqDeleteUser = (userId) => ajax(
    BASE + '/manage/user/delete',
    {
        userId
    },
    'POST'
)

// add or update user
export const reqAddOrUpdateUser = (user) => ajax(
    BASE + '/manage/user/' + (
        user._id
            ? 'update'
            : 'add'
    ),
    user,
    'POST'
)

// find user by id
export const reqFindUserById = (userId) => ajax(
    BASE + '/manage/user/find',
    {
        userId
    },
    'GET'
)


// use jsonp to request data
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // use jsonp, not axios, can solve the cross-domain problem of GET type ajax requests
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            if (!err && data.status === 'success') {
                const {dayPictureUrl, weather} = data
                    .results[0]
                    .weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                message.error('Get weather failed!')
            }

        })
    })
}
