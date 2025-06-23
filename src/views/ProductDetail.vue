<template>
  <div class="product-detail-container">
    <el-row gutter="20" class="detail-main">
      <!-- 左侧：轮播图 & 缩略图 -->
      <el-col :xs="24" :sm="24" :md="10">
        <el-carousel
          arrow="always"
          trigger="click"
          :interval="3000"
          height="300px"
        >
          <el-carousel-item
            v-for="(img, idx) in product.images"
            :key="idx"
          >
            <img :src="img" class="carousel-img" />
          </el-carousel-item>
        </el-carousel>
        <div class="thumbs">
          <img
            v-for="(img, idx) in product.images"
            :key="idx"
            :src="img"
            :class="['thumb', { active: idx === activeThumb }]"
            @click="activeThumb = idx"
          />
        </div>
      </el-col>

      <!-- 右侧：商品信息 -->
      <el-col :xs="24" :sm="24" :md="12">
        <h2 class="pd-title">{{ product.title }}</h2>

        <!-- 价格 -->
        <div class="price-box">
          <div class="old">券前价 ¥{{ product.oldPrice }}</div>
          <div class="new">券后 ¥{{ product.price }}</div>
        </div>

        <!-- 保障／配送 -->
        <div class="info-box">
          <el-table
            :data="infoRows"
            border
            show-header="false"
            size="small"
            class="info-table"
          >
            <el-table-column prop="label" width="80" />
            <el-table-column>
              <template #default="{ row }">
                <span v-if="row.label === '配送'">
                  {{ row.value }}
                  <el-button type="text" @click="addrDialog = true">
                    至 {{ displayAddress }}
                  </el-button>
                </span>
                <span v-else>{{ row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 选项 -->
        <div class="option-group">
          <div class="opt-row">
            <span class="opt-label">版本：</span>
            <el-button-group>
              <el-button
                v-for="ver in product.versions"
                :key="ver"
                :type="selectedVersion === ver ? 'primary' : 'default'"
                @click="selectedVersion = ver"
              >{{ ver }}</el-button>
            </el-button-group>
          </div>
          <div class="opt-row">
            <span class="opt-label">颜色：</span>
            <el-button-group>
              <el-button
                v-for="col in product.colors"
                :key="col"
                :type="selectedColor === col ? 'primary' : 'default'"
                @click="selectedColor = col"
              >{{ col }}</el-button>
            </el-button-group>
          </div>
          <div class="opt-row">
            <span class="opt-label">存储：</span>
            <el-button-group>
              <el-button
                v-for="sp in product.specs"
                :key="sp"
                :type="selectedSpec === sp ? 'primary' : 'default'"
                @click="selectedSpec = sp"
              >{{ sp }}</el-button>
            </el-button-group>
          </div>
        </div>

        <!-- 操作 -->
        <div class="action-row">
          <el-input-number v-model="qty" :min="1" />
          <el-button type="warning" @click="onBuy">购买</el-button>
          <el-button type="success" @click="onAddToCart">
            加入购物车
          </el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 地址对话框 -->
    <el-dialog
      title="请输入收货地址"
      v-model="addrDialog"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="address"
        placeholder="例如：xx市xx区xx街道"
        clearable
      />
      <template #footer>
        <el-button @click="addrDialog = false">取消</el-button>
        <el-button type="primary" @click="onConfirmAddress">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

import phoneDetails from '@/data/phone/xiangqing.js'
import computerDetails from '@/data/computer/xiangqing.js'
import applianceDetails from '@/data/appliance/xiangqing.js'
import clothingDetails from '@/data/clothing/xiangqing.js'

const route = useRoute()
const router = useRouter()
const store = useStore()

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
  }
})

const activeThumb = ref(0)
const selectedVersion = ref('')
const selectedColor = ref('')
const selectedSpec = ref('')
const qty = ref(1)
const addrDialog = ref(false)
const address = ref('')
const displayAddress = ref('请选择地址')

// info table
const infoRows = computed(() => [
  { label: '保障', value: product.value.protect },
  { label: '配送', value: product.value.delivery }
])

function onConfirmAddress () {
  if (!address.value.trim()) {
    ElMessage.warning('请输入收货地址哦~')
    return
  }
  displayAddress.value = address.value
  addrDialog.value = false
  ElMessage.success('地址已确认')
}

// ————————————
// 购买：同时写入用户订单，并跳到“我的”页
// ————————————
function onBuy () {
  if (displayAddress.value === '请选择地址') {
    ElMessage.warning('请输入收货地址哦~')
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
  ElMessage.success('购买成功！')
  // 跳到“我的”页，查看历史订单
  router.push({ name: 'profile' })
}

// ————————————
// 加入购物车：保持不变
// ————————————
function onAddToCart () {
  if (displayAddress.value === '请选择地址') {
    ElMessage.warning('请输入收货地址哦~')
    addrDialog.value = true
    return
  }
  console.log('🛒 onAddToCart args →', {
    id: product.value.id,
    title: product.value.title,
    price: product.value.price,
    spec: selectedSpec.value,
    qty: qty.value
  })
  store.dispatch('cart/addToCart', {
    id: product.value.id,
    title: product.value.title,
    price: product.value.price,
    spec: selectedSpec.value,
    qty: qty.value
  })
  ElMessage.success('已加入购物车')
}
</script>

<style scoped>
.product-detail-container {
padding: 20px;
padding-bottom: 80px;
background: #f5f7fa;
}

.detail-main {
background: #fff;
padding: 20px;
border-radius: 6px;
}

/* 轮播图样式 */

.carousel-img {
width: 100%;
height: 300px;
object-fit: cover;
}

.thumbs {
display: flex;
margin-top: 10px;
gap: 8px;
}

.thumb {
height: 60px;
object-fit: cover;
border: 2px solid transparent;
border-radius: 4px;
cursor: pointer;
}

.thumb.active {
border-color: #409eff;
}

/* 标题 & 价格 */

.pd-title {
margin-bottom: 16px;
font-size: 1.6rem;
}

.price-box {
display: flex;
background: #f56c6c;
color: #fff;
padding: 10px;
margin-bottom: 16px;
border-radius: 4px;
}

.price-box .old {
text-decoration: line-through;
margin-right: 20px;
}

.price-box .new {
font-size: 1.2rem;
font-weight: bold;
}

/* 保障/配送 */

.info-box {
margin-bottom: 20px;
}

/* 选项 */

.option-group .opt-row {
margin-bottom: 12px;
}

.opt-label {
width: 80px;
display: inline-block;
}

/* 操作按钮 */

.action-row {
display: flex;
align-items: center;
gap: 12px;
}

</style>
