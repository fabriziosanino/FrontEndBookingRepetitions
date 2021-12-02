<template>
  <div class="bookedReservations" v-if="user.account !== ''">
    <section>
      <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status" v-if="loading">
        <span class="sr-only">Loading...</span>
      </div>
      <div v-if="stateChangeResult[0].changeSuccess" class="alert alert-success customWidth" role="alert">
        {{ stateChangeResult[0].changeMessage }}
      </div>
      <div v-else-if="stateChangeResult[1].changeError" class="alert alert-danger customWidth" role="alert">{{
          stateChangeResult[1].changeMessage
        }}
      </div>
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
            </div>
          </nav>
          <br>
          <div class="table-responsive">
            <table class="table table-hover">
              <caption>List of active, cancelled and done repetitions.</caption>
              <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Title</th>
                <th scope="col">Name</th>
                <th scope="col">Surname</th>
                <th scope="col" v-if="user.role === 'Administrator' && personal !== 'true'">Account</th>
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
                <td v-if="user.role === 'Administrator' && personal !== 'true'">{{ el.Account }}</td>
                <td>
                  <input v-if="selectedTab === 'Active'" id="setDone"
                        class="btn btn-info btn-md fa-file-text-o" value="DONE"
                        v-on:click="changeState(el.IDRepetition, 'Done')">
                </td>
                <td>
                  <input v-if="selectedTab === 'Active'" id="delete"
                        class="btn btn-outline-danger btn-md" value="DELETE"
                        v-on:click="changeState(el.IDRepetition, 'Cancelled')">
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
    <br/><br/>
  </div>
</template>

<script>
import $ from "jquery";

//TODO: se la sessione scade mentre siamo sulle my reservation non si aggiorna il pulsante di login

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
        changeMessage: "Booked repetition state modified successfully!",
        changeSuccess: false
      },
      {
        changeError: false,
        changeMessage: "Error while updating state"
      }
    ],
    loading: false,
    personal: ''
  }),
  watch: {
    personal: function () {
      this.getBooked();
    }
  },
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
      let accountParam = "";

      let personalRead = localStorage.getItem("personal");
      if (personalRead ==  'true') {
        accountParam = this.user.account;
      }else
        accountParam = "all";

      $.post({
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-get-booked-history-repetitions;jsessionid=" + localStorage.getItem("token"),
        dataType: 'json',
        data: {
          state: this.selectedTab,
          account: accountParam,
          sessionToken: this.user.sessionToken
        },
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              ref.booked = results.results;
              ref.addFinish();
            } else {
              errorHandling(results, ref);
            }
          })
          .fail(function (strError) {
            failRequest(ref, strError);
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
      this.loading = true;
      $.get({
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-manage-repetitions;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {newState: newState, IDRepetition: idRepetition, sessionToken: this.user.sessionToken},
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              for (let i = 0; i < ref.booked.length; i++) {
                if (ref.booked[i].IDRepetition === idRepetition)
                  ref.booked.splice(i, 1);
              }

              ref.stateChangeResult[0].changeSuccess = true;
              setTimeout(function () {
                ref.stateChangeResult[0].changeSuccess = false;
              }, 5000);
            } else {
              errorHandling(results, ref);
            }

            ref.loading = false;
          })
          .fail(function (strError) {
            failRequest(ref, strError);
          })
    }
  }
}

function errorHandling(results, ref) {
  if (results.error === "no session") {
    localStorage.clear();
    localStorage.setItem("currentPath", "home");
    ref.$parent.navSelected='home';
    ref.user.account = "";
    ref.user.sessionToken = "";
    ref.user.role = "";

    ref.$parent.user.sessionToken = "";
    ref.$parent.user.role = "";
    ref.$parent.user.account = "";

    if(ref.$router.app._route.fullPath !== '/')
      ref.$router.push('/');
  } else {
    ref.stateChangeResult[1].changeError = true;
    ref.stateChangeResult[1].changeMessage += " " + results.error;
    setTimeout(function () {
      ref.stateChangeResult[1].changeError = false;
    });
  }
}

function failRequest(ref, strError) {
  ref.stateChangeResult[1].changeError = true;
  if (strError.statusText !== 'error' && strError.status !== 0)
    ref.stateChangeResult[1].changeMessage = JSON.stringify(strError.status + ": " + strError.statusText);
  else {
    if (strError.status === 0)
      ref.stateChangeResult[1].changeMessage = "Database unavailable.";
    else
      ref.stateChangeResult[1].changeMessage = "503: Server unavailable.";
  }

  ref.loading = false;
}
</script>

<style scoped>
#nav-tab:hover {
  cursor: pointer;
}
.active{font-weight: bold;}

thead{border-top:0px !important;}

.customWidth{
  position: relative;
  left: 5%;
  width: 90%;
  margin-top: 2%;
}
</style>