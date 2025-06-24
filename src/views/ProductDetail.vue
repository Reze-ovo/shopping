<template>
  <div class="product-detail-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <Icon icon="mdi:arrow-left" />
      <span>返回</span>
    </div>

    <div class="detail-content">
      <!-- 左侧：图片展示区 -->
      <div class="image-section">
        <div class="main-image-container">
          <img
            v-lazy="currentImage"
            :alt="product.title"
            class="main-image"
            @click="showImagePreview = true"
          />
          <div class="image-overlay">
            <button class="zoom-btn" @click="showImagePreview = true">
              <Icon icon="mdi:magnify-plus" />
            </button>
            <button
              class="favorite-btn"
              :class="{ 'is-favorite': isFavorite }"
              @click="toggleFavorite"
            >
              <Icon
                :icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"
                :class="{ 'animate__animated animate__heartBeat': favoriteAnimation }"
              />
            </button>
          </div>
        </div>

        <div class="thumbnail-list" v-if="product.images.length > 1">
          <div
            v-for="(img, idx) in product.images"
            :key="idx"
            :class="['thumbnail', { active: idx === activeThumb }]"
            @click="selectImage(idx)"
          >
            <img v-lazy="img" :alt="`${product.title} ${idx + 1}`" />
          </div>
        </div>
      </div>

      <!-- 右侧：商品信息区 -->
      <div class="info-section">
        <!-- 商品标题和评分 -->
        <div class="product-header">
          <h1 class="product-title">{{ product.title }}</h1>
          <div class="product-rating">
            <div class="stars">
              <Icon v-for="i in 5" :key="i" icon="mdi:star" />
            </div>
            <span class="rating-score">4.8</span>
            <span class="rating-count">(1,234 评价)</span>
          </div>
        </div>

        <!-- 价格区域 -->
        <div class="price-section">
          <div class="price-main">
            <span class="current-price">¥{{ product.price }}</span>
            <span class="original-price">¥{{ product.oldPrice }}</span>
            <span class="discount-badge">
              {{ Math.round((1 - product.price / product.oldPrice) * 100) }}% OFF
            </span>
          </div>
          <div class="price-benefits">
            <div class="benefit-item">
              <Icon icon="mdi:shield-check" />
              <span>正品保障</span>
            </div>
            <div class="benefit-item">
              <Icon icon="mdi:truck-fast" />
              <span>极速配送</span>
            </div>
            <div class="benefit-item">
              <Icon icon="mdi:refresh" />
              <span>7天退换</span>
            </div>
          </div>
        </div>

        <!-- 配送信息 -->
        <div class="delivery-section">
          <div class="delivery-item">
            <Icon icon="mdi:map-marker" class="delivery-icon" />
            <span class="delivery-label">配送至</span>
            <button class="address-btn" @click="addrDialog = true">
              {{ displayAddress }}
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>
          <div class="delivery-item">
            <Icon icon="mdi:clock-outline" class="delivery-icon" />
            <span class="delivery-label">预计</span>
            <span class="delivery-time">今日 18:00 前送达</span>
          </div>
        </div>

        <!-- 商品选项 -->
        <div class="options-section">
          <div class="option-group" v-if="product.versions.length">
            <label class="option-label">版本</label>
            <div class="option-buttons">
              <button
                v-for="version in product.versions"
                :key="version"
                :class="['option-btn', { active: selectedVersion === version }]"
                @click="selectedVersion = version"
              >
                {{ version }}
              </button>
            </div>
          </div>

          <div class="option-group" v-if="product.colors.length">
            <label class="option-label">颜色</label>
            <div class="option-buttons">
              <button
                v-for="color in product.colors"
                :key="color"
                :class="['option-btn', { active: selectedColor === color }]"
                @click="selectedColor = color"
              >
                {{ color }}
              </button>
            </div>
          </div>

          <div class="option-group" v-if="product.specs.length">
            <label class="option-label">存储</label>
            <div class="option-buttons">
              <button
                v-for="spec in product.specs"
                :key="spec"
                :class="['option-btn', { active: selectedSpec === spec }]"
                @click="selectedSpec = spec"
              >
                {{ spec }}
              </button>
            </div>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-section">
          <label class="quantity-label">数量</label>
          <div class="quantity-controls">
            <button class="qty-btn" @click="decreaseQty" :disabled="qty <= 1">
              <Icon icon="mdi:minus" />
            </button>
            <span class="qty-display">{{ qty }}</span>
            <button class="qty-btn" @click="increaseQty">
              <Icon icon="mdi:plus" />
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <button class="add-cart-btn" @click="onAddToCart">
            <Icon icon="mdi:cart-plus" />
            加入购物车
          </button>
          <button class="buy-now-btn" @click="onBuy">
            <Icon icon="mdi:lightning-bolt" />
            立即购买
          </button>
        </div>
      </div>
    </div>

    <!-- 地址选择对话框 -->
    <div v-if="addrDialog" class="address-modal" @click="addrDialog = false">
      <div class="address-content" @click.stop>
        <div class="modal-header">
          <h3>选择收货地址</h3>
          <button class="close-btn" @click="addrDialog = false">
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div class="modal-body">
          <!-- 已保存的地址列表 -->
          <div v-if="savedAddresses.length > 0" class="saved-addresses">
            <h4>选择已保存的地址</h4>
            <div class="address-list">
              <div
                v-for="addr in savedAddresses"
                :key="addr.id"
                class="address-option"
                :class="{ active: selectedAddressId === addr.id }"
                @click="selectSavedAddress(addr)"
              >
                <div class="address-info">
                  <div class="recipient-info">
                    <span class="recipient">{{ addr.recipient }}</span>
                    <span class="phone">{{ addr.phone }}</span>
                    <span v-if="addr.isDefault" class="default-tag">默认</span>
                  </div>
                  <div class="address-detail">
                    {{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}
                  </div>
                </div>
                <div class="check-icon" v-if="selectedAddressId === addr.id">
                  <Icon icon="mdi:check-circle" />
                </div>
              </div>
            </div>
            <div class="divider">
              <span>或者</span>
            </div>
          </div>

          <!-- 手动输入地址 -->
          <div class="manual-address">
            <h4>手动输入地址</h4>
            <div class="address-input">
              <Icon icon="mdi:map-marker" />
              <input
                v-model="address"
                placeholder="请输入详细地址，如：北京市朝阳区xxx街道"
                class="address-field"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="addrDialog = false">取消</button>
          <button class="confirm-btn" @click="onConfirmAddress">确定</button>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div v-if="showImagePreview" class="image-preview-modal" @click="showImagePreview = false">
      <div class="preview-content">
        <img :src="currentImage" :alt="product.title" />
        <button class="preview-close" @click="showImagePreview = false">
          <Icon icon="mdi:close" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'

import phoneDetails from '@/data/phone/xiangqing.js'
import computerDetails from '@/data/computer/xiangqing.js'
import applianceDetails from '@/data/appliance/xiangqing.js'
import clothingDetails from '@/data/clothing/xiangqing.js'

const route = useRoute()
const router = useRouter()
const store = useStore()
const toast = useToast()

const category = route.params.category
const id = Number(route.params.id)

// 默认值，防止先渲染报错
const product = ref({
  id: 0,
  title: '',
  images: [],
  oldPrice: 0,
  price: 0,
  protect: '',
  delivery: '',
  versions: [],
  colors: [],
  specs: []
})

onMounted(() => {
  const map = {
    phone: phoneDetails,
    computer: computerDetails,
    appliance: applianceDetails,
    clothing: clothingDetails
  }
  const list = map[category] || []
  const found = list.find(p => p.id === id)
  if (found) {
    product.value = found
    // 设置默认选项
    if (found.versions.length) selectedVersion.value = found.versions[0]
    if (found.colors.length) selectedColor.value = found.colors[0]
    if (found.specs.length) selectedSpec.value = found.specs[0]
  }
})

// 图片相关方法
const selectImage = (index) => {
  activeThumb.value = index
}

// 收藏功能
const toggleFavorite = async () => {
  try {
    const isAdded = await store.dispatch('favorites/toggleFavorite', product.value)

    favoriteAnimation.value = true
    setTimeout(() => {
      favoriteAnimation.value = false
    }, 1000)

    if (isAdded) {
      toast.success(`已收藏 ${product.value.title}`, { icon: '❤️' })
    } else {
      toast.info(`已取消收藏 ${product.value.title}`, { icon: '💔' })
    }
  } catch (error) {
    toast.error('操作失败，请重试')
  }
}

// 数量控制
const increaseQty = () => {
  qty.value++
}

const decreaseQty = () => {
  if (qty.value > 1) {
    qty.value--
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

const activeThumb = ref(0)
const selectedVersion = ref('')
const selectedColor = ref('')
const selectedSpec = ref('')
const qty = ref(1)
const addrDialog = ref(false)
const address = ref('')
const displayAddress = ref('请选择地址')
const showImagePreview = ref(false)
const favoriteAnimation = ref(false)
const selectedAddressId = ref(null)

// 计算属性
const currentImage = computed(() => {
  return product.value.images[activeThumb.value] || ''
})

const isFavorite = computed(() => {
  return store.getters['favorites/isFavorite'](product.value.id)
})

// 获取保存的地址列表
const savedAddresses = computed(() => {
  return store.getters['addresses/allAddresses'] || []
})

// 选择保存的地址
const selectSavedAddress = (addr) => {
  selectedAddressId.value = addr.id
  const fullAddress = `${addr.province} ${addr.city} ${addr.district} ${addr.detail}`
  address.value = fullAddress
}

// 地址确认
const onConfirmAddress = () => {
  if (selectedAddressId.value) {
    // 使用选中的保存地址
    const selectedAddr = savedAddresses.value.find(addr => addr.id === selectedAddressId.value)
    if (selectedAddr) {
      displayAddress.value = `${selectedAddr.province} ${selectedAddr.city} ${selectedAddr.district} ${selectedAddr.detail}`
    }
  } else if (address.value.trim()) {
    // 使用手动输入的地址
    displayAddress.value = address.value.trim()
  } else {
    toast.warning('请选择或输入收货地址')
    return
  }

  addrDialog.value = false
  toast.success('地址已确认')
}

// ————————————
// 购买：同时写入用户订单，并跳到“我的”页
// ————————————
function onBuy () {
  if (displayAddress.value === '请选择地址') {
    toast.warning('请先选择收货地址')
    addrDialog.value = true
    return
  }
  // 构建一笔订单
  const newOrder = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    total: product.value.price * qty.value
  }
  // 派发到 user 模块
  store.dispatch('user/addOrder', newOrder)
  toast.success('购买成功！', { icon: '🎉' })
  // 跳到“我的”页，查看历史订单
  router.push({ name: 'profile' })
}

// ————————————
// 加入购物车：保持不变
// ————————————
const onAddToCart = () => {
  if (!selectedVersion.value && product.value.versions.length) {
    toast.warning('请选择商品版本')
    return
  }

  if (!selectedColor.value && product.value.colors.length) {
    toast.warning('请选择商品颜色')
    return
  }

  if (!selectedSpec.value && product.value.specs.length) {
    toast.warning('请选择商品规格')
    return
  }

  store.dispatch('cart/addToCart', {
    id: product.value.id,
    title: product.value.title,
    price: product.value.price,
    spec: `${selectedVersion.value} ${selectedColor.value} ${selectedSpec.value}`.trim(),
    qty: qty.value
  })

  toast.success(`已添加 ${product.value.title} 到购物车`, { icon: '🛒' })
}
</script>

<style scoped>
.product-detail-container {
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

/* 主要内容区域 */
.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4xl);
  max-width: 1200px;
  margin: 0 auto;
}

/* 图片展示区域 */
.image-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.main-image-container {
  position: relative;
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  aspect-ratio: 1;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;
  transition: transform var(--transition-slow);
}

.main-image:hover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.main-image-container:hover .image-overlay {
  opacity: 1;
}

.zoom-btn, .favorite-btn {
  width: 48px;
  height: 48px;
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.zoom-btn:hover, .favorite-btn:hover {
  transform: scale(1.1);
  background: var(--primary-color);
  color: var(--text-inverse);
}

.favorite-btn.is-favorite {
  background: var(--error-color);
  color: var(--text-inverse);
}

.favorite-btn.is-favorite:hover {
  background: var(--error-color);
  transform: scale(1.15);
}

/* 缩略图列表 */
.thumbnail-list {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 3px solid transparent;
  box-shadow: var(--shadow-sm);
}

.thumbnail:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.thumbnail.active {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-lg);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品信息区域 */
.info-section {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-4xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

/* 商品标题和评分 */
.product-header {
  border-bottom: 1px solid var(--border-light);
  padding-bottom: var(--space-xl);
}

.product-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-lg) 0;
  line-height: var(--line-height-tight);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.stars {
  display: flex;
  color: #ffd700;
  font-size: 18px;
}

.rating-score {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.rating-count {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

/* 价格区域 */
.price-section {
  background: linear-gradient(135deg, var(--error-color) 0%, #ff8a80 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  color: var(--text-inverse);
}

.price-main {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.current-price {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
}

.original-price {
  font-size: var(--font-size-xl);
  text-decoration: line-through;
  opacity: 0.8;
}

.discount-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.price-benefits {
  display: flex;
  gap: var(--space-xl);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* 配送信息 */
.delivery-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
}

.delivery-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.delivery-icon {
  font-size: 20px;
  color: var(--primary-color);
}

.delivery-label {
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  min-width: 60px;
}

.address-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.address-btn:hover {
  color: var(--primary-light);
}

.delivery-time {
  color: var(--success-color);
  font-weight: var(--font-weight-semibold);
}

/* 商品选项 */
.options-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.option-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.option-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.option-btn {
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-tertiary);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
}

.option-btn:hover {
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.option-btn.active {
  background: var(--primary-gradient);
  border-color: transparent;
  color: var(--text-inverse);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 数量选择 */
.quantity-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.quantity-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  min-width: 60px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  color: var(--text-primary);
}

.qty-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: var(--text-inverse);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-display {
  min-width: 60px;
  text-align: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: var(--space-lg);
  margin-top: auto;
}

.add-cart-btn, .buy-now-btn {
  flex: 1;
  padding: var(--space-lg) var(--space-xl);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.add-cart-btn {
  background: var(--warning-gradient);
  color: var(--text-inverse);
}

.buy-now-btn {
  background: var(--primary-gradient);
  color: var(--text-inverse);
}

.add-cart-btn:hover, .buy-now-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 地址选择模态框 */
.address-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.address-content {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-light);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.close-btn {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--space-xl);
}

/* 保存的地址列表 */
.saved-addresses h4,
.manual-address h4 {
  margin: 0 0 var(--space-lg) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.address-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
}

.address-option:hover {
  border-color: var(--primary-color);
  background: var(--bg-secondary);
}

.address-option.active {
  border-color: var(--primary-color);
  background: var(--bg-secondary);
}

.address-option.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0.05;
  border-radius: var(--radius-lg);
}

.address-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.recipient-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}

.recipient {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.phone {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.default-tag {
  background: var(--primary-gradient);
  color: var(--text-inverse);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.address-detail {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.check-icon {
  color: var(--primary-color);
  font-size: 24px;
  position: relative;
  z-index: 1;
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  margin: var(--space-xl) 0;
  text-align: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-light);
}

.divider span {
  padding: 0 var(--space-lg);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  background: var(--bg-primary);
}

.address-input {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-light);
  transition: border-color var(--transition-normal);
}

.address-input:focus-within {
  border-color: var(--primary-color);
}

.address-field {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.address-field::placeholder {
  color: var(--text-muted);
}

.modal-footer {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-xl);
  border-top: 1px solid var(--border-light);
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: var(--space-md) var(--space-xl);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.cancel-btn {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.confirm-btn {
  background: var(--primary-gradient);
  color: var(--text-inverse);
}

.cancel-btn:hover, .confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 图片预览模态框 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.preview-content img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: var(--radius-lg);
}

.preview-close {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all var(--transition-normal);
}

.preview-close:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .product-title {
    font-size: var(--font-size-3xl);
  }

  .price-main {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .current-price {
    font-size: var(--font-size-3xl);
  }

  .action-section {
    flex-direction: column;
  }

  .thumbnail-list {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: var(--space-sm);
  }
}

@media (max-width: 480px) {
  .product-detail-container {
    padding: var(--space-md);
  }

  .info-section {
    padding: var(--space-xl);
  }

  .option-buttons {
    gap: var(--space-sm);
  }

  .option-btn {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-sm);
  }
}
</style>
