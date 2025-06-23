<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-container">
    <h2>注册</h2>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="0">
      <el-form-item prop="email">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱"
          clearable
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册</el-button>
        <span class="switch-link" @click="goLogin">已有账号？去登录</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useStore()
const formRef = ref(null)
const form = ref({
  email: '',
  password: ''
})
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

function onSubmit () {
  formRef.value.validate(valid => {
    if (!valid) return
    // 调用 Vuex 注册 action
    store.dispatch('user/register', {
      email: form.value.email,
      password: form.value.password
    })
    ElMessage.success('注册成功')
    router.push({ name: 'profile' })
  })
}

function goLogin () {
  router.push({ name: 'login' })
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.switch-link {
  margin-left: 12px;
  color: #409eff;
  cursor: pointer;
}
</style>
