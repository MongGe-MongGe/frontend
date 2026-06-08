<template>
  <div ref="mapContainer" class="w-full h-full bg-gray-200"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  lat: number
  lng: number
  level?: number
  markers?: Array<{ lat: number; lng: number; title: string }>
}>()

const emit = defineEmits(['marker-click', 'center-changed'])
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
    emit('center-changed', { lat: center.getLat(), lng: center.getLng() })
  })

  renderMarkers()
}

const renderMarkers = () => {
  if (!map || !props.markers) return

  // 기존 마커 제거
  currentMarkers.forEach((m) => m.setMap(null))
  currentMarkers = []

  props.markers.forEach((markerData, index) => {
    const position = new window.kakao.maps.LatLng(markerData.lat, markerData.lng)
    const marker = new window.kakao.maps.Marker({
      position,
      title: markerData.title,
    })
    marker.setMap(map)
    currentMarkers.push(marker)

    window.kakao.maps.event.addListener(marker, 'click', () => {
      emit('marker-click', markerData, index)
    })
  })
}

watch(
  () => props.markers,
  () => {
    renderMarkers()
  },
  { deep: true },
)

watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  if (map) {
    const moveLatLon = new window.kakao.maps.LatLng(newLat, newLng)
    map.panTo(moveLatLon)
  }
})
</script>
