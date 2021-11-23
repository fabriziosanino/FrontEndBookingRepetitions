<template>
  <div class="home">
    <FreeReservations v-bind:products="products"></FreeReservations>
  </div>
</template>

<script>
// @ is an alias to /src
import FreeReservations from '@/components/FreeReservations.vue'

export default {
  name: 'Home',
  components: {
    FreeReservations
  },
  data(){
    return {
      products: [{name:'Banana',price:10},{name:'Apple', price:20}]
    }
  }
}
</script>
