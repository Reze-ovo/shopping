<template>
  <div class="settings-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <Icon icon="mdi:arrow-left" />
      <span>返回</span>
    </div>

    <div class="settings-content">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <Icon icon="mdi:cog" class="title-icon" />
          设置
        </h1>
      </div>

      <!-- 个人信息设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            <Icon icon="mdi:account" />
            个人信息
          </h2>
        </div>
        <div class="profile-settings">
          <!-- 头像设置 -->
          <div class="avatar-setting">
            <div class="avatar-container">
              <img :src="userProfile.avatar" :alt="userProfile.name" class="user-avatar" />
              <div class="avatar-overlay" @click="changeAvatar">
                <Icon icon="mdi:camera" />
              </div>
            </div>
            <div class="avatar-info">
              <h3>头像</h3>
              <p>点击更换头像</p>
            </div>
          </div>

          <!-- 昵称设置 -->
          <div class="nickname-setting">
            <div class="setting-item">
              <div class="setting-label">
                <Icon icon="mdi:account-edit" />
                <span>昵称</span>
              </div>
              <div class="setting-control">
                <input
                  v-if="editingNickname"
                  v-model="newNickname"
                  class="nickname-input"
                  @blur="saveNickname"
                  @keyup.enter="saveNickname"
                  ref="nicknameInput"
                />
                <span v-else class="nickname-display" @click="editNickname">
                  {{ userProfile.name }}
                </span>
                <button class="edit-btn" @click="editNickname" v-if="!editingNickname">
                  <Icon icon="mdi:pencil" />
                </button>
              </div>
            </div>
          </div>

          <!-- 邮箱显示 -->
          <div class="email-setting">
            <div class="setting-item">
              <div class="setting-label">
                <Icon icon="mdi:email" />
                <span>邮箱</span>
              </div>
              <div class="setting-control">
                <span class="email-display">{{ userProfile.email }}</span>
                <span class="verified-badge">
                  <Icon icon="mdi:check-circle" />
                  已验证
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 收货地址管理 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            <Icon icon="mdi:map-marker" />
            收货地址
          </h2>
          <button class="add-address-btn" @click="showAddAddress = true">
            <Icon icon="mdi:plus" />
            添加地址
          </button>
        </div>

        <div class="address-list">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="address-item"
            :class="{ 'is-default': address.isDefault }"
          >
            <div class="address-info">
              <div class="address-header">
                <span class="recipient">{{ address.recipient }}</span>
                <span class="phone">{{ address.phone }}</span>
                <span v-if="address.isDefault" class="default-badge">默认</span>
              </div>
              <div class="address-detail">
                {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
              </div>
            </div>
            <div class="address-actions">
              <button class="action-btn edit" @click="editAddress(address)">
                <Icon icon="mdi:pencil" />
              </button>
              <button class="action-btn delete" @click="deleteAddress(address.id)">
                <Icon icon="mdi:delete" />
              </button>
              <button
                v-if="!address.isDefault"
                class="action-btn default"
                @click="setDefaultAddress(address.id)"
              >
                <Icon icon="mdi:star" />
              </button>
            </div>
          </div>

          <div v-if="addresses.length === 0" class="empty-addresses">
            <Icon icon="mdi:map-marker-off" class="empty-icon" />
            <p>暂无收货地址</p>
            <button class="add-first-address-btn" @click="showAddAddress = true">
              <Icon icon="mdi:plus" />
              添加第一个地址
            </button>
          </div>
        </div>
      </div>

      <!-- 其他设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            <Icon icon="mdi:tune" />
            其他设置
          </h2>
        </div>

        <div class="other-settings">
          <div class="setting-item">
            <div class="setting-label">
              <Icon icon="mdi:bell" />
              <span>消息通知</span>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="notificationEnabled" />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">
              <Icon icon="mdi:theme-light-dark" />
              <span>深色模式</span>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="darkMode" />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">
              <Icon icon="mdi:cached" />
              <span>清除缓存</span>
            </div>
            <div class="setting-control">
              <button class="clear-cache-btn" @click="clearCache">
                <Icon icon="mdi:delete-sweep" />
                清除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑地址弹窗 -->
    <div v-if="showAddAddress || editingAddress" class="address-modal" @click="closeAddressModal">
      <div class="address-form" @click.stop>
        <div class="modal-header">
          <h3>{{ editingAddress ? '编辑地址' : '添加地址' }}</h3>
          <button class="close-btn" @click="closeAddressModal">
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>收货人</label>
              <input v-model="addressForm.recipient" placeholder="请输入收货人姓名" />
            </div>
            <div class="form-group">
              <label>手机号</label>
              <input v-model="addressForm.phone" placeholder="请输入手机号" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>省份</label>
              <select v-model="addressForm.province">
                <option value="">请选择省份</option>
                <option value="北京市">北京市</option>
                <option value="上海市">上海市</option>
                <option value="广东省">广东省</option>
                <option value="浙江省">浙江省</option>
              </select>
            </div>
            <div class="form-group">
              <label>城市</label>
              <select v-model="addressForm.city">
                <option value="">请选择城市</option>
                <option value="北京市">北京市</option>
                <option value="上海市">上海市</option>
                <option value="广州市">广州市</option>
                <option value="杭州市">杭州市</option>
              </select>
            </div>
            <div class="form-group">
              <label>区县</label>
              <select v-model="addressForm.district">
                <option value="">请选择区县</option>
                <option value="朝阳区">朝阳区</option>
                <option value="海淀区">海淀区</option>
                <option value="黄浦区">黄浦区</option>
                <option value="天河区">天河区</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>详细地址</label>
            <textarea v-model="addressForm.detail" placeholder="请输入详细地址"></textarea>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="addressForm.isDefault" />
              <span>设为默认地址</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="closeAddressModal">取消</button>
          <button class="save-btn" @click="saveAddress">保存</button>
        </div>
      </div>
    </div>

    <!-- 头像选择弹窗 -->
    <div v-if="showAvatarModal" class="avatar-modal" @click="showAvatarModal = false">
      <div class="avatar-selector" @click.stop>
        <div class="modal-header">
          <h3>选择头像</h3>
          <button class="close-btn" @click="showAvatarModal = false">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <div class="avatar-grid">
          <div
            v-for="avatar in avatarOptions"
            :key="avatar"
            class="avatar-option"
            :class="{ active: avatar === selectedAvatar }"
            @click="selectAvatar(avatar)"
          >
            <img :src="avatar" :alt="'头像选项'" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="showAvatarModal = false">取消</button>
          <button class="save-btn" @click="saveAvatar">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const toast = useToast()

// 响应式数据
const editingNickname = ref(false)
const newNickname = ref('')
const nicknameInput = ref(null)
const showAddAddress = ref(false)
const editingAddress = ref(null)
const showAvatarModal = ref(false)
const selectedAvatar = ref('')
const notificationEnabled = ref(true)
const darkMode = ref(false)

// 计算属性
const userProfile = computed(() => store.state.user.profile)

// 地址表单
const addressForm = ref({
  recipient: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

// 地址列表（从store获取）
const addresses = computed(() => store.getters['addresses/allAddresses'])

// 头像选项
const avatarOptions = ref([
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=6'
])

// 方法
const goBack = () => {
  router.go(-1)
}

const editNickname = async () => {
  editingNickname.value = true
  newNickname.value = userProfile.value.name
  await nextTick()
  nicknameInput.value?.focus()
}

const saveNickname = () => {
  if (newNickname.value.trim() && newNickname.value !== userProfile.value.name) {
    store.dispatch('user/updateProfile', { name: newNickname.value.trim() })
    toast.success('昵称修改成功')
  }
  editingNickname.value = false
}

const changeAvatar = () => {
  selectedAvatar.value = userProfile.value.avatar
  showAvatarModal.value = true
}

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar
}

const saveAvatar = () => {
  store.dispatch('user/updateProfile', { avatar: selectedAvatar.value })
  showAvatarModal.value = false
  toast.success('头像修改成功')
}

const closeAddressModal = () => {
  showAddAddress.value = false
  editingAddress.value = null
  resetAddressForm()
}

const resetAddressForm = () => {
  addressForm.value = {
    recipient: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  }
}

const editAddress = (address) => {
  editingAddress.value = address
  addressForm.value = { ...address }
}

const saveAddress = () => {
  if (!addressForm.value.recipient || !addressForm.value.phone || !addressForm.value.detail) {
    toast.warning('请填写完整的地址信息')
    return
  }

  if (editingAddress.value) {
    // 编辑地址
    store.dispatch('addresses/updateAddress', addressForm.value)
    toast.success('地址修改成功')
  } else {
    // 添加新地址
    store.dispatch('addresses/addAddress', addressForm.value)
    toast.success('地址添加成功')
  }

  closeAddressModal()
}

const deleteAddress = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个地址吗？',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    store.dispatch('addresses/removeAddress', id)
    toast.success('地址删除成功')
  } catch {
    // 取消操作
  }
}

