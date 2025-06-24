<template>
  <div class="order-detail-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <Icon icon="mdi:arrow-left" />
      <span>返回</span>
    </div>

    <div class="order-content" v-if="order">
      <!-- 订单状态卡片 -->
      <div class="status-card">
        <div class="status-header">
          <div class="status-icon">
            <Icon icon="mdi:check-circle" />
          </div>
          <div class="status-info">
            <h2 class="status-title">订单已完成</h2>
            <p class="status-desc">您的订单已成功完成，感谢您的购买！</p>
          </div>
        </div>
        <div class="status-timeline">
          <div class="timeline-item completed">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>订单确认</h4>
              <p>{{ formatDateTime(order.date) }}</p>
            </div>
          </div>
          <div class="timeline-item completed">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>商品出库</h4>
              <p>{{ getRandomTime(1) }}</p>
            </div>
          </div>
          <div class="timeline-item completed">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>运输中</h4>
              <p>{{ getRandomTime(2) }}</p>
            </div>
          </div>
          <div class="timeline-item completed">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>已送达</h4>
              <p>{{ getRandomTime(3) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <h3 class="card-title">
            <Icon icon="mdi:clipboard-text" />
            订单信息
          </h3>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">订单编号</span>
            <span class="info-value">#{{ order.id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">下单时间</span>
            <span class="info-value">{{ formatDateTime(order.date) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付方式</span>
            <span class="info-value">微信支付</span>
          </div>
          <div class="info-item">
            <span class="info-label">配送地址</span>
            <span class="info-value">北京市朝阳区xxx街道xxx号</span>
          </div>
        </div>
      </div>

      <!-- 商品列表卡片 -->
      <div class="products-card">
        <div class="card-header">
          <h3 class="card-title">
            <Icon icon="mdi:package-variant" />
            商品清单
          </h3>
        </div>
        <div class="products-list">
          <div
            v-for="item in mockOrderItems"
            :key="item.id"
            class="product-item"
          >
            <div class="product-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="product-info">
              <h4 class="product-title">{{ item.title }}</h4>
              <p class="product-spec">{{ item.spec }}</p>
              <div class="product-meta">
                <span class="product-price">¥{{ item.price.toFixed(2) }}</span>
                <span class="product-qty">x{{ item.qty }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 费用明细卡片 -->
      <div class="cost-card">
        <div class="card-header">
          <h3 class="card-title">
            <Icon icon="mdi:calculator" />
            费用明细
          </h3>
        </div>
        <div class="cost-list">
          <div class="cost-item">
            <span class="cost-label">商品总价</span>
            <span class="cost-value">¥{{ order.total.toFixed(2) }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">运费</span>
            <span class="cost-value free">免费</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">优惠券</span>
            <span class="cost-value discount">-¥0.00</span>
          </div>
          <div class="cost-item total">
            <span class="cost-label">实付金额</span>
            <span class="cost-value">¥{{ order.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn secondary" @click="contactService">
          <Icon icon="mdi:headset" />
          联系客服
        </button>
        <button class="action-btn primary" @click="buyAgain">
          <Icon icon="mdi:refresh" />
          再次购买
        </button>
      </div>
    </div>

    <!-- 订单不存在 -->
    <div v-else class="not-found">
      <div class="not-found-icon">
        <Icon icon="mdi:file-document-remove" />
      </div>
      <h3 class="not-found-title">订单不存在</h3>
      <p class="not-found-desc">抱歉，找不到该订单信息</p>
      <button class="go-back-btn" @click="goBack">
        <Icon icon="mdi:arrow-left" />
        返回
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const toast = useToast()

const orderId = route.params.id
const order = ref(null)

// 模拟商品数据
const mockOrderItems = ref([
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    spec: '256GB 深空黑色',
    price: 9999,
    qty: 1,
    image: 'https://via.placeholder.com/80x80'
  }
])

onMounted(() => {
  // 从store中查找订单
  const orders = store.state.user.orders
  const foundOrder = orders.find(o => o.id.toString() === orderId)
  if (foundOrder) {
    order.value = foundOrder
  }
})

// 格式化日期时间
const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 生成随机时间（模拟物流时间）
const getRandomTime = (dayOffset) => {
  const date = new Date(order.value.date)
  date.setDate(date.getDate() + dayOffset)
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  return formatDateTime(date.toISOString())
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 联系客服
const contactService = () => {
  toast.info('客服功能开发中...')
}

// 再次购买
const buyAgain = () => {
  toast.success('已添加到购物车')
  router.push({ name: 'cart' })
}
</script>

<style scoped>
.order-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #f0f4f8 100%);
  padding: var(--space-lg);
  padding-bottom: 100px;
}

/* 返回按钮 */
.back-button {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-normal);
  width: fit-content;
  box-shadow: var(--shadow-sm);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--primary-color);
  color: var(--text-inverse);
}

/* 主要内容 */
.order-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* 通用卡片样式 */
.status-card, .info-card, .products-card, .cost-card {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.card-header {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-light);
}

.card-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

/* 订单状态卡片 */
.status-header {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  padding: var(--space-3xl);
  background: var(--success-gradient);
  color: var(--text-inverse);
}

.status-icon {
  font-size: 48px;
}

.status-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-sm) 0;
}

.status-desc {
  margin: 0;
  opacity: 0.9;
}

.status-timeline {
  padding: var(--space-3xl);
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 12px;
  top: 32px;
  width: 2px;
  height: 40px;
  background: var(--success-color);
}

.timeline-dot {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--success-color);
  border: 4px solid var(--bg-primary);
  box-shadow: 0 0 0 2px var(--success-color);
}

.timeline-content h4 {
  margin: 0 0 var(--space-xs) 0;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.timeline-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* 订单信息网格 */
.info-grid {
  padding: var(--space-xl);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.info-value {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

/* 商品列表 */
.products-list {
  padding: var(--space-xl);
}

.product-item {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.product-item:hover {
  background: var(--bg-secondary);
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.product-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.product-spec {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--error-color);
}

.product-qty {
  color: var(--text-secondary);
}

/* 费用明细 */
.cost-list {
  padding: var(--space-xl);
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--border-light);
}

.cost-item:last-child {
  border-bottom: none;
}

.cost-item.total {
  padding-top: var(--space-lg);
  border-top: 2px solid var(--border-medium);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.cost-label {
  color: var(--text-secondary);
}

.cost-value {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.cost-value.free {
  color: var(--success-color);
}

.cost-value.discount {
  color: var(--error-color);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-3xl);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.action-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-light);
}

.action-btn.primary {
  background: var(--primary-gradient);
  color: var(--text-inverse);
}

.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 订单不存在 */
.not-found {
  text-align: center;
  padding: var(--space-6xl);
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  max-width: 500px;
  margin: var(--space-6xl) auto;
}

.not-found-icon {
  font-size: 80px;
  color: var(--text-muted);
  margin-bottom: var(--space-xl);
}

.not-found-title {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
}

.not-found-desc {
  color: var(--text-secondary);
  margin: 0 0 var(--space-3xl) 0;
}

.go-back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--primary-gradient);
  color: var(--text-inverse);
  border: none;
  padding: var(--space-lg) var(--space-3xl);
  border-radius: var(--radius-xl);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.go-back-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-detail-container {
    padding: var(--space-md);
  }

  .status-header {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .product-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
}
</style>
