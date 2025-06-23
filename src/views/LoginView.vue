<!-- src/views/LoginView.vue -->
<template>
  <div class="auth-container">
    <h2>登录</h2>
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
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <span class="switch-link" @click="goRegister">没有账号？去注册</span>
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
// 简单非空校验
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
    // 调用 Vuex 登录 action
    store.dispatch('user/login', {
      email: form.value.email,
      password: form.value.password
    })
    ElMessage.success('登录成功')
    router.push({ name: 'profile' })
  })
}

function goRegister () {
  router.push({ name: 'register' })
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
