// src/data/phone/xiangqing.js

export default [
  {
    id: 401,
    title: 'Polo Ralph Lauren 男士经典款短袖POLO衫',
    oldPrice: 719,
    price: 478,
    protect: '极速退款，七天无理由退换',
    delivery: '多仓发货 · 免运费',
    versions: ['Polo Ralph Lauren', 'Purple Label', 'RLX Golf'],
    colors: ['白色', '藏青色', '黑色', '灰色'],
    specs: ['S', 'M', 'L', 'XL', 'XXL'],

    // 把所有要用于轮播和小图预览的图片都列在这里：
    images: [
      require('@/assets/clothing/polo.png')
      // …按需继续添加其他视角的图片…
    ]
  }

  // 如果你还有更多同类手机详情，也可以继续放在这个数组里，
  // 然后跳转时会根据 id 找到对应项。
]
