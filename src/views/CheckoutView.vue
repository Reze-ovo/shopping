<template>
  <div class="checkout-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item @click="$router.push({ name: 'home' })">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单确认</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table-wrapper">
      <el-table :data="cartItems" stripe style="min-width: 600px;">
        <el-table-column prop="title" label="商品" />
        <el-table-column prop="spec"  label="规格" width="120" />
        <el-table-column label="单价" width="100">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="数量" width="100" />
        <el-table-column label="小计" width="120">
          <template #default="{ row }">
            ¥{{ (row.price * row.qty).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="checkout-footer">
      <el-button type="danger" @click="onClear">清空购物车</el-button>
      <span class="total">总价：¥{{ totalPrice.toFixed(2) }}</span>
      <el-button type="primary" @click="onConfirm">确认下单</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useStore()
const router = useRouter()

const cartItems = computed(() => store.state.cart.items)
const totalPrice = computed(() => store.getters['cart/totalPrice'])

// 清空购物车（确认框）
async function onClear () {
  try {
    await ElMessageBox.confirm(
      '确定要清空购物车吗？此操作不可撤销。',
      '清空确认',
      { type: 'warning' }
    )
    store.dispatch('cart/clearCart')
    ElMessage.success('购物车已清空')
  } catch {}
}

// ————————————
// 确认下单：把一笔整单写入用户模块
// ————————————
function onConfirm () {
  if (!cartItems.value.length) return
  const newOrder = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    total: totalPrice.value
  }
  store.dispatch('user/addOrder', newOrder)
  store.dispatch('cart/clearCart')
  ElMessage.success('下单成功！')
  router.push({ name: 'profile' })
}
</script>

<style scoped>
.checkout-container {
  padding: 20px;
  padding-bottom: var(--footer-height);
}
.table-wrapper {
  overflow-x: auto;
  margin: 20px 0;
}
.checkout-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}
.checkout-footer .total {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 20px;
}
</style>
