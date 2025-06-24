// src/store/favorites.js
export default {
  namespaced: true,
  state: () => ({
    // 从 localStorage 读取收藏列表
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]')
  }),
  getters: {
    // 检查商品是否已收藏
    isFavorite: (state) => (productId) => {
      return state.favorites.some(item => item.id === productId)
    },
    // 获取收藏数量
    favoriteCount: (state) => {
      return state.favorites.length
    },
    // 获取收藏列表
    favoriteList: (state) => {
      return state.favorites
    }
  },
  mutations: {
    // 添加收藏
    ADD_FAVORITE (state, product) {
      const exists = state.favorites.find(item => item.id === product.id)
      if (!exists) {
        state.favorites.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          spec: product.spec,
          addedAt: new Date().toISOString()
        })
        // 保存到 localStorage
        localStorage.setItem('favorites', JSON.stringify(state.favorites))
      }
    },
    // 移除收藏
    REMOVE_FAVORITE (state, productId) {
      const index = state.favorites.findIndex(item => item.id === productId)
      if (index > -1) {
        state.favorites.splice(index, 1)
        // 保存到 localStorage
        localStorage.setItem('favorites', JSON.stringify(state.favorites))
      }
    },
    // 清空收藏
    CLEAR_FAVORITES (state) {
      state.favorites = []
      localStorage.removeItem('favorites')
    }
  },
  actions: {
    // 切换收藏状态
    toggleFavorite ({ commit, getters }, product) {
      if (getters.isFavorite(product.id)) {
        commit('REMOVE_FAVORITE', product.id)
        return false // 返回false表示已取消收藏
      } else {
        commit('ADD_FAVORITE', product)
        return true // 返回true表示已添加收藏
      }
    },
    // 添加收藏
    addFavorite ({ commit }, product) {
      commit('ADD_FAVORITE', product)
    },
    // 移除收藏
    removeFavorite ({ commit }, productId) {
      commit('REMOVE_FAVORITE', productId)
    },
    // 清空收藏
    clearFavorites ({ commit }) {
      commit('CLEAR_FAVORITES')
    }
  }
}
