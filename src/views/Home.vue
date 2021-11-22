<template>
  <div class="home">
    <FreeReservations></FreeReservations>
  </div>
</template>

<script>
// @ is an alias to /src
import FreeReservations from '@/components/FreeReservations.vue'

export default {
  name: 'Home',
  components: {
    FreeReservations
  }
}
</script>