const setDefaultAddress = (id) => {
  store.dispatch('addresses/setDefaultAddress', id)
  toast.success('默认地址设置成功')
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清除缓存吗？这将清除所有本地数据。',
      '清除缓存',
      {
        confirmButtonText: '确定清除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    localStorage.clear()
    toast.success('缓存清除成功')
  } catch {
    // 取消操作
  }
}
</script>

<style scoped>
.settings-container {
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
.settings-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.title-icon {
  font-size: 40px;
  color: var(--primary-color);
}

/* 设置区块 */
.settings-section {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.add-address-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--primary-gradient);
  color: var(--text-inverse);
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.add-address-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 个人信息设置 */
.profile-settings {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.avatar-setting {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  border: 4px solid var(--border-light);
  transition: all var(--transition-normal);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-info h3 {
  margin: 0 0 var(--space-xs) 0;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.avatar-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* 设置项 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--border-light);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.setting-control {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.nickname-input {
  padding: var(--space-sm) var(--space-md);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-normal);
}

.nickname-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.nickname-display {
  cursor: pointer;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-normal);
}

.nickname-display:hover {
  background: var(--bg-tertiary);
}

.edit-btn {
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  color: var(--text-secondary);
}

.edit-btn:hover {
  background: var(--primary-color);
  color: var(--text-inverse);
}

.email-display {
  color: var(--text-secondary);
}

.verified-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--success-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-medium);
  transition: var(--transition-normal);
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: var(--transition-normal);
  border-radius: 50%;
}

