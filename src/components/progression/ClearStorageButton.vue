<template>
  <button @click="$emit('clear')" class="clear-storage-button" title="Clear All Data">
    🗑️
  </button>
</template>

<script>
export default {
  name: 'ClearStorageButton',
  emits: ['clear']
}
</script>

<style scoped>
.clear-storage-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.clear-storage-button:hover {
  background-color: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.clear-storage-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>