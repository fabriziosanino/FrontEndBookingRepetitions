<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light" style="background-color: #1DA1F2!important;">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" style="color: white!important;" href="index.html">
              <span class="btn-label"><i class="fa fa-home"></i></span> HOME</a>
          </li>
          <li class="nav-item">
            <a style="color: white!important; padding-left: 21px!important;" class="nav-link" href="#">
              <span class="btn-label"><i class="fa fa-calendar-check-o "></i></span> MY RESERVATIONS</a>
          </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse flex-grow-1 text-right" id="myNavbar">
        <ul class="navbar-nav ml-auto" style="float: right;">
          <li class="nav-item">
            <a class="nav-link" style="color: white!important; text-align: right!important;" href="login.html">
              <span class="btn-label"><i class="fa fa-sign-out  "></i></span>LOG OUT</a>
          </li>
        </ul>
      </div>
    </nav>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <router-view/>
  </div>
</template>

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
