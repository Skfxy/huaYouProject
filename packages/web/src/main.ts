import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
  requestAnimationFrame(() => {
    const loadingEl = document.getElementById("app-loading");
    if (loadingEl) {
      loadingEl.classList.add("fade-out");
      setTimeout(() => {
        loadingEl.remove();
      }, 500);
    }
  });
});
