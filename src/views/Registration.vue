<template>
  <div id="registration">
    <div class="container">
      <div id="registration-row" class="row justify-content-center align-items-center">
        <div
            id="registration-column"
            class="col-md-6 card">
          <div id="registration-box" class="col-md-12">
            <form
                id="registration-form"
                class="form"
                method="post"
                onsubmit="return false"
            >
              <h1
                  class="text-center text-info"
                  style="margin-bottom: 0 !important"
              >
                REGISTRATION
              </h1>
              <h5 class="text-center" >
                sign up to continue
              </h5>
              <br/>
              <div class="form-group">
                <!-- <label for="username" class="text-info">Username:</label><br>-->
                <input
                    v-model="surname"
                    type="text"
                    placeholder="Surname"
                    name="surname"
                    id="surname"
                    class="form-control"
                />
              </div>
              <div class="form-group">
                <input
                    v-model="name"
                    type="text"
                    placeholder="Name"
                    name="name"
                    id="name"
                    class="form-control"
                />
              </div>
              <div class="form-group">
                <input
                    v-model="user"
                    type="email"
                    placeholder="Email"
                    name="email"
                    id="email"
                    class="form-control"
                />
              </div>
              <div class="form-group">
                <input
                    type="password"
                    v-model="pwd"
                    placeholder="Password"
                    name="password"
                    id="password"
                    class="form-control"
                />
              </div>
              <div class="form-group">
                <input
                    v-model="confirmPwd"
                    type="password"
                    placeholder="Confirm Password"
                    name="password"
                    id="confpassword"
                    class="form-control"
                />
              </div>
              <div id="register-link" class="text-right">
                <router-link
                    class="nav-link"
                    style="color: #aaa !important; text-align: right !important"
                    to="/login"
                >
                  <a class="text-info">Back to Login</a>
                </router-link
                >
              </div>

              <div class="form-group">
                <button v-on:click="registrationHandler" id="btn-login" name="btn-login" class="btn btn-info btn-md">
                  SIGN UP
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                </button>
              </div>
              <br/>
              <div
                  v-if="error[0].userError"
                  class="alert alert-danger"
                  role="alert"
              >
                {{ error[0].userMsg }}
              </div>
              <div
                  v-else-if="error[1].pwdError"
                  class="alert alert-danger"
                  role="alert"
              >
                {{ error[1].pwdMsg }}
              </div>
              <div
                  v-else-if="error[2].generalError"
                  class="alert alert-danger"
                  role="alert"
              >
                {{ error[2].generalMsg }}
              </div>
              <div
                  v-else-if="error[3].nameError"
                  class="alert alert-danger"
                  role="alert"
              >
                {{ error[3].nameMsg }}
              </div>
              <div
                  v-else-if="error[4].surnameError"
                  class="alert alert-danger"
                  role="alert"
              >
                {{ error[4].surnameMsg }}
              </div>
              <div
                  v-else-if="error[5].confirmPwdError"
                  class="alert alert-danger"
                  role="alert"
              >
                {{ error[5].confirmPwdMsg }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "Registration",
  data: () => ({
    user: "",
    pwd: "",
    confirmPwd: "",
    surname: "",
    name: "",
    error: [
      {
        userError: false,
        userMsg: "Please enter a valid Email",
      },
      {
        pwdError: false,
        pwdMsg: "Please enter a valid Password",
      },
      {
        generalError: false,
        generalMsg: "",
      },
      {
        nameError: false,
        nameMsg: "Please enter a valid Name",
      },
      {
        surnameError: false,
        surnameMsg: "Please enter a valid Surname",
      },
      {
        confirmPwdError: false,
        confirmPwdMsg: "Passwords must be equals",
      },
    ],
    loading: false
  }),
  methods: {
    registrationHandler() {
      this.error[5].confirmPwdError = false;
      this.error[4].surnameError = false;
      this.error[3].nameError = false;
      this.error[2].generalError = false;
      this.error[1].pwdError = false;
      this.error[0].userError = false;

      if (validateSurname(this.surname)) {
        if (validateName(this.name)) {
          if (validateEmail(this.user)) {
            if (validatePassword(this.pwd)) {
              if (valideteConfirmPassword(this.confirmPwd, this.pwd)) {
                let ref = this;
                this.loading = true;
                $.post({
                  url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-registration",
                  dataType: 'json',
                  data: {
                    account: this.user,
                    password: this.pwd,
                    name: this.name,
                    surname: this.surname,
                    role: "Client"
                  }, // Si possono registrare solo Client
                  timeout: 5000
                })
                .done(function (results) {
                  if (results.done) {
                    localStorage.setItem("token", results.token);
                    localStorage.setItem("account", results.account);
                    localStorage.setItem("role", results.role);

                    ref.$parent.checkSession();
                    ref.$router.push('/');
                    ref.loading = false;
                  } else {
                    console.log("error: " + results.error);
                    ref.error[2].generalError = true;
                    ref.error[2].generalMsg = results.error;
                    ref.loading = false;
                  }
                })
                .fail(function (strError) {
                  ref.error[2].generalError = true;
                  if(strError.statusText !== 'error' && strError.status !== 0)
                    ref.error[2].generalMsg = JSON.stringify(strError.status + ": " + strError.statusText);
                  else {
                    if(strError.status === 0)
                      ref.error[2].generalMsg = "Database unavailable.";
                    else
                      ref.error[2].generalMsg = "503: Server unavailable.";
                  }

                  ref.loading = false;                    
                })
              } else this.error[5].confirmPwdError = true;
            } else this.error[1].pwdError = true;
          } else this.error[0].userError = true;
        } else this.error[3].nameError = true;
      } else this.error[4].surnameError = true;
    },
  },
};

function validateEmail(user) {
  const emailPattern = new RegExp("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$");

  if (!emailPattern.test(String(user).toLowerCase())) return false;
  else return true;
}

function validatePassword(pwd) {
  const passwordVal = new RegExp(
      "^(?=.*?[a-z].*?[a-z].*?[a-z])(?=.*?[\\d]).*$"
  ); //at least 1 digit and 3 general character

  if (!passwordVal.test(pwd)) return false;
  else return true;
}

function validateSurname(surname) {
  if (surname === "") {
    return false;
  } else {
    return true;
  }
}

function validateName(name) {
  if (name === "") {
    return false;
  } else {
    return true;
  }
}

function valideteConfirmPassword(confirmPwd, pwd) {
  if (confirmPwd === pwd) return true;
  else return false;
}
</script>


<style>
.card{
border: #adacac 1px solid; padding: 3%; border-radius: 5%;
}

h5{
color: #aaa !important
}
</style>
