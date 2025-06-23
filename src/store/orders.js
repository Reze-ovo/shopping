// src/store/orders.js
export default {
  namespaced: true,
  state: () => ({
    // 从 localStorage 读取历史订单，刷新也能保留
    orders: JSON.parse(localStorage.getItem('orders') || '[]')
  }),
  mutations: {
    addOrder (state, order) {
      state.orders.push(order)
      // 每次变动都写回 localStorage
      localStorage.setItem('orders', JSON.stringify(state.orders))
    }
  },
  actions: {
    /**
     * payload 应该是形如：
     * {
     *   id: Number,
     *   date: String,
     *   total: Number,
     *   items: [ { id, title, spec, price, qty }, ... ]
     * }
     */
    addOrder ({ commit }, order) {
      commit('addOrder', order)
    }
  }
}
