<template>
  <div id="modal">
    <div class="container">
      <div id="modal-row" class="row justify-content-center align-items-center">
        <div id="modal-column" style="border: #adacac 1px solid; padding: 5%;border-radius: 5%;" class="col-md-6">
          <div id="modal-box" class="col-md-12">
            <form v-if="type==='course'">
              <h1 class="text-center text-info" style="margin-bottom: 0!important;">Add a new Course</h1>
              <br>
              <div class="form-group">
                <label for="title" class="text-info">Title:</label><br>
                <input type="text" v-model="title" placeholder="Reti I" name="title" id="title" class="form-control"
                       required/>
              </div>
              <div class="form-group">
                <input type="button" class="btn btn-outline-success btn-md" value="ADD" v-on:click="insertElement">&nbsp;&nbsp;&nbsp;
                <input type="button" class="btn btn-outline-secondary btn-md" value="BACK" v-on:click="back">
              </div>

              <br/>
              <div v-if="error[0].titleError" class="alert alert-danger" role="alert">{{ error[0].titleMsg }}</div>
              <div v-else-if="error[1].generalError" class="alert alert-danger" role="alert">{{
                  error[1].generalMsg
                }}
              </div>
            </form>
            <form v-else-if="type==='teacher'">
              <h1 class="text-center text-info" style="margin-bottom: 0!important;">Add a new Teacher</h1>
              <br>
              <div class="form-group">
                <label for="title" class="text-info">Mail:</label><br>
                <input type="text" v-model="mail" placeholder="mario@unito.it" name="mail" id="mail"
                       class="form-control"
                       required/>
                <label for="name" class="text-info">Name:</label><br>
                <input type="text" v-model="nameT" placeholder="mario" name="name" id="name" class="form-control"
                       required/>
                <label for="surname" class="text-info">Surname:</label><br>
                <input type="text" v-model="surname" placeholder="rossi" name="surname" id="surname"
                       class="form-control"
                       required/>
              </div>
              <div class="form-group">
                <input type="button" class="btn btn-outline-success btn-md" value="ADD" v-on:click="insertElement">&nbsp;&nbsp;&nbsp;
                <input type="button" class="btn btn-outline-secondary btn-md" value="BACK" v-on:click="back">
              </div>

              <br/>
              <div v-if="error[2].mailError" class="alert alert-danger" role="alert">{{ error[2].mailMsg }}</div>
              <div v-if="error[3].nameError" class="alert alert-danger" role="alert">{{ error[3].nameMsg }}</div>
              <div v-if="error[4].surnameError" class="alert alert-danger" role="alert">{{ error[4].surnameMsg }}</div>
              <div v-else-if="error[1].generalError" class="alert alert-danger" role="alert">{{
                  error[1].generalMsg
                }}
              </div>
            </form>
            <form v-else-if="type==='teach'">
              <h1 class="text-center text-info" style="margin-bottom: 0!important;">Add a new Teacher-Course Association</h1>
              <br>
              <div class="form-group">
                <label>IDTeacher:&nbsp;&nbsp;</label>
                <select name="idTeachers" id="idTeachers" @change="onChangeTeacher($event)" class="form-control">
                  <option value="">Select a teacher</option>
                  <option v-for="teacher in this.ausTeachers" v-bind:key="teacher.IDTeacher"
                          v-bind:value="teacher.IDTeacher">{{ teacher.Name }} {{ teacher.Surname }}
                  </option>
                </select><br/><br/>
                <label>IDCourse:&nbsp;&nbsp;</label>
                <select name="idCourses" id="idCourses" @change="onChangeCourse($event)" class="form-control">
                  <option value="">Select a course</option>
                  <option v-for="course in this.ausCourses" v-bind:key="course.IDCourse"
                          v-bind:value="course.IDCourse">{{ course.Title }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <input type="button" class="btn btn-outline-success btn-md" value="ADD" v-on:click="insertElement">&nbsp;&nbsp;&nbsp;
                <input type="button" class="btn btn-outline-secondary btn-md" value="BACK" v-on:click="back">
              </div>

              <br/>
              <div v-if="error[1].generalError" class="alert alert-danger" role="alert">{{
                  error[1].generalMsg
                }}
              </div>
              <div v-else-if="error[5].selectError" class="alert alert-danger" role="alert">{{
                  error[5].selectMsg
                }}
              </div>
            </form>
            <div v-if="addResult[0].addSuccess" class="alert alert-success" role="alert">
              {{ addResult[0].addMessage }}
            </div>
            <div v-else-if="addResult[1].addError" class="alert alert-danger" role="alert">{{
                addResult[1].addMessage
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "Modal",
  props: ['type'],
  data: () => ({
    title: "",
    mail: "",
    nameT: "",
    surname: "",
    idCourse: "",
    idTeacher: "",
    ausTeachers: [],
    ausCourses: [],
    ausTeaches: [],
    error: [
      {titleError: false, titleMsg: "Please enter a valid Title"},
      {generalError: false, generalMsg: ""},
      {mailError: false, mailMsg: "Please enter a valid Mail"},
      {nameError: false, nameMsg: "Please enter a valid Name"},
      {surnameError: false, surnameMsg: "Please enter a valid Surname"},
      {selectError: false, selectMsg: "Please select a valid Teacher and Course"},
    ],
    addResult: [
      {
        addMessage: "",
        addSuccess: false
      },
      {
        addError: false,
        addMessage: "Error while inserting"
      }
    ]
  }),
  mounted() {
    this.ausCourses = this.$parent.$data.courses;
    this.ausTeachers = this.$parent.$data.teachers;
    this.ausTeaches = this.$parent.$data.teaches;
  },
  methods: {
    onChangeTeacher(e) {
      this.idTeacher = e.target.value;

      this.$parent.getCourses();
      this.ausCourses = this.$parent.$data.courses;

      for(let i = 0; i < this.ausTeaches.length; i++){
        if(this.ausTeaches[i].IDTeacher == this.idTeacher) {
          //elimino il corso dai corsi che posso scegliere
          for(let j = 0; j < this.ausCourses.length; j++) {
            if(this.ausCourses[j].IDCourse == this.ausTeaches[i].IDCourse) {
              this.ausCourses.splice(j, 1);
              break;
            }
          }
        }
      }
    },
    onChangeCourse(e) {
      this.idCourse = e.target.value;

      this.$parent.getTeachers();
      this.ausTeachers = this.$parent.$data.teachers;

      for(let i = 0; i < this.ausTeaches.length; i++){
        if(this.ausTeaches[i].IDCourse == this.idCourse) {
          //elimino il professore dai professori che posso scegliere
          for(let j = 0; j < this.ausTeachers.length; j++) {
            if(this.ausTeachers[j].IDTeacher == this.ausTeaches[i].IDTeacher) {
              this.ausTeachers.splice(j, 1);
              break;
            }
          }
        }
      }
    },
    back() {
      this.$parent.$data.dialog = "";
    },
    insertElement() {
      this.error[0].titleError = false;
      this.error[1].genralError = false;
      this.error[2].mailError = false;
      this.error[3].nameError = false;
      this.error[4].surnameError = false;
      this.error[5].selectError = false;

      if (this.type === "course") {
        if (this.title !== '') {
          let ref = this;
          $.post({
            url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + localStorage.getItem("token"),
            dataType: 'json',
            data: {type: "addCourse", title: this.title, sessionToken: localStorage.getItem("token")},
            timeout: 5000
          })
              .done(function (results) {
                if (results.done) {
                  ref.title = "";
                  ref.$parent.getCourses();
                  ref.addResult[0].addSuccess = true;
                  ref.addResult[0].addMessage = "Course added successfully. Press back to return..."
                  setTimeout(function () {
                    ref.addResult[0].addSuccess = false;
                  }, 5000);
                } else {
                  errorHandling(results, ref);
                }
              })
              .fail(function (strError) {
                console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
                ref.$router.push("/");
              })
        }
      } else if (this.type === "teacher") {
        if (validateEmail(this.mail)) {
          if (this.nameT !== "") {
            if (this.surname !== "") {
              let ref = this;
              $.post({
                url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + localStorage.getItem("token"),
                dataType: 'json',
                data: {
                  type: "addTeacher",
                  mail: this.mail,
                  name: this.nameT,
                  surname: this.surname,
                  sessionToken: localStorage.getItem("token")
                },
                timeout: 5000
              })
                  .done(function (results) {
                    if (results.done) {
                      ref.mail = "";
                      ref.nameT = "";
                      ref.surname = "";
                      ref.$parent.getTeachers();
                      ref.addResult[0].addSuccess = true;
                      ref.addResult[0].addMessage = "Teacher added successfully. Press back to return..."
                      setTimeout(function () {
                        ref.addResult[0].addSuccess = false;
                      }, 5000);
                    } else {
                      errorHandling(results, ref);
                    }
                  })
                  .fail(function (strError) {
                    console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
                    ref.$router.push("/");
                  })
            } else this.error[4].surnameError = true;
          } else this.error[3].nameError = true;
        } else this.error[2].mailError = true;
      } else if (this.type === "teach") {
        if (this.idTeacher !== '' && this.idCourse !== '') {
          let ref = this;
          $.post({
            url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + localStorage.getItem("token"),
            dataType: 'json',
            data: {
              type: "addTeach",
              idTeacher: this.idTeacher,
              idCourse: this.idCourse,
              sessionToken: localStorage.getItem("token")
            },
            timeout: 5000
          })
              .done(function (results) {
                if (results.done) {
                  $("#idCourses").prop('selectedIndex', 0);
                  $("#idTeachers").prop('selectedIndex', 0);

                  ref.$parent.getTeaches();
                  ref.addResult[0].addSuccess = true;
                  ref.addResult[0].addMessage = "Teach added successfully. Press back to return..."
                  setTimeout(function () {
                    ref.addResult[0].addSuccess = false;
                  }, 5000);
                } else {
                  errorHandling(results, ref);
                }
              })
              .fail(function (strError) {
                console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
                ref.$router.push("/");
              })
        } else this.error[5].selectError = true;
      }
    }
  }
}

function validateEmail(user) {
  const emailPattern = new RegExp('^[a-zA-Z0-9._-]+@[a-z]+.+[a-z]+$');

  if (!emailPattern.test(String(user).toLowerCase()))
    return false;
  else
    return true;
}

function errorHandling(results, ref) {
  if (results.error == "no session") {
    localStorage.clear();

    ref.$parent.navSelected='home';
    localStorage.setItem("currentPath", "home");
    ref.$root.$children[0].user.account = "";
    ref.$root.$children[0].user.role = "";
    ref.$root.$children[0].user.sessionToken = "";

    ref.$router.push("/")
  } else {
    ref.addResult[1].addError = true;
    ref.addResult[1].addMessage = results.error;
    setTimeout(function () {
      ref.addResult[1].addError = false;
    }, 5000);
  }
}
</script>

<style scoped>
  #modal{padding-top:2%;}
</style>