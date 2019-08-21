import Vue from 'vue'
import App from './App.vue'

import { default as VueTinymce } from '@packy-tang/vue-tinymce';

Vue.use(VueTinymce)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
