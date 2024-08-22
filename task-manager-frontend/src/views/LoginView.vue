<template>
  <div class="login-container">
    <div class="login-left">
      <img src="@/assets/logo_devel_task.png" alt="Login Illustration" />
      <h2>Sign in</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input type="text" placeholder="Username" v-model="username" />
        </div>
        <div class="input-group">
          <input type="password" placeholder="Password" v-model="password" />
        </div>
        <button type="submit" class="btn-signin">SIGN IN</button>
        <a href="#" class="forgot-password">Forgot your password?</a>
      </form>
    </div>
    <div class="login-right">
      <h1 class="typing-animation">{{ typingText }}</h1>
      <p>Your collaboration and organization tasks app</p>
    </div>
    <CustomAlert
      v-if="showAlert"
      :message="alertMessage"
      :type="alertType"
      @close="showAlert = false"
    />
  </div>
</template>

<script>
import axios from "axios";
import CustomAlert from "../components/alert/CustomAlert.vue";
import Cookies from "js-cookie";

export default {
  name: "LoginView",
  components: {
    CustomAlert,
  },
  mounted() {
    this.checkLogin();
    this.typeWriter();
  },
  data() {
    return {
      username: "",
      password: "",
      typingText: "",
      fullText: "Welcome to Devel Task!",
      currentIndex: 0,
      showAlert: false,
      alertMessage: "",
      alertType: "success",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:3000/users/login", {
          username: this.username,
          password: this.password,
        });

        if (response.data.message === "Login successful") {
          Cookies.set("user", this.username, { expires: 7 });

          this.showAlert = true;
          this.alertMessage = "Login successful";
          this.alertType = "success";
          setTimeout(() => {
            this.$router.push("/tasks");
          }, 1500);
        } else {
          this.showAlert = true;
          this.alertMessage = "Credenciais inválidas. Tente novamente.";
          this.alertType = "error";
        }
      } catch (error) {
        console.error("Erro durante o login:", error);
        this.showAlert = true;
        this.alertMessage =
          "Ocorreu um Erro durante o Login. Tente Novamente mais tarde";
        this.alertType = "error";
      }
    },
    typeWriter() {
      if (this.currentIndex < this.fullText.length) {
        this.typingText += this.fullText.charAt(this.currentIndex);
        this.currentIndex++;
        setTimeout(this.typeWriter, 100);
      }
    },
    checkLogin() {
      const user = Cookies.get("user");
      if (user) {
        this.$router.push("/tasks");
      }
    },
  },
};
</script>

<style scoped>
body {
  display: block;
  margin: 0;
}

.login-container {
  display: flex;
  height: 100vh;
}

.login-left,
.login-right {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-left {
  background-color: #fff9e3;
  padding: 20px;
}

.login-left img {
  width: 200px;
  margin-bottom: 20px;
}

.login-left h2 {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
  width: 100%;
  border: none;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1.5px solid #ababab;
  box-sizing: border-box;
  background-color: #fff9e3;
}

.btn-signin {
  width: 100%;
  padding: 10px;
  background: linear-gradient(to right, #7a2290, #0360ca);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 40px;
  margin-bottom: 20px;
}

.btn-signin:hover {
  background: linear-gradient(to right, #5712a1, #164597);
}

.forgot-password {
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-right {
  background: linear-gradient(to right, #7a2290, #0360ca);
  color: #ffffff;
  text-align: center;
  padding: 20px;
}

.login-right h1 {
  margin-bottom: 20px;
}

.login-right p {
  margin-bottom: 30px;
}

.btn-signup {
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-signup:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.typing-animation {
  border-right: 2px solid #fff; /* Cursor simulando uma digitação */
  white-space: nowrap;
  overflow: hidden;
}
</style>
