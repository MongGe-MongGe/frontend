<template>
  <div ref="mapContainer" class="w-full h-full bg-gray-200"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  lat: number
  lng: number
  level?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markers?: Array<any>
  selectedId?: string | null
}>()

const emit = defineEmits(['marker-click', 'center-changed', 'bounds-changed'])
const mapContainer = ref<HTMLElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentMarkers: any[] = []

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    // kakao maps API가 스크립트 로드 후에 사용가능하도록 대기
    window.kakao.maps.load(() => {
      initMap()
    })
  } else {
    console.error('Kakao map script is not loaded.')
  }
})

const initMap = () => {
  if (!mapContainer.value) return

  const options = {
    center: new window.kakao.maps.LatLng(props.lat, props.lng),
    level: props.level || 3,
  }
  map = new window.kakao.maps.Map(mapContainer.value, options)

  // 지도 이동이 멈추었을 때 중심 좌표 전달
  window.kakao.maps.event.addListener(map, 'idle', () => {
    const center = map.getCenter()
    const bounds = map.getBounds()
    emit('center-changed', { lat: center.getLat(), lng: center.getLng() })
    emit('bounds-changed', bounds)
  })

  renderMarkers()
}

const renderMarkers = () => {
  if (!map || !props.markers) return

  // 기존 마커(오버레이) 제거
  currentMarkers.forEach((m) => m.setMap(null))
  currentMarkers = []

  props.markers.forEach((markerData, index) => {
    const isSelected = props.selectedId === markerData.id
    const position = new window.kakao.maps.LatLng(markerData.lat, markerData.lng)

    // CustomOverlay 내용 생성
    const content = document.createElement('div')

    // 브랜드 컬러 외곽선(Tailwind 'border-primary' 기준)
    // 선택된 경우 크기 증가 및 핑크색(육구) 채우기
    // 크기를 기존보다 약 20% 감소시킴 (w-10 -> w-8, w-12 -> w-10)
    const sizeClasses = isSelected ? 'w-10 h-10' : 'w-8 h-8'
    const fillStyle = isSelected ? '#ff69b4' : 'none'
    const strokeStyle = '#ff69b4'
    const shadowClass = isSelected ? 'shadow-xl' : 'shadow-md'

    // 물방울(핀) 모양: border-radius 50% 50% 50% 0 (bottom-left가 뾰족)
    // 외곽선을 엄청 가늘게 하기 위해 'border-2' 대신 'border'(1px) 사용
    content.className = `flex items-center justify-center bg-white border border-primary ${shadowClass} cursor-pointer transition-transform duration-300 hover:scale-110 -rotate-45 origin-bottom-left ${sizeClasses}`
    content.style.borderRadius = '50% 50% 50% 0'
    content.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fillStyle}" stroke="${strokeStyle}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-3/5 h-3/5">
        <circle cx="11" cy="4" r="2"/>
        <circle cx="18" cy="8" r="2"/>
        <circle cx="20" cy="16" r="2"/>
        <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
      </svg>
    `

    content.onclick = () => {
      emit('marker-click', markerData, index)
    }

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: position,
      content: content,
      xAnchor: 0,
      yAnchor: 1,
      zIndex: isSelected ? 10 : 1,
    })

    customOverlay.setMap(map)
    currentMarkers.push(customOverlay)
  })
}

watch(
  () => props.markers,
  () => {
    renderMarkers()
  },
  { deep: true },
)

watch(
  () => props.selectedId,
  () => {
    renderMarkers()
  },
)

watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  if (map) {
    const moveLatLon = new window.kakao.maps.LatLng(newLat, newLng)
    map.panTo(moveLatLon)
  }
})
</script>
