<template>
  <section class="home">
    <!--<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status" v-if="loading">
      <span class="sr-only">Loading...</span>
    </div>-->
    <div v-if="bookedResult[0].newResults">
      <div v-if="bookedResult[1].bookedError" class="alert alert-danger customWidth" role="alert">
        {{ bookedResult[1].errorMsg }}
      </div>
      <div v-else-if="bookedResult[2].bookedSuccess" class="alert alert-success customWidth" role="alert">
        {{ bookedResult[2].successMsg }}
      </div>
    </div>
    
    <div style="margin: 5px;" class="card">
      <div class="card-body">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a v-bind:class="(selectedDay==='Monday')?'nav-item nav-link active':'nav-item nav-link'"
                id="nav-monday-tab" data-toggle="tab" @click="getWeekDay('Monday')">MONDAY</a>
            <a v-bind:class="(selectedDay==='Tuesday')?'nav-item nav-link active':'nav-item nav-link'"
                id="nav-tuesday-tab" data-toggle="tab" @click="getWeekDay('Tuesday')">TUESDAY</a>
            <a v-bind:class="(selectedDay==='Wednesday')?'nav-item nav-link active':'nav-item nav-link'"
                id="nav-wednesday-tab" data-toggle="tab" @click="getWeekDay('Wednesday')">WEDNESDAY</a>
            <a v-bind:class="(selectedDay==='Thursday')?'nav-item nav-link active':'nav-item nav-link'"
                id="nav-thursday-tab" data-toggle="tab" @click="getWeekDay('Thursday')">THURSDAY</a>
            <a v-bind:class="(selectedDay==='Friday')?'nav-item nav-link active':'nav-item nav-link'"
                id="nav-friday-tab" data-toggle="tab" @click="getWeekDay('Friday')">FRIDAY</a>
          </div>
        </nav>
        <br>
        <div class="table-responsive">
          <table class="table table-hover">
            <caption>Free repetitions list.</caption>
            <thead>
            <tr>
              <th scope="col">HOURS</th>
              <th scope="col">COURSE</th>
              <th scope="col">TEACHER</th>
              <th scope="col"></th>
            </tr>
            </thead>

            <FreeRepetitionsList v-bind:selectedDay="selectedDay"></FreeRepetitionsList>

          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import FreeRepetitionsList from '@/components/FreeRepetitionsList.vue'
export default {
  name: 'Home',
  components: {
    FreeRepetitionsList
  },

  data() {
    return {
      selectedDay: "Monday",
      bookedResult: [{newResults: false}, {bookedError: false, errorMsg: ""}, {
        bookedSuccess: false,
        successMsg: "Repetition booked successfully! Check it out in the \"My Reservations\" section."
      }],
      loggedOut: false
    }
  },

  methods: {
    getWeekDay: function (day) {
      this.selectedDay = day;
    }
  },

  watch:{
    loggedOut: function(){
      this.$children[0].fetchFreeRepetitions(this.selectedDay);
      this.loggedOut=false;
      this.$parent.navSelected='home';
    }
  }
};

</script>

<style scoped>
#nav-tab:hover {
  cursor: pointer;
}

.active {
  font-weight: bold;
}

.table{
  margin-bottom: 5rem;
}

.customWidth{
  position: relative;
  left: 5%;
  width: 90%;
  margin-top: 2%;
}

thead{border-top:0px !important;}

.card{
border: #adacac 1px ; padding: 0.4%; border-radius: 1%;
  -webkit-box-shadow:0px 10px 15px 6px rgba(50, 50, 50, 0.15);
  -moz-box-shadow: 0px 10px 15px 6px rgba(50, 50, 50, 0.15);
  box-shadow: 0px 10px 15px 6px rgba(50, 50, 50, 0.15);
}
</style>
