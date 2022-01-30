import { createApp, VueElement } from 'vue'
import App from './App.vue'
import router from './router'

import $ from "jquery"

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap/dist/js/bootstrap.min.js"


createApp(App).use(router).mount('#app')
