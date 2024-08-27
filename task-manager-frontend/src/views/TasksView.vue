<template>
  <div class="tasks-view">
    <aside class="sidebar">
      <div class="site-title">
        <img
          src="@/assets/logo_devel_task.png"
          alt="Devel Task Logo"
          class="site-logo"
        />
      </div>

      <button class="add-task-button" @click="showModal = true">
        <i class="fas fa-add"></i> Add new task
      </button>

      <ul class="menu-list">
        <li @click="setFilter('all')">All tasks</li>
        <li @click="setFilter('completed')">Completed tasks</li>
        <li @click="setFilter('uncompleted')">Uncompleted tasks</li>

        <h3 @click="toggleDirectories" class="directory-header">
          Directories
          <i
            :class="{
              'fas fa-chevron-down': showDirectories,
              'fas fa-chevron-right': !showDirectories,
            }"
          ></i>
        </h3>
        <ul v-if="showDirectories" class="directory-list">
          <li v-for="directory in directories" :key="directory.id">
            {{ directory.name }}
          </li>
        </ul>
      </ul>

      <div class="user-info">
        <div class="user-avatar">
          <div class="avatar">{{ userInitials }}</div>
          <p>Welcome, {{ username }}</p>
        </div>
        <button class="logout-button" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>

    <div class="task-list">
      <header class="header">
        <input class="search-bar" type="search" placeholder="Search task" />
        <h2 class="all-tasks-title">
          {{
            filterType === "all"
              ? "All tasks"
              : filterType === "completed"
              ? "Completed tasks"
              : "Uncompleted tasks"
          }}
          ({{ filteredTasks().length }} tasks)
        </h2>
      </header>
      <div class="tasks">
        <TaskCard
          v-for="(task, index) in filteredTasks()"
          :key="task.id"
          :id="task.id"
          :title="task.title"
          :description="task.description"
          :date="task.date"
          :completed="task.completed"
          :index="index"
          @delete-task="removeTask"
          @click="openUpdateTaskModal(task)"
        />
      </div>
    </div>

    <AddTaskModal
      :isVisible="showModal"
      @close="showModal = false"
      @add-task="addTask"
    />

    <UpdateTaskModal
      :isVisible="showUpdateModal"
      :task="selectedTask"
      @close="closeUpdateTaskModal"
      @update-task="updateTask"
    />
  </div>
</template>

<script>
import TaskCard from "../components/Task Card/TaskCard.vue";
import AddTaskModal from "../components/addTaskModal/AddTaskModal.vue";
import UpdateTaskModal from "../components/updateTaskModal/UpdateTaskModal.vue";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  components: {
    TaskCard,
    AddTaskModal,
    UpdateTaskModal,
  },
  data() {
    return {
      tasks: [],
      showModal: false,
      showUpdateModal: false,
      selectedTask: null,
      username: "",
      userInitials: "",
      filterType: "all",
      showDirectories: false,
      directories: [
        { id: 1, name: "Diretório 1" },
        { id: 2, name: "Diretório 2" },
        { id: 3, name: "Diretório 3" },
      ],
    };
  },
  methods: {
    getUserInitials(name) {
      const names = name.split(" ");
      if (names.length === 1) return names[0][0].toUpperCase();
      return (
        names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
      );
    },
    getFirstName(name) {
      return name.split(" ")[0];
    },
    async fetchTasks() {
      this.username = Cookies.get("user");
      this.userInitials = this.getUserInitials(this.username);
      this.username = this.getFirstName(this.username); // Atualiza para mostrar apenas o primeiro nome
      const response = await axios.get(
        `http://localhost:3000/tasks/${this.username}`
      );
      this.tasks = response.data;
    },
    async addTask(newTask) {
      await axios.post("http://localhost:3000/tasks/create", newTask);
      this.fetchTasks();
    },
    async removeTask(taskId) {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    },
    async updateTask(updatedTask) {
      await axios.put(
        `http://localhost:3000/tasks/${updatedTask.id}`,
        updatedTask
      );
      this.fetchTasks();
      this.closeUpdateTaskModal();
    },
    openUpdateTaskModal(task) {
      if (task) {
        this.selectedTask = task;
        this.showUpdateModal = true;
      } else {
        console.error("Task is null or undefined:", task);
      }
    },
    closeUpdateTaskModal() {
      this.selectedTask = null;
      this.showUpdateModal = false;
    },
    logout() {
      Cookies.remove("user");
      this.$router.push("/");
    },
    setFilter(type) {
      this.filterType = type;
    },
    filteredTasks() {
      if (this.filterType === "completed") {
        return this.tasks.filter((task) => task.completed === true);
      } else if (this.filterType === "uncompleted") {
        return this.tasks.filter((task) => task.completed === false);
      } else {
        return this.tasks; // Retorna todas as tasks
      }
    },
    toggleDirectories() {
      this.showDirectories = !this.showDirectories;
    },
  },
  created() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
.directories-section {
  margin-top: 20px;
}

.directory-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.directory-list {
  list-style-type: none;
  padding: 0;
}

.directory-list li {
  margin: 5px 0;
  cursor: pointer;
}

.directory-list li:hover {
  color: #a35eff;
}

.tasks-view {
  display: flex;
  height: 100vh;
  background-color: #f4f4f9;
  color: #4a4a4a;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 15%;
  min-width: 200px;
  background-color: #fbfcf8;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.user-avatar {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #a35eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.user-info p {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
}

.logout-button {
  padding: 8px 12px;
  background-color: transparent;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-button i {
  margin-left: 8px;
}

.logout-button:hover {
  color: #a35eff;
}

.task-list {
  width: 100%;
  padding: 20px;
  height: calc(100vh - 40px);
  overflow-y: auto;
}

.info-panel {
  width: 25%;
  background-color: #fbfcf8;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.site-title {
  margin-bottom: 20px;
  text-align: center;
  flex-shrink: 0;
}

.site-logo {
  max-width: 100%;
  height: auto;
  margin-right: 10px;
}

.site-title h1 {
  font-size: 24px;
  color: #333;
}

.add-task-button {
  display: block;
  width: 100%;
  padding: 10px;
  background: linear-gradient(to right, #7a2290, #0360ca);
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;
  cursor: pointer;
}

.menu-list {
  list-style-type: none;
  padding: 0;
  flex-grow: 1;
  margin-bottom: auto;
  margin-top: auto;
}

.menu-list li {
  margin: 0;
  cursor: pointer;
  text-align: left;
  padding: 10px 15px;
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
  width: calc(100% + 5px);
  left: -15px;
}

.menu-list li:hover {
  background-color: #f3e7f7;
  color: #a35eff;
}

.menu-list li:hover::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 4px;
  background-color: #a35eff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  width: 40%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.tasks {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.task-card {
  background-color: #fbfcf8;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: calc(25% - 20px);
  position: relative;
}

.task-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff7b89;
  color: white;
  padding: 5px;
  border-radius: 3px;
  font-size: 12px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.task-date {
  font-size: 12px;
}

.task-status {
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
}

.task-status.completed {
  background-color: #00d68f;
  color: white;
}

.task-status.uncompleted {
  background-color: #ffda44;
  color: white;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.task-actions i {
  cursor: pointer;
}

.info-panel p {
  margin-bottom: 10px;
}

.darkmode-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.delete-all-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
