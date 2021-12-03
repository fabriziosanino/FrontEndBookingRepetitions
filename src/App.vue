<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".myNavbar"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse myNavbar" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/" v-on:click.native="switchActive_setPersonal('home', '')" id="router-link1"
                           v-bind:class="(navSelected==='home')?'nav-link active':'nav-link'">
                <span class="btn-label"><i class="fa fa-home"></i></span>
                HOME
              </router-link>
            </li>
            <li class="nav-item" v-if="user.account !== ''">
              <router-link to="/bookedRepetitions" v-on:click.native="switchActive_setPersonal('booked', 'true')"
                           id="router-link2" v-bind:class="(navSelected==='booked')?'nav-link active':'nav-link'">
                <span class="btn-label"><i class="fa fa-calendar-check-o"></i></span>
                MY RESERVATIONS
              </router-link>
            </li>
            <li class="nav-item">
              <router-link v-if="user.role === 'Administrator'"
                           v-on:click.native="switchActive_setPersonal('management', '')" to="/manage" id="router-link3"
                           v-bind:class="(navSelected==='management')?'nav-link active':'nav-link'">
            <span class="btn-label"><i class="fa fa-wrench"></i>
            </span>
                MANAGEMENT
              </router-link>
            </li>
            <li class="nav-item">
              <router-link v-if="user.role === 'Administrator'"
                           v-on:click.native="switchActive_setPersonal('reservation', 'false');" to="/bookedRepetitions"
                           id="router-link4" v-bind:class="(navSelected==='reservation')?'nav-link active':'nav-link'">
            <span class="btn-label"><i class="fa fa-database"></i>
            </span>
                CLIENTS RESERVATIONS
              </router-link>
            </li>
          </ul>
        </div>
        <div class="collapse navbar-collapse myNavbar" id="myNavbar">
          <ul class="navbar-nav ml-auto" v-if="connection">
            <li class="nav-item" v-if="user.account === ''">
              <router-link to="/login" v-on:click.native="switchActive_setPersonal('login', '')" id="router-link5"
                           v-bind:class="(navSelected==='login')?'nav-link active':'nav-link'">
                <span class="btn-label"><i class="fa fa-sign-out"></i></span>
                LOG IN
              </router-link>
            </li>
            <li class="nav-item" v-if="user.account !== ''">
              <a @click="logOut()" class="nav-link" id="aLogOut">
                <span class="btn-label"><i class="fa fa-sign-out"></i></span>
                LOG OUT
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
              </a>
            </li>
          </ul>
        </div>

      </nav>
    </header>
    <main>
      <div class="sayHi" v-if="this.user.account==='' && this.navSelected==='home'">Hi, Guest</div>
      <div class="sayHi" v-else-if="this.user.account!=='' && this.navSelected==='home'" >Hi, {{ this.user.account }}</div>
      <router-view/>
    </main>
    <Footer></Footer>
  </div>
</template>

<script>
import $ from "jquery";
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Footer
  },
  data: () => ({
    user: {
      account: '',
      role: '',
      sessionToken: ''
    },
    connection: true,
    loading: false,
    navSelected: 'home'
  }),
  mounted: function () {
    //elements might not have been added to DOM yet
    
    this.$nextTick(() => {
      if(localStorage.getItem("currentPath")!==undefined) //mantiene l'ultima posizione dopo il refresh
        this.navSelected = localStorage.getItem("currentPath");
      this.checkSession();
    });
  },
  methods: {
    switchActive_setPersonal(itemSelected, value) {
      if (value != "") {
        localStorage.setItem("personal", value);
        for(let i=0; i<this.$children.length; i++){
          if(this.$children[i].$el._prevClass === "bookedReservations")
            this.$children[i].personal = value;
        }
      }

      localStorage.setItem("currentPath", itemSelected);
      this.navSelected=itemSelected;
    },
    checkSession() {
      let ref = this;
      $.post({
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-check-session;jsessionid=" + localStorage.getItem("token"),
        dataType: 'json',
        data: {},
        timeout: 5000
      })
          .done(function (result) {
            if (!result.done) {
              localStorage.clear();
              localStorage.setItem("currentPath", "home");

              if (ref.$router.app._route.fullPath !== '/')
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
            if (results.done) {
              localStorage.clear();
              ref.user.account = "";
              ref.user.role = "";

              ref.$children[1].loggedOut = true;
              ref.navSelected = 'home';
              if (ref.$router.app._route.fullPath !== '/')
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


.sayHi {
  position: relative;
  margin-top: 4mm;
  margin-bottom: 1%;
  margin-left: 2%;
  text-align: left;
  font-weight: bold;
  font-size: larger;
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

.nav-link {
  color: white !important;
  padding-right: 20px !important;
}

.navbar {
  background-color: #1DA1F2 !important;
}

#aLogOut:hover{ cursor: pointer; }

#aLogOut:hover {
  cursor: pointer;
}

.active {
  text-decoration: underline;
}

header{
  overflow: hidden;
  top: 0; /* Position the navbar at the top of the page */
  width: 100%;
  z-index: 2;
  -webkit-box-shadow:0px 1px 8px 5px rgba(50, 50, 50, 0.15);
  -moz-box-shadow:0px 1px 8px 5px rgba(50, 50, 50, 0.15);
  box-shadow: 0px 1px 8px 5px rgba(50, 50, 50, 0.15);

}
</style>
