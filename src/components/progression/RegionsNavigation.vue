<template>
  <div class="regions-navigation">
    <button
      v-for="region in regions"
      :key="region.id"
      @click="$emit('select-region', region.id)"
      class="region-btn"
      :class="{ active: region.id === currentRegionId }"
    >
      <span class="region-name">{{ region.name }}</span>
      <span class="region-progress">{{ Math.round(getRegionProgress(region.id)) }}%</span>
    </button>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'RegionsNavigation',
  props: {
    regions: {
      type: Array,
      required: true
    },
    currentRegionId: {
      type: String,
      required: true
    }
  },
  emits: ['select-region'],
  setup() {
    const store = useStore()
    return {
      getRegionProgress: (regionId) => store.getters['region/regionProgress'](regionId)
    }
  }
}
</script>

<style scoped>
.regions-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.region-btn {
  background-color: #fff;
  border: 2px solid #4CAF50;
  color: #4CAF50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.region-btn:hover {
  background-color: #4CAF50;
  color: white;
}

.region-btn.active {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
}

.region-name {
  font-weight: 500;
}

.region-progress {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-left: 0.25rem;
}
</style>