<template>
  <div class="custom-modal-backdrop" v-if="showModal">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ modalHeader }}</h2>
      </header>

      <section class="modal-body">
        <p>{{ modalMessage }}</p>
      </section>

      <footer class="modal-footer">
        <b-button @click="closeModal">Close</b-button>
      </footer>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/eventBus";

export default {
  data() {
    return {
      showModal: false,
      modalHeader: "",
      modalMessage: "",
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
  },
  created() {
    EventBus.$on("show-modal", (data) => {
      this.showModal = true;

      console.log(data.title);
      console.log(data.message);
      this.modalHeader = data.title;
      this.modalMessage = data.message;
    });
  },
};
</script>

<style>
.custom-modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 12000;
}

.modal-content {
  background-color: rgba(255, 255, 255, 1);
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  opacity: 1;
  z-index: 12001;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
}
</style>
