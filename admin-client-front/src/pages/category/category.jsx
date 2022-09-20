import React, {Component} from 'react'
import {
  Card,
  Table,
  Button,
  message,
  Modal,
  Form,
  Select,
  Input
} from 'antd'
import {ArrowRightOutlined, PlusOutlined} from "@ant-design/icons";

import LinkButton from '../../components/link-button'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'

const Item = Form.Item
const Option = Select.Option

export default class Category extends Component {
  addFormRef = React.createRef()
  updateFormRef = React.createRef()

  state = {
    loading: false, // whether is requiring data
    categorys: [], // first class category list
    subCategorys: [], // secondary category list
    parentId: '0', // The parent category ID of the category list that needs to be displayed currently
    parentName: '', // The name of the parent category of the category list that needs to be displayed currently
    showStatus: 0, // Whether the confirmation box for adding/updating is displayed, 0: not displayed, 1: displayed added, 2: displayed updated
  }

  /*
  Initialize an array of all columns of the Table
   */
  initColumns = () => {
    this.columns = [
      {
        title: 'Category name',
        dataIndex: 'name',
      },
      {
        title: 'Operate',
        width: 300,
        render: (category) => ( 
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>Update category</LinkButton>
            {this.state.parentId==='0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>View subcategories</LinkButton> : null}
          </span>
        )
      }
    ]
  }


  /*
  Asynchronously obtain primary/secondary category list display
  parentId: If not specified request according to the parentId in the state, if specified according to the specified request
   */
  getCategorys = async (parentId) => {

    // Before sending the request, display loading
    this.setState({loading: true})
    parentId = parentId || this.state.parentId
    // Send asynchronous ajax request, get data
    const result = await reqCategorys(parentId)
    // After the request completes, hide the loading
    this.setState({loading: false})

    if(result.status===0) {
      // Take out the categorical array (may be first-level or second-level)
      const categorys = result.data
      if(parentId==='0') {
        // Update primary classification status
        this.setState({
          categorys
        })
        console.log('----', this.state.categorys.length)
      } else {
        // Update secondary classification status
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('Failed to get category list')
    }
  }

  /*
  Display two sublists of the specified first-level classification objects
   */
  showSubCategorys = (category) => {
    // update status
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { 
      console.log('parentId', this.state.parentId) // '0'
      this.getCategorys()
    })

  }

  /*
  Display a list of specified first-level categories
   */
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  /*
  In response to click cancel: hide the OK box
   */
  handleAddFormCancel = () => {
    this.addFormRef.current.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  handleUpdateFormCancel = () => {
    this.updateFormRef.current.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  /*
  Show added confirmation box
   */
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  /*
  add category
   */
  addCategory = async () => {
    this.addFormRef.current.validateFields()
      .then(async values => {
        this.setState({
          showStatus: 0
        })

        const {parentId, categoryName} = values
        this.addFormRef.current.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if(result.status===0) {

          if(parentId===this.state.parentId) {
            this.getCategorys()
          } else if (parentId==='0'){
            this.getCategorys('0')
          }
        }
      }
    )
    .catch(errorInfo => console.log("FAILED", errorInfo))
  }


  /*
  Show confirmation box for modification
   */
  showUpdate = (category) => {
    this.category = category
    this.setState({
      showStatus: 2
    })
  }

  /*
  Update classification
   */
  updateCategory = async () => {
    console.log('updateCategory()')
    this.updateFormRef.current.validateFields()
      .then(async values => {
        this.setState({
          showStatus: 0
        })

        const categoryId = this.category._id
        const {categoryName} = values
        this.updateFormRef.current.resetFields()

        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status===0) {
          this.getCategorys()
        }
      })
      .catch(errorInfo => console.log("FAILED", errorInfo))
  }




  /*
  Prepare data for the first render()
   */
  componentWillMount () {
    this.initColumns()
  }

  /*
  Execute asynchronous tasks: send asynchronous ajax requests
   */
  componentDidMount () {
    this.getCategorys()
  }

  render() {

    const {categorys, subCategorys, parentId, parentName, loading, showStatus} = this.state
    const category = this.category || {}

    // the left side of the card
    const title = parentId === '0' ? 'First-level category list' : (
      <span>
        <LinkButton onClick={this.showCategorys}>First-level category list</LinkButton>
        <ArrowRightOutlined style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
    )
    // the right side of the card
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <PlusOutlined />
        Add
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={parentId==='0' ? categorys : subCategorys}
          columns={this.columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />

        <Modal
          title="Add category"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleAddFormCancel}
        >
          <Form ref={this.addFormRef}>
            <Item name='parentId' initialValue={parentId}>
                  <Select>
                    <Option value='0'>First class category</Option>
                    {
                      categorys.map(c => <Option value={c._id}>{c.name}</Option>)
                    }
                  </Select>
            </Item>

            <Item name='categoryName' initialValue='' rules={[{required: true, message: 'Must input the category name'}]}>
                  <Input placeholder='Please input the category name'/>
            </Item>
          </Form>
        </Modal>

        <Modal
          title="Update category"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleUpdateFormCancel}
        >
          <Form ref={this.updateFormRef}>
            <Item name='categoryName' 
                initialValue={category.name} 
                rules={[{required: true, message: 'Must input the category name'}]}>
                  <Input placeholder='Please input the category name'/>
            </Item>
          </Form>
        </Modal>
      </Card>
    )
  }
}