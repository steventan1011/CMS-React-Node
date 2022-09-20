const menuList = [
  {
    title: 'Home', 
    key: '/home', 
    icon: 'HomeOutlined', 
    isPublic: true, 
  },
  {
    title: 'Product',
    key: '/products',
    icon: 'AppstoreOutlined',
    children: [
      {
        title: 'Category Management',
        key: '/category',
        icon: 'BarsOutlined'
      },
      {
        title: 'Product Management',
        key: '/product',
        icon: 'ToolOutlined'
      },
    ]
  },

  {
    title: 'User Management',
    key: '/user',
    icon: 'UserOutlined'
  },
  {
    title: 'Role Management',
    key: '/role',
    icon: 'SafetyOutlined',
  },

  {
    title: 'Charts',
    key: '/charts',
    icon: 'AreaChartOutlined',
    children: [
      {
        title: 'Bar chart',
        key: '/charts/bar',
        icon: 'BarChartOutlined'
      },
      {
        title: 'Line chart',
        key: '/charts/line',
        icon: 'LineChartOutlined'
      },
      {
        title: 'Pie chart',
        key: '/charts/pie',
        icon: 'PieChartOutlined'
      },
    ]
  }

]

export default menuList