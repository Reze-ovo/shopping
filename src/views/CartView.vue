<!-- src/views/CartView.vue -->
<template>
  <div class="cart-container">
    <h2>购物车</h2>

    <!-- 操作按钮 -->
    <div class="cart-actions">
      <el-button
        type="danger"
        @click="onClear"
        :disabled="!hasItems"
      >清空购物车</el-button>
      <el-button
        type="primary"
        @click="onCheckout"
        :disabled="!hasItems"
      >去结算</el-button>
    </div>

    <!-- 可横向滚动的表格包装器 -->
    <div class="table-wrapper">
      <el-table
        :data="items"
        stripe
        style="min-width: 600px;"
        v-loading="loading"
      >
        <el-table-column prop="title"    label="商品" />
        <el-table-column prop="spec"     label="规格" width="120" />
        <el-table-column label="单价" width="100">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="140">
          <template #default="{ row }">
            <el-input-number
              v-model="row.qty"
              :min="1"
              @change="onQtyChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="{ row }">
            ¥{{ (row.price * row.qty).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button
              type="text"
              @click="onRemove(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 总价或空状态 -->
    <div class="cart-total" v-if="hasItems">
      总价：¥{{ totalPrice.toFixed(2) }}
    </div>
    <div v-else class="cart-empty">
      购物车空空如也 😢
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useStore()
const router = useRouter()
const loading = ref(false)

const items = computed(() => store.state.cart.items)
const hasItems = computed(() => items.value.length > 0)
const totalPrice = computed(() =>
  items.value.reduce((sum, it) => sum + it.qty * it.price, 0)
)

// 清空购物车（确认框）
async function onClear () {
  if (!hasItems.value) return
  try {
    await ElMessageBox.confirm(
      '确定要清空购物车吗？此操作不可撤销。',
      '清空确认',
      { type: 'warning' }
    )
    store.dispatch('cart/clearCart')
    ElMessage.success('购物车已清空')
  } catch {
    // 取消操作
  }
}

// 修改数量，保持更新
function onQtyChange (row) {
  // 为了更新 qty，重新构建整个购物车
  const updated = items.value.map(i =>
    i.id === row.id && i.spec === row.spec ? { ...row } : { ...i }
  )
  store.dispatch('cart/clearCart')
  updated.forEach(i => store.dispatch('cart/addToCart', i))
}

// 删除单项（确认框）
async function onRemove (id) {
  try {
    await ElMessageBox.confirm(
      '确定要从购物车删除该商品吗？',
      '删除确认',
      { type: 'warning' }
    )
    const remaining = items.value.filter(i => i.id !== id)
    store.dispatch('cart/clearCart')
    remaining.forEach(i => store.dispatch('cart/addToCart', i))
    ElMessage.info('已删除商品')
  } catch {
    // 取消操作
  }
}

// 前往结算
function onCheckout () {
  router.push({ name: 'checkout' })
}
</script>

<style scoped>
.cart-container {
  padding: 20px;
  padding-bottom: var(--footer-height);
}
.cart-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.cart-actions .el-button + .el-button {
  margin-left: 10px;
}
/* 表格横向滚动容器 */
.table-wrapper {
  overflow-x: auto;
  margin-bottom: 10px;
}
/* 总价与空状态 */
.cart-total {
  text-align: right;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
}
.cart-empty {
  text-align: center;
  color: #888;
  margin-top: 40px;
}
</style>
