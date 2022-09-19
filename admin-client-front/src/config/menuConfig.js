const menuList = [
  {
    title: 'Home', 
    key: '/home', 
    icon: 'home', 
    isPublic: true, 
  },
  {
    title: 'Product',
    key: '/products',
    icon: 'appstore',
    children: [
      {
        title: 'Category Management',
        key: '/category',
        icon: 'bars'
      },
      {
        title: 'Product Management',
        key: '/product',
        icon: 'tool'
      },
    ]
  },

  {
    title: 'User Management',
    key: '/user',
    icon: 'user'
  },
  {
    title: 'Role Management',
    key: '/role',
    icon: 'safety',
  },

  {
    title: 'Charts',
    key: '/charts',
    icon: 'area-chart',
    children: [
      {
        title: 'Bar chart',
        key: '/charts/bar',
        icon: 'bar-chart'
      },
      {
        title: 'Line chart',
        key: '/charts/line',
        icon: 'line-chart'
      },
      {
        title: 'Pie chart',
        key: '/charts/pie',
        icon: 'pie-chart'
      },
    ]
  },

  {
    title: 'Order Management',
    key: '/order',
    icon: 'windows',
  },
]

export default menuList