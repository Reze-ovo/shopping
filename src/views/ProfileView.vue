<!-- src/views/ProfileView.vue -->
<template>
  <div class="profile-container">
    <!-- 未登录提示 -->
    <div v-if="!isLoggedIn" class="login-prompt">
      <p>您尚未登录，点击下面按钮登录后查看个人信息和历史订单。</p>
      <el-button type="primary" @click="goLogin">去登录</el-button>
    </div>

    <!-- 已登录，显示个人信息和历史订单 -->
    <div v-else>
      <!-- 用户信息 -->
      <el-card class="profile-card">
        <el-avatar :src="profile.avatar" size="large" />
        <div class="info">
          <h3>{{ profile.name }}</h3>
          <p>{{ profile.email }}</p>
        </div>
        <el-button type="danger" @click="onLogout">退出登录</el-button>
      </el-card>

      <!-- 历史订单 -->
      <el-divider>历史订单 (共 {{ orderCount }} 条)</el-divider>
      <el-table :data="orders" stripe style="width: 100%">
        <el-table-column prop="id"    label="订单号" width="120" />
        <el-table-column prop="date"  label="日期"    width="150" />
        <el-table-column prop="total" label="总价" width="120">
          <template #default="{ row }">¥{{ row.total.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="text" @click="viewOrder(row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

// 登录状态
const isLoggedIn = computed(() => store.state.user.isLoggedIn)
// 个人信息
const profile = computed(() => store.state.user.profile)
// 历史订单
const orders = computed(() => store.state.user.orders)
// 历史订单条数
const orderCount = computed(() => store.getters['user/orderCount'])

// 跳转到登录页
function goLogin () {
  router.push({ name: 'login' })
}

// 退出登录
function onLogout () {
  store.dispatch('user/logout')
  ElMessage.success('已退出登录')
  // 登出后回到首页
  router.push({ name: 'home' })
}

// 查看订单详情（可后续实现）
function viewOrder (id) {
  ElMessage.info(`查看订单 ${id} 详情，功能待实现`)
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  padding-bottom: var(--footer-height);
}

/* 未登录提示样式 */
.login-prompt {
  text-align: center;
  margin-top: 100px;
}
.login-prompt p {
  margin-bottom: 20px;
  color: #666;
}

/* 个人信息卡片 */
.profile-card {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
}
.profile-card .el-avatar {
  margin-right: 20px;
}
.profile-card .info {
  flex: 1;
}
</style>
