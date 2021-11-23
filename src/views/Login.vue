<template>
<div id="login" class="login">
  <h3 class="text-center text-white pt-5">Login form</h3>
  <div class="container">
    <div id="login-row" class="row justify-content-center align-items-center">
      <div id="login-column" style="border: #adacac 1px solid; padding: 5%;border-radius: 5%;" class="col-md-6">
        <div id="login-box" class="col-md-12">
          <form id="login-form" class="form" method="post" onsubmit="return false">
            <h1 class="text-center text-info"  style="margin-bottom: 0!important;">WELCOME</h1>
            <h5 class="text-center"  style="color:#aaa!important; ">sign in to continue</h5><br>
            <div class="form-group">
              <label for="username" class="text-info">Username:</label><br>
              <input type="email" v-model="user" placeholder="username" name="username" id="username" class="form-control" required/>
            </div>
            <div class="form-group">
              <label for="password" class="text-info">Password:</label><br>
              <input type="password" v-model="pwd" placeholder="password" name="password" id="password" class="form-control" required/>
            </div>
            <div id="register-link" class="text-right">
              New user?
              <a href="registration.html" class="text-info">Sign up</a>
            </div>

            <div class="form-group">
              <button v-on:click="loginHandler" id="btn-login" name="btn-login" class="btn btn-info btn-md" >SIGN IN</button>
            </div>

            <br/><div v-if="userError" class="alert alert-danger" role="alert">Please enter a valid Username and Password</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import $ from 'jquery';

  export default {
    name: 'Login',
    data: () => ({
      user: '',
      pwd: '',
      userError: false,
      pwdError: false
    }),
    methods: {
      loginHandler(){
        if(validateEmail(this.user))
          if(validatePassword(this.pwd)){
            alert('OK');
            $.post({
              url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-login",
              contentType: "application/json; charset=utf-8",
              dataType: 'json',
              data: {'Account':this.user, 'Pwd':this.pwd},
              timeout: 5000
            })
            .done(function() { //dataStr
              alert("LOGIN OK");
            })
            .fail(function(strError) {
              console.log("error: "+JSON.stringify(strError.status + ": " + strError.statusText));
            });	
          }else{
            this.pwdError = true;
          } 
        else{
          this.userError = true;
        }
      }
    }
  };

  function validateEmail(user) {
    const emailPattern = new RegExp('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$');

    if (!emailPattern.test(String(user).toLowerCase()))
      return false;
    else
      return true;
  }

  function validatePassword(pwd) {
    const passwordVal = new RegExp('^(?=.*?[a-z].*?[a-z].*?[a-z])(?=.*?[\\d]).*$');  //at least 1 digit and 3 general character

    if (!passwordVal.test(pwd))
      return false;
    else
      return true;
  }
</script>
