import { createStore } from 'vuex'
import regionsData from '@/data/regions.json'
import { progressionService } from '../services/progressionService'

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('elden-ring-progression')
    if (serializedState === null) {
      return {
        regions: regionsData.regions,
        currentRegionId: 'west-limgrave',
        currentStepId: 1
      }
    }
    const state = JSON.parse(serializedState)
    // Find the first incomplete step
    const region = state.regions.find(r => r.id === state.currentRegionId)
    if (region) {
      const firstIncompleteStep = region.steps.find(step => !step.completed)
      if (firstIncompleteStep) {
        state.currentStepId = firstIncompleteStep.id
      }
    }
    return state
  } catch (err) {
    console.error('Error loading state from localStorage:', err)
    return {
      regions: regionsData.regions,
      currentRegionId: 'west-limgrave',
      currentStepId: 1
    }
  }
}

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('elden-ring-progression', serializedState)
  } catch (err) {
    console.error('Error saving state to localStorage:', err)
  }
}

export default createStore({
  state: loadState(),
  getters: {
    currentRegion: state => {
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
    progress: state => {
      const region = state.regions.find(region => region.id === state.currentRegionId)
      if (!region) return 0
      const completedSteps = region.steps.filter(step => step.completed).length
      return (completedSteps / region.steps.length) * 100
    }
  },
  mutations: {
    setCurrentStepId(state, stepId) {
      state.currentStepId = stepId
      saveState(state)
    },
    completeStep(state, stepId) {
      const region = state.regions.find(region => region.id === state.currentRegionId)
      if (region) {
        const step = region.steps.find(step => step.id === stepId)
        if (step) {
          step.completed = true
          // Find the next incomplete step
          const currentIndex = region.steps.findIndex(s => s.id === stepId)
          const nextIncompleteStep = region.steps.slice(currentIndex + 1).find(s => !s.completed)
          if (nextIncompleteStep) {
            state.currentStepId = nextIncompleteStep.id
          }
          saveState(state)
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
      saveState(state)
    }
  },
  actions: {
    completeStep({ commit }, stepId) {
      commit('completeStep', stepId)
    },
    resetProgress({ commit }) {
      commit('resetProgress')
    },
    loadRegions({ commit }) {
      const regions = progressionService.getRegions()
      commit('setRegions', regions)
    }
  }
})