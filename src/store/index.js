import { createStore } from 'vuex'
import { progressionService } from '../services/progressionService'

// Local storage utilities
const storage = {
  getItem(key, defaultValue) {
    try {
      const value = localStorage.getItem(key)
      return value || defaultValue
    } catch (err) {
      console.error(`Error loading ${key}:`, err)
      return defaultValue
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (err) {
      console.error(`Error saving ${key}:`, err)
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (err) {
      console.error(`Error removing ${key}:`, err)
    }
  }
}

// Region module
const regionModule = {
  namespaced: true,
  state: {
    regions: [],
    currentRegionId: storage.getItem('selected-region', 'west-limgrave'),
    currentStepId: 1
  },
  getters: {
    currentRegion: state => state.regions.find(region => region.id === state.currentRegionId),
    currentStep: state => {
      const region = state.regions.find(region => region.id === state.currentRegionId)
      return region ? region.steps.find(step => step.id === state.currentStepId) : null
    },
    nextStep: state => {
      const region = state.regions.find(region => region.id === state.currentRegionId)
      if (!region) return null
      const currentIndex = region.steps.findIndex(step => step.id === state.currentStepId)
      return region.steps.slice(currentIndex + 1).find(step => !step.completed) || null
    },
    nextRegion: state => {
      const currentIndex = state.regions.findIndex(region => region.id === state.currentRegionId)
      return currentIndex === -1 || currentIndex === state.regions.length - 1 ? null : state.regions[currentIndex + 1]
    },
    previousRegion: state => {
      const currentIndex = state.regions.findIndex(region => region.id === state.currentRegionId)
      return currentIndex <= 0 ? null : state.regions[currentIndex - 1]
    },
    progress: state => {
      const region = state.regions.find(region => region.id === state.currentRegionId)
      if (!region) return 0
      const completedSteps = region.steps.filter(step => step.completed).length
      return (completedSteps / region.steps.length) * 100
    }
  },
  mutations: {
    setRegions(state, regions) {
      state.regions = regions
    },
    setCurrentStepId(state, stepId) {
      state.currentStepId = stepId
    },
    setCurrentRegionId(state, regionId) {
      state.currentRegionId = regionId
      storage.setItem('selected-region', regionId)
    },
    completeStep(state, { regionId, stepId }) {
      const region = state.regions.find(r => r.id === regionId)
      if (region) {
        const step = region.steps.find(s => s.id === stepId)
        if (step) {
          step.completed = true
          const completedSteps = JSON.parse(storage.getItem('completed_steps_by_region', '[]'))
          const stepKey = `${regionId}-${stepId}`
          if (!completedSteps.includes(stepKey)) {
            completedSteps.push(stepKey)
            storage.setItem('completed_steps_by_region', JSON.stringify(completedSteps))
          }
        }
      }
    },
    resetProgress(state) {
      state.regions.forEach(region => {
        region.steps.forEach(step => {
          step.completed = false
        })
      })
      state.currentStepId = 1
      storage.setItem('completed_steps_by_region', '[]')
    }
  },
  actions: {
    async loadRegions({ commit }) {
      const regions = await progressionService.getRegions()
      commit('setRegions', regions)
    },
    completeStep({ commit, state }, stepId) {
      commit('completeStep', { regionId: state.currentRegionId, stepId })
    },
    resetProgress({ commit }) {
      commit('resetProgress')
    },
    clearStorage({ commit }) {
      storage.removeItem('selected-region')
      storage.removeItem('completed_steps_by_region')
      commit('resetProgress')
    },
    switchToNextRegion({ commit, getters }) {
      const nextRegion = getters.nextRegion
      if (nextRegion) {
        commit('setCurrentRegionId', nextRegion.id)
      }
    },
    switchToPreviousRegion({ commit, getters }) {
      const previousRegion = getters.previousRegion
      if (previousRegion) {
        commit('setCurrentRegionId', previousRegion.id)
      }
    }
  }
}

export default createStore({
  modules: {
    region: regionModule
  }
})