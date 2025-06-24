// src/store/addresses.js
export default {
  namespaced: true,
  state: () => ({
    // 从 localStorage 读取地址列表
    addresses: JSON.parse(localStorage.getItem('addresses') || '[]')
  }),
  getters: {
    // 获取默认地址
    defaultAddress: (state) => {
      return state.addresses.find(addr => addr.isDefault) || null
    },
    // 获取地址数量
    addressCount: (state) => {
      return state.addresses.length
    },
    // 获取所有地址
    allAddresses: (state) => {
      return state.addresses
    }
  },
  mutations: {
    // 添加地址
    ADD_ADDRESS (state, address) {
      // 如果设为默认，取消其他默认地址
      if (address.isDefault) {
        state.addresses.forEach(addr => {
          addr.isDefault = false
        })
      }

      // 如果是第一个地址，自动设为默认
      if (state.addresses.length === 0) {
        address.isDefault = true
      }

      const newAddress = {
        ...address,
        id: Date.now(),
        createdAt: new Date().toISOString()
      }

      state.addresses.push(newAddress)
      // 保存到 localStorage
      localStorage.setItem('addresses', JSON.stringify(state.addresses))
    },

    // 更新地址
    UPDATE_ADDRESS (state, updatedAddress) {
      const index = state.addresses.findIndex(addr => addr.id === updatedAddress.id)
      if (index > -1) {
        // 如果设为默认，取消其他默认地址
        if (updatedAddress.isDefault) {
          state.addresses.forEach(addr => {
            addr.isDefault = false
          })
        }

        state.addresses[index] = { ...updatedAddress }
        // 保存到 localStorage
        localStorage.setItem('addresses', JSON.stringify(state.addresses))
      }
    },

    // 删除地址
    REMOVE_ADDRESS (state, addressId) {
      const index = state.addresses.findIndex(addr => addr.id === addressId)
      if (index > -1) {
        const removedAddress = state.addresses[index]
        state.addresses.splice(index, 1)

        // 如果删除的是默认地址，且还有其他地址，设置第一个为默认
        if (removedAddress.isDefault && state.addresses.length > 0) {
          state.addresses[0].isDefault = true
        }

        // 保存到 localStorage
        localStorage.setItem('addresses', JSON.stringify(state.addresses))
      }
    },

    // 设置默认地址
    SET_DEFAULT_ADDRESS (state, addressId) {
      state.addresses.forEach(addr => {
        addr.isDefault = addr.id === addressId
      })
      // 保存到 localStorage
      localStorage.setItem('addresses', JSON.stringify(state.addresses))
    },

    // 清空所有地址
    CLEAR_ADDRESSES (state) {
      state.addresses = []
      localStorage.removeItem('addresses')
    }
  },
  actions: {
    // 添加地址
    addAddress ({ commit }, address) {
      commit('ADD_ADDRESS', address)
    },

    // 更新地址
    updateAddress ({ commit }, address) {
      commit('UPDATE_ADDRESS', address)
    },

    // 删除地址
    removeAddress ({ commit }, addressId) {
      commit('REMOVE_ADDRESS', addressId)
    },

    // 设置默认地址
    setDefaultAddress ({ commit }, addressId) {
      commit('SET_DEFAULT_ADDRESS', addressId)
    },

    // 清空地址
    clearAddresses ({ commit }) {
      commit('CLEAR_ADDRESSES')
    }
  }
}
