import { createApp } from 'vue'
import App from './App.vue'

import { inject } from '@vercel/analytics';
inject();

import './assets/main.css'

createApp(App).mount('#app')
