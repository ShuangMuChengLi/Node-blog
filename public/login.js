// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './css/base.less';
import Login from './components/login.vue'

Vue.use(Element)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: {Login},
    template: '<Login/>',

})
