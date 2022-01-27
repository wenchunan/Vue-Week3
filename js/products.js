import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

let productModal = "";
let delProductModal = "";
const app = createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/",
      apiPath: "annawen",
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    // get產品資料
    getData() {
      const url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/products/all`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 驗證
    checkAdmin() {
      const url = `${this.apiUrl}/v2/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          console.dir(err);
          window.location = "index.html";
        });
    },
    // 透過參數 isState，來判斷是新增還是編輯還是刪除狀態
    openModal(isState, item) {
      if (isState === "new") {
        // 清空物件的動作
        this.tempProduct = {
          imageUrl: [],
        };
        // 改變isNew data的狀態(原本data內的isNew，從false改成true狀態，所以新增為true，編輯為false)
        this.isNew = true;
        productModal.show();
      } else if (isState === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isState === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    // 新增編輯共用同一個 axios 請求，透過 data 的 isNew 來判斷是新增還是編輯狀態
    updateProduct() {
      let url = `${this.apiUrl}v2/api/${this.apiPath}/admin/product`;
      let http = "post";
      // 根據 isNew 來判斷要串接 post 或是 put API
      if (!this.isNew) {
        url = `${this.apiUrl}v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }
      // 因 post 和 put 需要帶的參數相同，成功後的行為也相同（整體函式架構長一樣），所以可以寫在一起
      axios[http](url, { data: this.tempProduct }) // 注意api資料的格式
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        })
        .catch((err) => alert(err.data.message));
    },
    // 刪除指定資料
    delProduct() {
      const url = `${this.apiUrl}v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
        })
        .catch((err) => {
          console.dir(err);
        });
    },
    // 多圖新增
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    //使用 new 建立 bootstrap Modal，拿到實體 DOM 並賦予到變數上
    //新增與編輯共用productModal
    productModal = new bootstrap.Modal(document.querySelector("#productModal"));
    //刪除使用delProductModal
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal")
    );

    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)annaToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    //token存到Authorization
    //在每一次打API時，會預設帶入token
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
  },
});
app.mount("#app");
