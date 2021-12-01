<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-light bg-light" style="background-color: #1DA1F2!important;">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a href="/" id="home_reloading" class="nav-link" style="color: white!important;">
              <span class="btn-label"><i class="fa fa-home"></i></span>
              HOME
            </a>
          </li>
          <li class="nav-item" v-if="user.account !== '' && user.role !== 'Administrator'">
            <a href="/bookedRepetitions" style="color: white!important; padding-left: 21px!important;" class="nav-link">
              <span class="btn-label"><i class="fa fa-calendar-check-o"></i></span>
              MY RESERVATIONS
            </a>
          </li>
          <li class="nav-item">
            <a v-if="user.role === 'Administrator'" href="/manage" style="color: white!important; padding-left: 21px!important;" class="nav-link">
            <span class="btn-label"><i class="fa fa-wrench"></i>
            </span>
              MANAGEMENT
            </a>
          </li>
          <li class="nav-item">
            <a v-if="user.role === 'Administrator'" href="/bookedRepetitions" style="color: white!important; padding-left: 21px!important;" class="nav-link">
            <span class="btn-label"><i class="fa fa-database"></i>
            </span>
              VIEW ALL BOOKED'S
            </a>
          </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse flex-grow-1 text-right" id="myNavbar">
        <ul class="navbar-nav ml-auto" style="float: right;" v-if="connection">
          <li class="nav-item" v-if="user.account === ''">
            <a href="/login" class="nav-link" style="color: white!important; text-align: right!important;">
              <span class="btn-label"><i class="fa fa-sign-out"></i></span>
              LOG IN
            </a>
          </li>
          <li class="nav-item" v-if="user.account !== ''">
            <a @click="logOut()" class="nav-link" id="aLogOut" style="color: white!important; text-align: right!important;">
              <span class="btn-label"><i class="fa fa-sign-out"></i></span>
              LOG OUT
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
            </a>
          </li>
        </ul>
      </div>

    </nav>

    <main>
      <router-view/>
    </main>

  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: 'App',
  data:() => ({
    user: {
      account: '',
      role: '',
      sessionToken: ''
    },
    connection: true,
    loading: false
  }),
  mounted: function () {
    //elements might not have been added to DOM yet
    this.$nextTick(() => {
      this.checkSession();
    });
  },
  methods: {
    checkSession() {
      let ref = this;
      $.post({
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-check-session;jsessionid=" + localStorage.getItem("token"),
        dataType: 'json',
        data: {sessionToken: localStorage.getItem("token")},
        timeout: 5000
      })
      .done(function (result) {
        if (!result.done) {
          localStorage.clear();

          if(ref.$router.app._route.fullPath !== '/')
            ref.$router.push('/');
          
        } else {
          ref.user.account = result.account;
          ref.user.role = result.role;
          ref.user.sessionToken = result.token;
        }
      })
      .fail(function (strError) {
        console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
      });
    },

    logOut() {
      let ref = this;
      this.loading = true;
      $.get({
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-logout",
        dataType: 'json',
        timeout: 5000
      })
      .done(function (results) {
        console.log(results);
        if (results.done) {
          localStorage.clear();
          ref.user.account = "";
          ref.user.role = "";

          if(ref.$router.app._route.fullPath !== '/')
            ref.$router.push('/');
          
        } else {
          console.log("error: " + results.error);
        }

        ref.loading = false;
      })
      .fail(function (strError) {
        alert("NO DB or SERVER connection");
        console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));

        ref.loading = false;
      })
    },
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#aLogOut:hover{ cursor: pointer; }
</style>
