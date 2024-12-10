import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import { useI18n } from './i18n'

// Initialize i18n
const { initializeLanguage } = useI18n()
initializeLanguage()

const app = createApp(App)
app.use(router)
app.mount('#app')
