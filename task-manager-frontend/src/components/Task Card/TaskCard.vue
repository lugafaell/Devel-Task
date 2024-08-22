<template>
  <div
    class="task-card animate__animated"
    :class="{
      animate__fadeInUp: !isBeingRemoved,
      animate__fadeOutDown: isBeingRemoved,
    }"
    :style="{ animationDelay: !isBeingRemoved ? `${index * 0.2}s` : '0s' }"
  >
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="task-header">
      <i class="fas fa-calendar-alt"></i>
      <span class="task-date">{{ date }}</span>
    </div>
    <hr class="dashed-line" />
    <div class="task-footer">
      <span :class="['task-status', statusClass]">{{ statusText }}</span>
      <div class="task-actions">
        <i class="fas fa-trash" @click="handleDeleteTask"></i>
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";

export default {
  props: {
    id: Number,
    title: String,
    description: String,
    date: String,
    completed: Boolean,
    tag: String,
    index: Number,
  },
  data() {
    return {
      isBeingRemoved: false,
    };
  },
  computed: {
    statusClass() {
      return this.completed ? "completed" : "uncompleted";
    },
    statusText() {
      return this.completed ? "completed" : "uncompleted";
    },
  },
  methods: {
    handleDeleteTask() {
      this.isBeingRemoved = true;
      setTimeout(() => {
        this.$emit("delete-task", this.id);
      }, 500);
    },
  },
};
</script>

<style scoped>
h3 {
  text-align: left;
}

p {
  text-align: left;
}

.task-card {
  background-color: #fbfcf8;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  width: 30%;
  position: relative;
}

.task-card:hover {
  background-color: #a35eff;
  color: white;

  .task-date {
    color: white;
  }

  .fas,
  .fa-solid {
    color: white;
  }
}

.task-header {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #7e7e7e;
  margin-bottom: 10px;
  margin-top: 80px;
}

.task-header i {
  margin-right: 5px;
}

.dashed-line {
  border: none;
  border-top: 1px dashed #d3d3d3;
  margin: 10px 0;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.task-date {
  font-size: 14px;
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
  color: #7e7e7e;
}
</style>
