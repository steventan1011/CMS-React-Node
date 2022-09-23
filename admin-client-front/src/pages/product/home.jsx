import React, {Component} from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from "../../utils/memoryUtils";
import withRouter from '../../utils/withRouter'

const Option = Select.Option

class ProductHome extends Component {

  state = {
    total: 0, // total number of product
    products: [], // products array
    loading: false, // whether is loading
    searchName: '', // search key words
    searchType: 'productName', // by which to search
  }

  constructor (props) {
    super(props)
    
    this.initColumns()
  }

  initColumns = () => {
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'desc',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        render: (price) => '$' + price 
      },
      {
        width: 100,
        title: 'Status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status===1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status===1 ? 'Remove' : 'Sell'}
              </Button>
              <span>{status===1 ? 'On sale' : 'Not on sale'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: 'Operation',
        render: (product) => {
          return (
            <span>
              {/*Pass the product object with state to the target routing component*/}
              <LinkButton onClick={() => this.showDetail(product)}>Details</LinkButton>
              <LinkButton onClick={() => this.showUpdate(product)}>Update</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  /*
  Show the product details page
   */
  showDetail = (product) => {
    // Cache ==> to details page
    memoryUtils.product = product
    this.props.navigate('/product/detail')
  }

  /*
  Show add/update product page
   */
  showUpdate = (product) => {
    // Cache ==> add/update product page
    memoryUtils.product = product
    this.props.navigate('/product/addupdate')
  }

  /*
  Get the list data display of the specified page number
   */
  getProducts = async (pageNum) => {
    this.pageNum = pageNum // Save pageNum for other methods to use
    this.setState({loading: true})

    const {searchName, searchType} = this.state
    let result
    if (searchName) {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }

    this.setState({loading: false}) 
    if (result.status === 0) {
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }

  /*
  Update the status of the specified product
   */
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if(result.status===0) {
      message.success('Successfully update product')
      this.getProducts(this.pageNum)
    }
  }

  componentDidMount () {
    this.getProducts(1)
  }

  render() {

    const {products, total, loading, searchType, searchName} = this.state

    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='productName'>Search by name</Option>
          <Option value='productDesc'>Search by description</Option>
        </Select>
        <Input
          placeholder='Key words'
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={event => this.setState({searchName:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>Search</Button>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={() => this.props.navigate('/product/addupdate')}>
        <PlusOutlined />
        Add product
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}

export default withRouter(ProductHome)