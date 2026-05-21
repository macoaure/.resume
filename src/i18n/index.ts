import { createI18n } from 'vue-i18n'
import ptBr from '../locales/pt_BR.json'
import enUs from '../locales/en_US.json'

export default createI18n({
  legacy: false,
  locale: 'pt-br',
  fallbackLocale: 'pt-br',
  messages: {
    'pt-br': ptBr,
    'en-us': enUs
  }
})
