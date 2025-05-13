import { createStore } from 'vuex'
import regionsData from '@/data/regions.json'
import { progressionService } from '../services/progressionService'

// Load saved region from localStorage
const loadSavedRegion = () => {
   // eslint-disable-next-line no-debugger
  //  debugger

  try {
    const savedRegionId = localStorage.getItem('selected-region')
    return savedRegionId || 'west-limgrave'
  } catch (err) {
    console.error('Error loading saved region:', err)
    return 'west-limgrave'
  }
}

// Load completed steps from localStorage
const loadCompletedSteps = () => {
  try {
    const savedSteps = localStorage.getItem('completed_steps_by_region')
    if (!savedSteps) return []
    const parsed = JSON.parse(savedSteps)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Error loading completed steps:', err)
    return []
  }
}

// Save completed steps to localStorage
const saveCompletedSteps = (completedSteps) => {
  try {
    localStorage.setItem('completed_steps_by_region', JSON.stringify(completedSteps))
  } catch (err) {
    console.error('Error saving completed steps:', err)
  }
}

// Generate step key for localStorage
const generateStepKey = (regionId, stepId) => {
  return `${regionId}-${stepId}`
}

// Check if a step is completed
const isStepCompleted = (regionId, stepId) => {

  return loadCompletedSteps().includes(generateStepKey(regionId, stepId))
}

// Initialize regions with completed steps
const initializeRegions = () => {

  return regionsData.regions.map(region => ({
    ...region,
    steps: region.steps.map(step => ({
      ...step,
      completed: isStepCompleted(region.id, step.id)
    }))
  }))
}

export default createStore({
  state: {
    regions: initializeRegions(),
    currentRegionId: loadSavedRegion(),
    currentStepId: 1
  },
  getters: {
    currentRegion: state => {
      // eslint-disable-next-line no-debugger
      // debugger
      return state.regions.find(region => region.id === state.currentRegionId)
    },
    currentStep: state => {
      const region = state.regions.find(region => region.id === state.currentRegionId)
      return region ? region.steps.find(step => step.id === state.currentStepId) : null
    },
    nextStep: state => {
      const region = state.regions.find(region => region.id === state.currentRegionId)
      if (!region) return null
      const currentIndex = region.steps.findIndex(step => step.id === state.currentStepId)
      // Find the next incomplete step
      const nextIncompleteStep = region.steps.slice(currentIndex + 1).find(step => !step.completed)
      return nextIncompleteStep || null
    },
    nextRegion: state => {
      const currentIndex = state.regions.findIndex(region => region.id === state.currentRegionId)
      if (currentIndex === -1 || currentIndex === state.regions.length - 1) return null
      return state.regions[currentIndex + 1]
    },
    previousRegion: state => {
      const currentIndex = state.regions.findIndex(region => region.id === state.currentRegionId)
      if (currentIndex <= 0) return null
      return state.regions[currentIndex - 1]
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
      // Save selected region to localStorage
      try {
        localStorage.setItem('selected-region', regionId)
      } catch (err) {
        console.error('Error saving selected region:', err)
      }
      // Reset current step to first incomplete step of new region
      const region = state.regions.find(r => r.id === regionId)
      if (region) {
        const firstIncompleteStep = region.steps.find(step => !step.completed)
        if (firstIncompleteStep) {
          state.currentStepId = firstIncompleteStep.id
        } else {
          state.currentStepId = region.steps[0].id
        }
      }
    },
    completeStep(state, stepId) {
      const region = state.regions.find(region => region.id === state.currentRegionId)
      if (region) {
        const step = region.steps.find(step => step.id === stepId)
        if (step) {
          step.completed = true
          // Save completed step to localStorage
          const completedSteps = loadCompletedSteps()
          const stepKey = generateStepKey(region.id, stepId)
          if (!completedSteps.includes(stepKey)) {
            completedSteps.push(stepKey)
            saveCompletedSteps(completedSteps)
          }
          // Find the next incomplete step
          const currentIndex = region.steps.findIndex(s => s.id === stepId)
          const nextIncompleteStep = region.steps.slice(currentIndex + 1).find(s => !s.completed)
          if (nextIncompleteStep) {
            state.currentStepId = nextIncompleteStep.id
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
      // Clear completed steps from localStorage
      saveCompletedSteps([])
    }
  },
  actions: {
    completeStep({ commit }, stepId) {
      commit('completeStep', stepId)
    },
    resetProgress({ commit }) {
      commit('resetProgress')
    },
    clearStorage({ commit }) {
      try {
        localStorage.removeItem('selected-region')
        localStorage.removeItem('completed_steps_by_region')
      } catch (err) {
        console.error('Error clearing storage:', err)
      }
      commit('resetProgress')
    },
    loadRegions({ commit }) {
      const regions = progressionService.getRegions()
      commit('setRegions', regions)
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
})