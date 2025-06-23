// src/store/cart.js
export default {
  namespaced: true,
  state: () => ({
    items: [] // 每个元素 { id, title, price, qty, spec }
  }),
  getters: {
    // 1) 计算购物车所有商品的总价
    totalPrice (state) {
      return state.items.reduce((sum, it) => sum + it.price * it.qty, 0)
    }
  },
  mutations: {
    // 2) 加入购物车
    addToCart (state, product) {
      const exist = state.items.find(
        i => i.id === product.id && i.spec === product.spec
      )
      if (exist) {
        exist.qty += product.qty
      } else {
        state.items.push({ ...product })
      }
    },
    // 3) 清空购物车
    clearCart (state) {
      state.items = []
    }
  },
  actions: {
    addToCart ({ commit }, product) {
      commit('addToCart', product)
    },
    clearCart ({ commit }) {
      commit('clearCart')
    }
  }
}
