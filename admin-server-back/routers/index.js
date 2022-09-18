const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')
const RoleModel = require('../models/RoleModel')


// get router object
const router = express.Router()

const filter = {password: 0, __v: 0}


// login
router.post('/login', (req, res) => {
  const {username, password} = req.body
  // connect the database to find the user
  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { // success
        // create cookie(userid: user._id), save in the browser
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        if (user.role_id) {
          RoleModel.findOne({_id: user.role_id})
            .then(role => {
              user._doc.role = role
              console.log('role user', user)
              res.send({status: 0, data: user})
            })
        } else {
          user._doc.role = {menus: []}
          // return the message
          res.send({status: 0, data: user})
        }

      } else {// fail
        res.send({status: 1, msg: 'Username or password is not correct!'})
      }
    })
    .catch(error => {
      console.error('error to login', error)
      res.send({status: 1, msg: 'Error to login, please try again.'})
    })
})

// create user
router.post('/manage/user/add', (req, res) => {
  const {username, password} = req.body
  UserModel.findOne({username})
    .then(user => {
      if (user) {
        res.send({status: 1, msg: 'The user already exists'})
        return new Promise(() => {
        })
      } else { 
        return UserModel.create({...req.body, password: md5(password || 'admin')})
      }
    })
    .then(user => {
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('error to register', error)
      res.send({status: 1, msg: 'Error to register, please try again.'})
    })
})


// update user
router.post('/manage/user/update', (req, res) => {
  const user = req.body
  UserModel.findOneAndUpdate({_id: user._id}, user)
    .then(oldUser => {
      const data = Object.assign(oldUser, user)
      // 返回
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('error to update', error)
      res.send({status: 1, msg: 'Error to update, please try again.'})
    })
})

// delete user
router.post('/manage/user/delete', (req, res) => {
  const {userId} = req.body
  UserModel.deleteOne({_id: userId})
    .then((doc) => {
      res.send({status: 0})
    })
})

// get user list
router.get('/manage/user/list', (req, res) => {
  UserModel.find({username: {'$ne': 'admin'}})
    .then(users => {
      RoleModel.find().then(roles => {
        res.send({status: 0, data: {users, roles}})
      })
    })
    .catch(error => {
      console.error('error to get user list', error)
      res.send({status: 1, msg: 'Error to get user list, please try again.'})
    })
})


// create category
router.post('/manage/category/add', (req, res) => {
  const {categoryName, parentId} = req.body
  CategoryModel.create({name: categoryName, parentId: parentId || '0'})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('error to create category', error)
      res.send({status: 1, msg: 'Error to create category, please try again.'})
    })
})

// get category list
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({parentId})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      console.error('error to get category list', error)
      res.send({status: 1, msg: 'Error to get category list, please try again.'})
    })
})

// update category
router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('error to update category', error)
      res.send({status: 1, msg: 'Error to update category, please try again.'})
    })
})

// get category by id
router.get('/manage/category/info', (req, res) => {
  const categoryId = req.query.categoryId
  CategoryModel.findOne({_id: categoryId})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('error to get category by id', error)
      res.send({status: 1, msg: 'Error to get category by id, please try again.'})
    })
})


// add product
router.post('/manage/product/add', (req, res) => {
  const product = req.body
  ProductModel.create(product)
    .then(product => {
      res.send({status: 0, data: product})
    })
    .catch(error => {
      console.error('error to add product', error)
      res.send({status: 1, msg: 'Error to add product, please try again.'})
    })
})

// get product list
router.get('/manage/product/list', (req, res) => {
  const {pageNum, pageSize} = req.query
  ProductModel.find({})
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('error to get product list', error)
      res.send({status: 1, msg: 'Error to get product list, please try again.'})
    })
})

// search product list
router.get('/manage/product/search', (req, res) => {
  const {pageNum, pageSize, searchName, productName, productDesc} = req.query
  let contition = {}
  if (productName) {
    contition = {name: new RegExp(`^.*${productName}.*$`)}
  } else if (productDesc) {
    contition = {desc: new RegExp(`^.*${productDesc}.*$`)}
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('error to search product list', error)
      res.send({status: 1, msg: 'Error to search product list, please try again.'})
    })
})

// update product
router.post('/manage/product/update', (req, res) => {
  const product = req.body
  ProductModel.findOneAndUpdate({_id: product._id}, product)
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('error to update product', error)
      res.send({status: 1, msg: 'Error to update product, please try again.'})
    })
})

// update product status
router.post('/manage/product/updateStatus', (req, res) => {
  const {productId, status} = req.body
  ProductModel.findOneAndUpdate({_id: productId}, {status})
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('error to update product status', error)
      res.send({status: 1, msg: 'Error to update product status, please try again.'})
    })
})


// add role
router.post('/manage/role/add', (req, res) => {
  const {roleName} = req.body
  RoleModel.create({name: roleName})
    .then(role => {
      res.send({status: 0, data: role})
    })
    .catch(error => {
      console.error('error to add role', error)
      res.send({status: 1, msg: 'Error to add role, please try again.'})
    })
})

// get role list
router.get('/manage/role/list', (req, res) => {
  RoleModel.find()
    .then(roles => {
      res.send({status: 0, data: roles})
    })
    .catch(error => {
      console.error('error to get role list', error)
      res.send({status: 1, msg: 'Error to get role list, please try again.'})
    })
})

// update role
router.post('/manage/role/update', (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  RoleModel.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      // console.log('---', oldRole._doc)
      res.send({status: 0, data: {...oldRole._doc, ...role}})
    })
    .catch(error => {
      console.error('error to update role', error)
      res.send({status: 1, msg: 'Error to update role, please try again.'})
    })
})


// pagination
function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}

require('./file-upload')(router)

module.exports = router