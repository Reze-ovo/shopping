import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import 'animate.css'
import router from './router'
import store from './store'
import '@/assets/styles/global.css'
import ElementPlus from 'element-plus'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import VueLazyload from 'vue3-lazyload'
import { MotionPlugin } from '@vueuse/motion'

const app = createApp(App)

// Toast配置
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

// 懒加载配置
const lazyloadOptions = {
  preLoad: 1.3,
  error: '/placeholder-error.png',
  loading: '/placeholder-loading.png',
  attempt: 1
}

app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(Toast, toastOptions)
app.use(VueLazyload, lazyloadOptions)
app.use(MotionPlugin)
app.mount('#app')
