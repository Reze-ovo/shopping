// src/data/phone/xiangqing.js

export default [
  {
    id: 101,
    title: 'MacBook Pro',
    oldPrice: 18999,
    price: 12999,
    protect: '极速退款，七天无理由退换',
    delivery: '多仓发货 · 免运费',
    versions: ['MacBook Pro M4', 'MacBook Pro M4 PRO', 'MacBook Pro M4 MAX'],
    colors: ['白色钛金属', '原色钛金属'],
    specs: ['512GB', '1TB'],

    // 把所有要用于轮播和小图预览的图片都列在这里：
    images: [
      require('@/assets/computer/macbookpro.png')
      // …按需继续添加其他视角的图片…
    ]
  }

  // 如果你还有更多同类手机详情，也可以继续放在这个数组里，
  // 然后跳转时会根据 id 找到对应项。
]
