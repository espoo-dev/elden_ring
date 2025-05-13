import regionsData from '../data/regions.json'

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

// Check if a step is completed in localStorage
const isStepCompleted = (regionId, stepId) => {
  const completedSteps = loadCompletedSteps()
  const stepKey = generateStepKey(regionId, stepId)
  return completedSteps.includes(stepKey)
}

export const progressionService = {
  getRegions() {
    return regionsData.regions.map(region => ({
      ...region,
      steps: region.steps.map(step => ({
        ...step,
        completed: isStepCompleted(region.id, step.id)
      }))
    }))
  },

  getRegionById(regionId) {
    const regions = this.getRegions()
    return regions.find(region => region.id === regionId)
  },

  getCurrentStep(regionId) {
    const region = this.getRegionById(regionId)
    if (!region) return null
    return region.steps.find(step => !step.completed) || region.steps[0]
  },

  getNextStep(regionId, currentStepId) {
    const region = this.getRegionById(regionId)
    if (!region) return null
    const currentIndex = region.steps.findIndex(step => step.id === currentStepId)
    return region.steps.slice(currentIndex + 1).find(step => !step.completed)
  },

  completeStep(regionId, stepId) {
    const region = this.getRegionById(regionId)
    if (!region) return false

    const step = region.steps.find(s => s.id === stepId)
    if (step) {
      step.completed = true
      // Save completed step to localStorage
      const completedSteps = loadCompletedSteps()
      const stepKey = generateStepKey(regionId, stepId)
      if (!completedSteps.includes(stepKey)) {
        completedSteps.push(stepKey)
        saveCompletedSteps(completedSteps)
      }
      return true
    }
    return false
  },

  getProgress(regionId) {
    const region = this.getRegionById(regionId)
    if (!region) return 0

    const completed = region.steps.filter(step => step.completed).length
    return (completed / region.steps.length) * 100
  },

  resetProgress() {
    saveCompletedSteps([])
  }
}