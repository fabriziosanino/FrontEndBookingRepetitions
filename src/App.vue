<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light" style="background-color: #1DA1F2!important;">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" style="color: white!important;" to="/">
              <span class="btn-label"><i class="fa fa-home"></i></span> HOME</router-link>
          </li>
          <li class="nav-item">
            <router-link style="color: white!important; padding-left: 21px!important;" class="nav-link" to="/">
              <span class="btn-label"><i class="fa fa-calendar-check-o "></i></span> MY RESERVATIONS</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="getUser.role === 'Administrator'" style="color: white!important; padding-left: 21px!important;" class="nav-link" to="/manage">
              <span class="btn-label"><i class="fa fa-calendar-check-o "></i></span> MANAGEMENT OF Teachers and Courses </router-link>
          </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse flex-grow-1 text-right" id="myNavbar">
        <ul class="navbar-nav ml-auto" style="float: right;">
          <li class="nav-item" v-if="getUser.account === ''">
            <router-link class="nav-link" style="color: white!important; text-align: right!important;" to="/login">
              <span class="btn-label"><i class="fa fa-sign-out  "></i></span>LOGIN</router-link>
          </li>
          <li class="nav-item" v-if="getUser.account !== ''">
            <router-link class="nav-link" style="color: white!important; text-align: right!important;" to="/logout">
              <span class="btn-label"><i class="fa fa-sign-out  "></i></span>LOGOUT</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted: function(){
      //elements might not have been added to DOM yet
      this.$nextTick(() => {
        //definetely added
        this.checkSession();
      });
    },
    computed: {
      getUser(){
        return this.$store.getters.getUser;
      }
    },
    methods: {
      checkSession(){
        if(localStorage.getItem("token") !== "")
          this.$store.dispatch('checkSession', localStorage.getItem("token") || "");
      }
    }
  };
</script>

<style>
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
</style>
