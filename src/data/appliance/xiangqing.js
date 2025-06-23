// src/data/phone/xiangqing.js

export default [
  {
    id: 201,
    title: '美的空调风尊二代Pro',
    oldPrice: 4599,
    price: 2239,
    protect: '极速退款，七天无理由退换',
    delivery: '多仓发货 · 免运费',
    versions: ['风尊二代 180°', '风尊二代Pro', '大挂风尊二代 '],
    colors: ['白色', '黑色', '银色'],
    specs: ['1.5匹', '2匹'],

    // 把所有要用于轮播和小图预览的图片都列在这里：
    images: [
      require('@/assets/appliance/meidi.png')
      // …按需继续添加其他视角的图片…
    ]
  }

  // 如果你还有更多同类手机详情，也可以继续放在这个数组里，
  // 然后跳转时会根据 id 找到对应项。
]
