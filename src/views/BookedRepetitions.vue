<template>
  <div class="bookedReservations" v-if="user.account !== ''">
    <section>
      <div style="margin: 5px;" class="card">
        <div class="card-body">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a v-bind:class="(selectedTab==='Active')?'nav-item nav-link active':'nav-item nav-link'"
                 id="nav-active-tab" data-toggle="tab" v-on:click="setTab('Active')">ACTIVE</a>
              <a v-bind:class="(selectedTab==='Cancelled')?'nav-item nav-link active':'nav-item nav-link'"
                 id="nav-cancelled-tab" data-toggle="tab" v-on:click="setTab('Cancelled')">CANCELLED</a>
              <a v-bind:class="(selectedTab==='Done')?'nav-item nav-link active':'nav-item nav-link'" id="nav-done-tab"
                 data-toggle="tab" v-on:click="setTab('Done')">DONE</a>
              <div v-if="stateChangeResult[0].changeSuccess" class="alert alert-success" role="alert">
                {{ stateChangeResult[0].changeMessage }}
              </div>
              <div v-else-if="stateChangeResult[1].changeError" class="alert alert-danger" role="alert">{{
                  stateChangeResult[1].changeError
                }}
              </div>
            </div>
          </nav>
          <br>
          <table class="table">
            <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Title</th>
              <th scope="col">Name</th>
              <th scope="col">Surname</th>
              <th scope="col">
              </th>
              <th scope="col">
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="el in booked" v-bind:key="el.IDRepetition">
              <td>{{ el.day }}</td>
              <td>{{ el.startTime }}</td>
              <td>{{ el.finishTime }}</td>
              <td>{{ el.title }}</td>
              <td>{{ el.name }}</td>
              <td>{{ el.surname }}</td>
              <td>
                <input v-if="selectedTab == 'Active'" id="setDone" class="btn btn-info btn-md" value="DONE"
                       v-on:click="changeState(el.IDRepetition, 'Done')">
              </td>
              <td>
                <input v-if="selectedTab == 'Active'" id="delete" class="btn btn-info btn-md" value="DELETE"
                       v-on:click="changeState(el.IDRepetition, 'Cancelled')">
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <br/><br/>
  </div>
</template>

<script>
import $ from "jquery";

//TODO: se la sessione scade mentre siamo sulle my reservation non si aggirono il pulsante di login

export default {
  name: "BookedRepetitions",
  data: () => ({
    selectedTab: "Active",
    booked: [],
    user: {
      account: "",
      sessionToken: "",
      role: ""
    },
    stateChangeResult: [
      {
        changeMessage: "Booked repetion state modifyed successfully",
        changeSuccess: false
      },
      {
        changeError: false,
        changeMessage: "Error while updating state"
      }
    ]
  }),
  mounted() {
    this.$nextTick(() => {
      //definetely added
      this.user.account = localStorage.getItem("account");
      this.user.role = localStorage.getItem("role");
      this.user.sessionToken = localStorage.getItem("token");

      this.getBooked();
    });
  },
  methods: {
    setTab(type) {
      this.selectedTab = type;
      this.getBooked();
    },
    getBooked() {
      let ref = this;
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-get-booked-history-repetitions;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {
          state: this.selectedTab,
          account: this.user.account,
          sessionToken: this.user.sessionToken
        },
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              ref.booked = results.results;
              ref.addFinish();
            } else if (results.error == "no session") {
              localStorage.clear();
              ref.user.account = "";
              ref.user.sessionToken = "";
              ref.user.role = "";
            } else {
              console.log("error: " + results.error);
            }
          })
          .fail(function (strError) {
            console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
          })
    },
    addFinish() {
      this.booked.map(item => {
        item.finishTime = parseInt(item.startTime.substring(0, 2)) + 1 + item.startTime.substring(2);
      });
    },
    changeState(idRepetition, newState) {
      this.stateChangeResult[0].changeSuccess = false;
      this.stateChangeResult[0].changeError = false;
      let ref = this;
      $.ajax({
        type: "GET",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-manage-repetitions;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {newState: newState, IDRepetition: idRepetition, sessionToken: this.user.sessionToken},
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              for (let i = 0; i < ref.booked.length; i++) {
                if (ref.booked[i].IDRepetition == idRepetition)
                  ref.booked.splice(i, 1);
              }

              ref.stateChangeResult[0].changeSuccess = true;
              setTimeout(function () {
                ref.stateChangeResult[0].changeSuccess = false;
              }, 5000);
            } else if (results.error == "no session") {
              localStorage.clear();
              ref.user.account = "";
              ref.user.sessionToken = "";
              ref.user.role = "";
            } else {
              ref.stateChangeResult[1].changeError = true;
              ref.stateChangeResult[1].changeMessage += " " + results.error();
              setTimeout(function (){
                ref.stateChangeResult[1].changeError = false;
              });
            }
          })
          .fail(function (strError) {
            console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
          })
    }
  }
}
</script>