import "nprogress/nprogress.css";
import "v3-infinite-loading/lib/style.css";
import "./assets/css/base.css";
import "./assets/css/style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
 
app.mount("#app");
