<template>
  <div id="login" class="login">
    <h3 class="text-center text-white pt-5">Login form</h3>
    <div class="container">
      <div id="login-row" class="row justify-content-center align-items-center">
        <div id="login-column" style="border: #adacac 1px solid; padding: 5%;border-radius: 5%;" class="col-md-6">
          <div id="login-box" class="col-md-12">
            <form id="login-form" class="form" method="post" onsubmit="return false">
              <h1 class="text-center text-info" style="margin-bottom: 0!important;">WELCOME</h1>
              <h5 class="text-center" style="color:#aaa!important; ">sign in to continue</h5><br>
              <div class="form-group">
                <label for="username" class="text-info">Username</label><br>
                <input type="email" v-model="mail" placeholder="mario.rossi@email.com" name="username" id="username"
                       class="form-control" required/>
              </div>
              <div class="form-group">
                <label for="password" class="text-info">Password</label><br>
                <input type="password" v-model="pwd" placeholder="password" name="password" id="password"
                       class="form-control" required/>
              </div>
              <div id="register-link" class="text-right">
                <router-link class="nav-link" style="color: #aaa!important; text-align: right!important;"
                             to="/registration">
                  New User? SIGN UP
                </router-link>
              </div>

              <div class="form-group">
                <button v-on:click="loginHandler" id="btn-login" name="btn-login" class="btn btn-info btn-md">SIGN IN
                </button>
              </div>

            <br/>
            <div v-if="error[0].userError" class="alert alert-danger" role="alert">{{ error[0].userMsg }}</div>
            <div v-else-if="error[1].pwdError" class="alert alert-danger" role="alert">{{ error[1].pwdMsg }}</div>
            <div v-else-if="error[2].generalError" class="alert alert-danger" role="alert">{{ error[2].generalMsg }}</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: 'Login',
  data: () => ({
    mail: '',
    pwd: '',
    error: [{userError: false, userMsg: "Please enter a valid Username"}, {
      pwdError: false,
      pwdMsg: "Please enter a valid Password (at least 1 digit)"
    }, {generalError: false, generalMsg: ""}]
  }),
  methods: {
    loginHandler() {
      this.error[2].generalError = false;
      this.error[1].pwdError = false;
      this.error[0].userError = false;
      if (validateEmail(this.mail))
        if (validatePassword(this.pwd)) {
          let ref = this;
          $.post({
            url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-login",
            dataType: 'json',
            data: {account: this.mail, password: this.pwd},
            timeout: 5000
          })
              .done(function (results) {
                if (results.done) {
                  localStorage.setItem("token", results.token);
                  localStorage.setItem("account", results.account);
                  localStorage.setItem("role", results.role);

                  ref.$parent.checkSession();

                  ref.$router.push("/")
                } else {
                  console.log("error: " + results.error);
                  ref.error[2].generalError = true;
                  ref.error[2].generalMsg = results.error;
                }
              })
              .fail(function (strError) {
                console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
              })
        } else
          this.error[1].pwdError = true;
      else
        this.error[0].userError = true;
    }
  }

};

function validateEmail(user) {
  const emailPattern = new RegExp('^[a-zA-Z0-9._-]+@[a-z]+.+[a-z]+$');

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
