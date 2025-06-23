// src/store/index.js
import { createStore } from 'vuex'
import cart from './cart'
import user from './user'
import orders from './orders'
export default createStore({
  state: {
    // 用户登录状态
    isLoggedIn: false,
    userProfile: {}
  },
  mutations: {
    login (state, payload) {
      state.isLoggedIn = true
      state.userProfile = payload
    },
    logout (state) {
      state.isLoggedIn = false
      state.userProfile = {}
    }
  },
  actions: {
    login ({ commit }, userInfo) {
      commit('login', userInfo)
    },
    logout ({ commit }) {
      commit('logout')
    }
  },
  modules: {
    user,
    cart,
    orders
  }
})
