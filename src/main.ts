import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)
  .use(router)
  .use(i18n)

// Handle SPA redirect from 404.html
const redirect = sessionStorage.redirect
if (redirect) {
  delete sessionStorage.redirect
  router.replace(redirect)
}

app.mount('#app')
