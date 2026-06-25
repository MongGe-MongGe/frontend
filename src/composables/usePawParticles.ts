import { ref } from 'vue'

export interface PawParticle {
  id: number
  x: number
  y: number
  rot: number
  scale: number
}

export function usePawParticles() {
  const pawParticles = ref<PawParticle[]>([])

  const spawnPawParticles = () => {
    for (let i = 0; i < 12; i++) {
      // 360 degrees for fireworks effect
      const angle = Math.random() * 2 * Math.PI
      const velocity = Math.random() * 35 + 15
      const tx = Math.cos(angle) * velocity
      const ty = Math.sin(angle) * velocity

      const id = Date.now() + i + Math.random()
      pawParticles.value.push({
        id,
        x: tx,
        y: ty,
        rot: Math.random() * 90 - 45,
        scale: Math.random() * 0.4 + 0.6,
      })

      setTimeout(() => {
        pawParticles.value = pawParticles.value.filter((p) => p.id !== id)
      }, 1000)
    }
  }

  return {
    pawParticles,
    spawnPawParticles,
  }
}
