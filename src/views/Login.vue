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
              <router-link class="nav-link" style="color: #aaa!important; text-align: right!important;" to="/registration">
              New User? SIGN UP</router-link>
            </div>

            <div class="form-group">
              <button v-on:click="loginHandler" id="btn-login" name="btn-login" class="btn btn-info btn-md" >SIGN IN</button>
            </div>

            <br/>
            <div v-if="error[0].userError" class="alert alert-danger" role="alert">{{ error[0].userMsg }}</div>
            <div v-else-if="error[1].pwdError" class="alert alert-danger" role="alert">{{ error[1].pwdMsg }}</div>
            <div v-else-if="error[2].generalError" class="alert alert-danger" role="alert">{{ error[2].generalMsg }}</div>
          </form>

          <span class="account">{{ getUser.account }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'Login',
    data: () => ({
      user: '',
      pwd: '',
      error: [{userError:false, userMsg:"Please enter a valid Username"}, {pwdError:false, pwdMsg:"Please enter a valid Password"}, {generalError:false, generalMsg:""}]
    }),
    computed: {
      getUser(){
        return this.$store.getters.getUser;
      }
    },
    methods: {
      loginHandler(){
        this.error[2].generalError = false;
        this.error[1].pwdError = false;
        this.error[0].userError = false;
        if(validateEmail(this.user))
          if(validatePassword(this.pwd)){
            var userCredentials = {account: this.user, pwd: this.pwd};
            this.$store.dispatch('loginUser', userCredentials).then( () => {
              this.$router.push('/');
            }, error => {
              this.error[2].generalError = true;
              this.error[2].generalMsg = error;
            });
          }else
            this.error[1].pwdError = true;
        else
          this.error[0].userError = true;
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
