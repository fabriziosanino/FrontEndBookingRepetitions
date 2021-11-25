<template>
  <div id="modal">
    <div class="container">
      <div id="modal-row" class="row justify-content-center align-items-center">
        <div id="modal-column" style="border: #adacac 1px solid; padding: 5%;border-radius: 5%;" class="col-md-6">
          <div id="modal-box" class="col-md-12">
            <form v-if="type=='course'">
              <h1 class="text-center text-info" style="margin-bottom: 0!important;">Add a new Course</h1>
              <br>
              <div class="form-group">
                <label for="title" class="text-info">Title:</label><br>
                <input type="text" v-model="title" placeholder="Reti I" name="title" id="title" class="form-control"
                       required/>
              </div>
              <div class="form-group">
                <input type="button" value="ADD" v-on:click="insertElement">
                <input type="button" value="BACK" v-on:click="back">
              </div>

              <br/>
              <div v-if="error[0].titleError" class="alert alert-danger" role="alert">{{ error[0].titleMsg }}</div>
              <div v-else-if="error[1].generalError" class="alert alert-danger" role="alert">{{
                  error[1].generalMsg
                }}
              </div>
            </form>
            <form v-else-if="type=='teacher'">
              <h1 class="text-center text-info" style="margin-bottom: 0!important;">Add a new Teacher</h1>
              <br>
              <div class="form-group">
                <label for="title" class="text-info">Mail:</label><br>
                <input type="text" v-model="mail" placeholder="mario@unito.it" name="mail" id="mail" class="form-control"
                       required/>
                <label for="name" class="text-info">Name:</label><br>
                <input type="text" v-model="nameT" placeholder="mario" name="name" id="name" class="form-control"
                       required/>
                <label for="surname" class="text-info">Surname:</label><br>
                <input type="text" v-model="surname" placeholder="rossi" name="surname" id="surname" class="form-control"
                       required/>
              </div>
              <div class="form-group">
                <input type="button" value="ADD" v-on:click="insertElement">
                <input type="button" value="BACK" v-on:click="back">
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
            <form v-else-if="type=='teach'">
              <h1 class="text-center text-info" style="margin-bottom: 0!important;">Add a new Teach</h1>
              <br>
              <div class="form-group">
                <label>IDTeacher:</label>
                <select name="idTeachers" id="idTeachers" @change="onChangeTeacher($event)" >
                  <option v-for="teacher in this.$parent.$data.teachers" v-bind:key="teacher.IDTeacher" v-bind:value="teacher.IDTeacher">{{teacher.Name}} {{teacher.Surname}}</option>
                </select>
                <label>IDCourse:</label>
                <select name="idCourses" id="idCourses" @change="onChangeCourse($event)" >
                  <option v-for="course in this.$parent.$data.courses" v-bind:key="course.IDCourse" v-bind:value="course.IDCourse">{{course.Title}}</option>
                </select>
              </div>
              <div class="form-group">
                <input type="button" value="ADD" v-on:click="insertElement">
                <input type="button" value="BACK" v-on:click="back">
              </div>

              <br/>
              <div v-if="error[1].generalError" class="alert alert-danger" role="alert">{{
                  error[1].generalMsg
                }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    error: [
      {titleError: false, titleMsg: "Please enter a valid Title"},
      {generalError: false, generalMsg: ""},
      {mailError: false, mailMsg: "Please enter a valid Mail"},
      {nameError: false, nameMsg: "Please enter a valid Name"},
      {surnameError: false, surnameMsg: "Please enter a valid Surname"},
      {selectError: false, selectMsg: "Please select a valid Teacher or Course"},
    ]
  }),
  methods: {
    onChangeTeacher(e) {
      this.idTeacher = e.target.value;
    },
    onChangeCourse(e) {
      this.idCourse = e.target.value;
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

      if (this.type == "course") {
        if (this.title != '') {
          let ref = this;
          this.$store.dispatch('insertCourse', this.title).then(() => {
            ref.$parent.getCourses();
            ref.$parent.$data.dialog = "";
          })
        }
      } else if (this.type == "teacher") {
        if (validateEmail(this.mail)) {
          if(this.nameT != "") {
            if(this.surname != "") {
              let ref = this;
              this.$store.dispatch('insertTeacher', {
                mail: this.mail,
                name: this.nameT,
                surname: this.surname
              }).then(() => {
                ref.$parent.getTeachers();
                ref.$parent.$data.dialog = "";
              })
            } else this.error[4].surnameError = true;
          } else this.error[3].nameError = true;
        } else this.error[2].mailError = true;
      } else if (this.type == "teach") {
        if (this.idTeacher != '' && this.idCourse != '') {
          let ref = this;
          this.$store.dispatch('insertTeach', {idTeacher: this.idTeacher, idCourse: this.idCourse}).then(() => {
            ref.$parent.getTeaches();
            ref.$parent.$data.dialog = "";
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
</script>