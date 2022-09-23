import React, {PureComponent} from 'react'
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  message
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import withRouter from '../../utils/withRouter'

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends PureComponent {
  state = {
    options: [],
  }

  constructor (props) {
    super(props)

    this.pwRef = React.createRef()
    this.editorRef = React.createRef()
    this.formRef = new React.createRef()

    const product = memoryUtils.product
    this.isUpdate = !!product._id
    this.product = product || {}
  }

  initOptions = async (categorys) => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, 
    }))

    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0') {
      const subCategorys = await this.getCategorys(pCategoryId)
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      const targetOption = options.find(option => option.value===pCategoryId)

      targetOption.children = childOptions
    }

    this.setState({
      options
    })
  }

  /*
  Get category list
   */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId) 
    if (result.status===0) {
      const categorys = result.data
      if (parentId==='0') {
        this.initOptions(categorys)
      } else {
        return categorys
      }
    }
  }


  /*
  Validate price
   */
  validatePrice = (rule, value, callback) => {
    console.log(value, typeof value)
    if (value*1 > 0) {
      callback() 
    } else {
      callback('Price must be greater than 0') 
    }
  }

  /*
  Use the callback function that loads the list
   */
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]
    targetOption.loading = true

    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length>0) {
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      targetOption.children = childOptions
    } else { 
      targetOption.isLeaf = true
    }

    this.setState({
      options: [...this.state.options],
    })
  }

  submit = () => {
    
    this.formRef.current.validateFields()
      .then(async (values) => {
        // 1. Collect data and make it into a product object
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pwRef.current.getImgs()
        const detail = this.editorRef.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        // If it is updated, need to add _id
        if(this.isUpdate) {
          product._id = this.product._id
        }

        // 2. Call the API to add/update
        const result = await reqAddOrUpdateProduct(product)

         // 3. Prompt according to the results
        if (result.status===0) {
          message.success(`${this.isUpdate ? 'Update' : 'Add'} product successfully!`)
          this.props.navigate(-1)
        } else {
          message.error(`${this.isUpdate ? 'Update' : 'Add'} product failed!`)
        }
      })
      .catch(_ => {
          message.error("Failed to add/update product.")
      }) 
        
  }

  componentDidMount () {
    this.getCategorys('0')
  }

  /*
    Clear saved data
  */
  componentWillUnmount () {
    memoryUtils.product = {}
  }

  render() {
    const {isUpdate, product} = this
    let pCategoryId, categoryId
    if (isUpdate) {
      pCategoryId = product.pCategoryId
      categoryId = product.categoryId
    } else {
      pCategoryId = ''
      categoryId = ''
    }
    
    // Array to receive category IDs
    const categoryIds = []
    if(isUpdate) {
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    // specifying the Item layout
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 }, 
    }

    // Title on the left side of header
    const title = (
      <span>
        <LinkButton onClick={() => this.props.navigate('/product')}>
          <ArrowLeftOutlined style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? 'Update product' : 'Add product'}</span>
      </span>
    )

    return (
      <Card title={title}>
        <Form {...formItemLayout} ref={this.formRef}>
          <Item label="Name" 
            name="name"  
            initialValue={isUpdate ? product.name : ''}
            rules={[{required: true, message: 'Product name must be entered'}]}>
              <Input placeholder='Please enter product name'/>
          </Item>
          <Item label="Description"
            name="desc"
            initialValue={isUpdate ? product.desc : ''}
            rules={[{required: true, message: 'Description must be entered'}]}>
              <TextArea placeholder="Please enter description" autosize={{ minRows: 2, maxRows: 6 }} />
          </Item>
          <Item label="Price"
            name="price"
            initialValue={isUpdate ? product.price : ''}
            rules={[{required: true, message: 'Price must be entered'}, {validator: this.validatePrice}]}>
              <Input type='number' placeholder='Please enter price' addonBefore='$'/>
          </Item>
          <Item label="Category" 
            name="categoryIds"
            initialValue={categoryIds}
            rules={[{required: true, message: 'Category must be selected'}]}>
                <Cascader
                  placeholder='Please select category'
                  options={this.state.options} 
                  loadData={this.loadData}
                />
          </Item>
          <Item label="Image">
            <PicturesWall ref={this.pwRef} imgs={isUpdate ? product.imgs : ''}/>
          </Item>
          <Item label="Details" labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.editorRef} detail={isUpdate ? product.detail : ''}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>Submit</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default withRouter(ProductAddUpdate)