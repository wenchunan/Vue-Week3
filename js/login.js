import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

const app = createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/",
      apiPath: "annawen",
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      const url = `${this.apiUrl}v2/admin/signin`;
      axios
        .post(url, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `annaToken=${token}; expires=${new Date(
            expired
          )}; `;
          alert(res.data.message);
          window.location = "products.html";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
});
app.mount("#app");
