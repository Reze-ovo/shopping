<template>
  <div class="product-card">
    <div class="card-image-container">
      <img
        v-lazy="product.image"
        class="card-img"
        :alt="product.title"
      />
      <div class="card-overlay">
        <div class="quick-actions">
          <button
            class="action-btn favorite-btn"
            :class="{ 'is-favorite': isFavorite }"
            @click.stop="toggleFavorite"
            title="收藏"
          >
            <Icon
              :icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"
              class="heart-icon"
              :class="{ 'animate__animated animate__heartBeat': favoriteAnimation }"
            />
          </button>
          <button class="action-btn view-btn" title="快速查看">
            <Icon icon="mdi:eye-outline" class="eye-icon" />
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ product.title }}</h3>
      <div class="card-price-container">
        <span class="card-price">¥{{ product.price.toFixed(2) }}</span>
        <span class="card-spec">{{ product.spec }}</span>
      </div>
      <div class="card-footer">
        <div class="rating">
          <span class="stars">★★★★★</span>
          <span class="rating-text">4.8</span>
        </div>
        <button class="add-cart-btn" @click.stop="addToCart">
          <Icon icon="mdi:cart-plus" class="cart-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const store = useStore()
const toast = useToast()
const favoriteAnimation = ref(false)

// 检查是否已收藏
const isFavorite = computed(() => {
  return store.getters['favorites/isFavorite'](props.product.id)
})

// 切换收藏状态
const toggleFavorite = async () => {
  try {
    const isAdded = await store.dispatch('favorites/toggleFavorite', props.product)

    // 触发心跳动画
    favoriteAnimation.value = true
    setTimeout(() => {
      favoriteAnimation.value = false
    }, 1000)

    if (isAdded) {
      toast.success(`已收藏 ${props.product.title}`, {
        icon: '❤️'
      })
    } else {
      toast.info(`已取消收藏 ${props.product.title}`, {
        icon: '💔'
      })
    }
  } catch (error) {
    toast.error('操作失败，请重试')
  }
}

// 添加到购物车
const addToCart = () => {
  store.dispatch('cart/addToCart', {
    id: props.product.id,
    title: props.product.title,
    price: props.product.price,
    spec: props.product.spec || '默认规格',
    qty: 1
  })

  toast.success(`已添加 ${props.product.title} 到购物车`, {
    icon: '🛒'
  })
}
</script>

<style scoped>
.product-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  border: 1px solid var(--border-light);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
  border-color: transparent;
}

.product-card:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  border-radius: var(--radius-xl);
  padding: 2px;
  z-index: -1;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
}

.card-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
  background: var(--bg-secondary);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .card-img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card:hover .card-overlay {
  opacity: 1;
}

.quick-actions {
  display: flex;
  gap: var(--space-md);
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--bg-primary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
}

.action-btn:hover {
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

.heart-icon {
  font-size: 18px;
  transition: all var(--transition-normal);
}

.eye-icon, .cart-icon {
  font-size: 16px;
}

.card-body {
  padding: var(--space-lg);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  line-height: var(--line-height-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.card-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-spec {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.stars {
  color: #ffd700;
  font-size: var(--font-size-sm);
}

.rating-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.add-cart-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-gradient);
  border: none;
  color: var(--text-inverse);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.add-cart-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.add-cart-btn:active {
  transform: scale(0.95);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-image-container {
    height: 160px;
  }

  .card-body {
    padding: var(--space-md);
  }

  .card-title {
    font-size: var(--font-size-base);
  }

  .card-price {
    font-size: var(--font-size-lg);
  }
}
</style>