input:checked + .slider {
  background: var(--primary-gradient);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.clear-cache-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--error-gradient);
  color: var(--text-inverse);
  border: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.clear-cache-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 地址列表 */
.address-list {
  padding: var(--space-xl);
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-lg);
  transition: all var(--transition-normal);
  position: relative;
}

.address-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.address-item.is-default {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  background-size: 200% 200%;
  background-position: 100% 100%;
  opacity: 0.05;
}

.address-item.is-default::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0.05;
  border-radius: var(--radius-xl);
}

.address-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-sm);
}

.recipient {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.phone {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

.default-badge {
  background: var(--primary-gradient);
  color: var(--text-inverse);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.address-detail {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

.address-actions {
  display: flex;
  gap: var(--space-sm);
  position: relative;
  z-index: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  font-size: 16px;
}

.action-btn.edit {
  background: var(--warning-gradient);
  color: var(--text-inverse);
}

.action-btn.delete {
  background: var(--error-gradient);
  color: var(--text-inverse);
}

.action-btn.default {
  background: var(--success-gradient);
  color: var(--text-inverse);
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.empty-addresses {
  text-align: center;
  padding: var(--space-6xl);
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: var(--space-xl);
  color: var(--text-muted);
}

.add-first-address-btn {
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
  margin-top: var(--space-xl);
}

.add-first-address-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 其他设置 */
.other-settings {
  padding: var(--space-xl);
}

/* 弹窗样式 */
.address-modal, .avatar-modal {
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

.address-form, .avatar-selector {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-2xl);
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.form-row:has(.form-group:only-child) {
  grid-template-columns: 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group label {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: var(--space-md);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-normal);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.modal-footer {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-xl);
  border-top: 1px solid var(--border-light);
}

.cancel-btn, .save-btn {
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

.save-btn {
  background: var(--primary-gradient);
  color: var(--text-inverse);
}

.cancel-btn:hover, .save-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 头像选择器 */
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  padding: var(--space-xl);
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all var(--transition-normal);
}

.avatar-option:hover {
  transform: scale(1.1);
  border-color: var(--primary-color);
}

.avatar-option.active {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-lg);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-container {
    padding: var(--space-md);
  }

  .avatar-setting {
    flex-direction: column;
    text-align: center;
  }

  .setting-item {
    flex-direction: column;
    gap: var(--space-md);
    align-items: flex-start;
  }

  .address-item {
    flex-direction: column;
    gap: var(--space-lg);
    align-items: flex-start;
  }

  .address-actions {
    align-self: flex-end;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .avatar-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }

  .section-header {
    flex-direction: column;
    gap: var(--space-lg);
    text-align: center;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>
