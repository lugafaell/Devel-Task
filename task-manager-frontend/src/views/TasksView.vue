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
        <li>All tasks</li>
        <li>Today's tasks</li>
        <li>Important tasks</li>
        <li>Completed tasks</li>
        <li>Uncompleted tasks</li>
      </ul>

      <div class="user-info">
        <p>Welcome, {{ username }}</p>
        <button class="logout-button" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>

    <div class="task-list">
      <header class="header">
        <input class="search-bar" type="search" placeholder="Search task" />
        <h2 class="all-tasks-title">All tasks ({{ tasks.length }} tasks)</h2>
      </header>
      <div class="tasks">
        <TaskCard
          v-for="(task, index) in tasks"
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
    };
  },
  methods: {
    async fetchTasks() {
      this.username = Cookies.get("user");
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
      await axios.put(`http://localhost:3000/tasks/${updatedTask.id}`, updatedTask);
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
  },
  created() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
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

.user-info p {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
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
  margin: 20px 0;
  cursor: pointer;
}

.menu-list li:hover {
  color: #a35eff;
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
