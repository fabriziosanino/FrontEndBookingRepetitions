<template>
  <div class="home">
    <section>

    <div style="margin: 5px;" class="card">
      <div class="card-body">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a v-bind:class = "(selectedDay==='Monday')?'nav-item nav-link active':'nav-item nav-link'" id="nav-monday-tab" data-toggle="tab" @click="getWeekDay('Monday')">MONDAY</a>
            <a v-bind:class = "(selectedDay==='Tuesday')?'nav-item nav-link active':'nav-item nav-link'" id="nav-tuesday-tab" data-toggle="tab" @click="getWeekDay('Tuesday')">TUESDAY</a>
            <a v-bind:class = "(selectedDay==='Wednesday')?'nav-item nav-link active':'nav-item nav-link'" id="nav-wednesday-tab" data-toggle="tab" @click="getWeekDay('Wednesday')">WEDNESDAY</a>
            <a v-bind:class = "(selectedDay==='Thursday')?'nav-item nav-link active':'nav-item nav-link'" id="nav-thursday-tab" data-toggle="tab" @click="getWeekDay('Thursday')">THURSDAY</a>
            <a v-bind:class = "(selectedDay==='Friday')?'nav-item nav-link active':'nav-item nav-link'" id="nav-friday-tab" data-toggle="tab" @click="getWeekDay('Friday')">FRIDAY</a>
          </div>
        </nav>
        <br>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">HOURS</th>
              <th scope="col">SUBJECT</th>
              <th scope="col">TEACHER</th>
              <th scope="col"></th>
            </tr>
          </thead>

            <FreeRepetitionsList v-bind:selectedDay="selectedDay"></FreeRepetitionsList>

        </table>
      </div>
    </div>
  </section>

  <FreeReservations></FreeReservations>
  
  </div>
</template>

<script>
// @ is an alias to /src
import FreeReservations from '@/components/FreeReservations.vue'
import FreeRepetitionsList from '@/components/FreeRepetitionsList.vue'

export default {
  name: 'Home',
  components: {
    FreeReservations,
    FreeRepetitionsList
  },

  data(){
    return {
      selectedDay: "Monday"
    }
  },

  methods:{
    getWeekDay: function(day){
      this.selectedDay = day;
    }
  }
}
</script>
