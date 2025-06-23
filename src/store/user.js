// src/store/user.js
export default {
  namespaced: true,
  state: () => ({
    // 默认未登录
    isLoggedIn: false,
    profile: {},
    // 历史订单，可根据需要初始化为空或保留模拟数据
    orders: [
      // 如果想让注册用户一开始没有订单，这里可以留空 []
      { id: 101, date: '2025-06-10', total: 259.00 },
      { id: 102, date: '2025-06-12', total: 109.50 },
      { id: 103, date: '2025-06-15', total: 349.99 }
    ]
  }),
  mutations: {
    // 登录／注册成功后设置用户
    SET_USER (state, { id, name, avatar, email }) {
      state.isLoggedIn = true
      state.profile = { id, name, avatar, email }
    },
    // 登出
    LOGOUT (state) {
      state.isLoggedIn = false
      state.profile = {}
      state.orders = []
    },
    // 更新资料（若后续有个人信息修改）
    UPDATE_PROFILE (state, payload) {
      state.profile = { ...state.profile, ...payload }
    },
    // 追加新订单
    ADD_ORDER (state, order) {
      state.orders.push(order)
    },
    // … 现有 …
    setLoggedIn (state, val) {
      state.isLoggedIn = val
    }
  },
  actions: {
    // 模拟登录：只需邮箱+密码（密码不存储），随机昵称和头像
    login ({ commit }, { email, password }) {
      // 这里可以加一个密码非空校验
      const id = Date.now()
      const name = `用户${Math.floor(1000 + Math.random() * 9000)}`
      const avatar = `https://i.pravatar.cc/100?img=${Math.floor(1 + Math.random() * 70)}`
      commit('SET_USER', { id, name, avatar, email })
    },
    // 模拟注册，与 login 同逻辑
    register ({ commit }, { email, password }) {
      const id = Date.now()
      const name = `用户${Math.floor(1000 + Math.random() * 9000)}`
      const avatar = `https://i.pravatar.cc/100?img=${Math.floor(1 + Math.random() * 70)}`
      commit('SET_USER', { id, name, avatar, email })
    },
    logout ({ commit }) {
      commit('LOGOUT')
    },
    updateProfile ({ commit }, payload) {
      commit('UPDATE_PROFILE', payload)
    },
    addOrder ({ commit }, order) {
      commit('ADD_ORDER', order)
    }
  },
  getters: {
    orderCount (state) {
      return state.orders.length
    }
  }
}
