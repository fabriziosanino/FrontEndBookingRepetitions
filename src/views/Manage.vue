<template>
  <div id="manage" class="manage" v-if="user.account !== ''">
    <section v-if="dialog==''">
      <div v-if="deleteResult[0].deleteSuccess" class="alert alert-success" role="alert">
        {{ deleteResult[0].deleteMessage }}
      </div>
      <div v-else-if="deleteResult[1].deleteError" class="alert alert-danger" role="alert">{{
          deleteResult[1].deleteError
        }}
      </div>
      <div style="margin: 5px;" class="card">
        <div class="card-body">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a v-bind:class="(selectedTab==='course')?'nav-item nav-link active':'nav-item nav-link'"
                 id="nav-course-tab" data-toggle="tab" v-on:click="setTab('course')">COURSES</a>
              <a v-bind:class="(selectedTab==='teacher')?'nav-item nav-link active':'nav-item nav-link'"
                 id="nav-teacher-tab" data-toggle="tab" v-on:click="setTab('teacher')">TEACHERS</a>
              <a v-bind:class="(selectedTab==='course-teacher')?'nav-item nav-link active':'nav-item nav-link'"
                 id="nav-teach-tab" data-toggle="tab" v-on:click="setTab('course-teacher')">TEACHES</a>
            </div>
          </nav>
          <br>
          <table class="table" v-if="selectedTab === 'course'">
            <thead>
            <tr>
              <th scope="col">IDCourse</th>
              <th scope="col">Title</th>
              <th scope="col">
                <input id="addCourse" class="btn btn-info btn-md" value="ADD NEW COURSE" v-on:click="dialog='course'">
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="course in courses" v-bind:key="course.IDCourse">
              <td>{{ course.IDCourse }}</td>
              <td>{{ course.Title }}</td>
              <td>
                <input id="deleteCourse" class="btn btn-info btn-md" value="DELETE"
                       v-on:click="deleteCourse(course.IDCourse)">
              </td>
            </tr>
            </tbody>
          </table>
          <table class="table" v-if="selectedTab === 'teacher'">
            <thead>
            <tr>
              <th scope="col">IDTeacher</th>
              <th scope="col">Mail</th>
              <th scope="col">Surname</th>
              <th scope="col">Name</th>
              <th scope="col">
                <input id="addTeacher" class="btn btn-info btn-md" value="ADD NEW TEACHER"
                       v-on:click="dialog='teacher'">
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="teacher in teachers" v-bind:key="teacher.IDTeacher">
              <td>{{ teacher.IDTeacher }}</td>
              <td>{{ teacher.Mail }}</td>
              <td>{{ teacher.Surname }}</td>
              <td>{{ teacher.Name }}</td>
              <td>
                <input id="deleteTeacher" class="btn btn-info btn-md" value="DELETE"
                       v-on:click="deleteTeacher(teacher.IDTeacher)">
              </td>
            </tr>
            </tbody>
          </table>
          <table class="table" v-if="selectedTab === 'course-teacher'">
            <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Name</th>
              <th scope="col">Surname</th>
              <th scope="col">
                <input id="addTeach" class="btn btn-info btn-md" value="ADD NEW TEACH" v-on:click="dialog='teach'">
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(teach, index) in teaches" v-bind:key="index">
              <td>{{ teach.Title }}</td>
              <td>{{ teach.Name }}</td>
              <td>{{ teach.Surname }}</td>
              <td>
                <input id="deleteTeach" class="btn btn-info btn-md" value="DELETE"
                       v-on:click="deleteTeach(teach.IDTeacher, teach.IDCourse)">
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <Modal :type="dialog" v-else></Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue'
import $ from "jquery";

export default {
  name: 'Manage',
  data: () => ({
    courses: [],
    teachers: [],
    teaches: [],
    selectedTab: "course",
    dialog: "",
    user: {
      sessionToken: "",
      account: "",
      role: ""
    },
    deleteResult: [
      {
        deleteMessage: "",
        deleteSuccess: false
      },
      {
        deleteError: false,
        deleteMessage: "Error while deleting"
      }
    ]
  }),
  components: {
    Modal
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    }
  },
  mounted: function () {
    //elements might not have been added to DOM yet
    this.dialog = "";
    this.$nextTick(() => {
      //definetely added

      this.user.account = localStorage.getItem("account");
      this.user.role = localStorage.getItem("role");
      this.user.sessionToken = localStorage.getItem("token");

      this.getCourses();
      this.getTeachers();  //serve per averli nelle modal
    });
  },
  methods: {
    setTab(type) {
      this.selectedTab = type;
      if (type == 'course')
        this.getCourses();
      else if (type == 'teacher')
        this.getTeachers();
      else if (type == 'course-teacher')
        this.getTeaches();
    },
    getCourses() {
      let ref = this;
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {type: "getCourses", sessionToken: this.user.sessionToken},
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              ref.courses = results.results;
            } else {
              if (results.error == "no session") {
                localStorage.clear();
                ref.user.account = "";
                ref.user.sessionToken = "";
                ref.user.role = "";
                this.$parent.checkSession();
              } else
                console.log("error: " + results.error);
            }
          })
          .fail(function (strError) {
            console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
          })
    },
    deleteCourse(idCourse) {
      let ref = this;
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {type: "deleteCourse", idCourse: idCourse, sessionToken: this.user.sessionToken},
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              for (let i = 0; i < ref.courses.length; i++) {
                if (ref.courses[i].IDCourse == idCourse)
                  ref.courses.splice(i, 1);
              }

              ref.deleteResult[0].deleteSuccess = true;
              ref.deleteResult[0].deleteMessage = "Course deleted successfully";
              setTimeout(function () {
                ref.deleteResult[0].deleteSuccess = false;
              }, 5000);
            } else {
              if (results.error == "no session") {
                localStorage.clear();
                ref.user.account = "";
                ref.user.sessionToken = "";
                ref.user.role = "";
                this.$parent.checkSession();
              } else {
                ref.deleteResult[1].deleteError = true;
                ref.deleteResult[1].deleteMessage += " " + results.error();
                setTimeout(function () {
                  ref.deleteResult[1].deleteError = false;
                }, 5000);
              }
            }
          })
          .fail(function (strError) {
            console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
          })
    },
    getTeachers() {
      let ref = this;
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {type: "getTeachers", sessionToken: this.user.sessionToken},
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              ref.teachers = results.results;
            } else if (results.error == "no session") {
              localStorage.clear();
              ref.user.account = "";
              ref.user.sessionToken = "";
              ref.user.role = "";
              this.$parent.checkSession();
            } else {
              console.log("error: " + results.error);
            }
          })
          .fail(function (strError) {
            console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
          })
    },
    deleteTeacher(idTeacher) {
      let ref = this;
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {type: "deleteTeacher", idTeacher: idTeacher, sessionToken: this.user.sessionToken},
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              for (let i = 0; i < ref.teachers.length; i++) {
                if (ref.teachers[i].IDTeacher == idTeacher)
                  ref.teachers.splice(i, 1);
              }

              ref.deleteResult[0].deleteSuccess = true;
              ref.deleteResult[0].deleteMessage = "Teacher deleted successfully";
              setTimeout(function () {
                ref.deleteResult[0].deleteSuccess = false;
              }, 5000);
            } else if (results.error == "no session") {
              localStorage.clear();
              ref.user.account = "";
              ref.user.sessionToken = "";
              ref.user.role = "";
              this.$parent.checkSession();
            } else {
              ref.deleteResult[1].deleteError = true;
              ref.deleteResult[1].deleteMessage += " " + results.error();
              setTimeout(function () {
                ref.deleteResult[1].deleteError = false;
              }, 5000);
            }
          })
          .fail(function (strError) {
            console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
          })
    },
    getTeaches() {
      let ref = this;
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {type: "getTeaches", sessionToken: this.user.sessionToken},
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              ref.teaches = results.results;
            } else if (results.error == "no session") {
              localStorage.clear();
              ref.user.account = "";
              ref.user.sessionToken = "";
              ref.user.role = "";
              this.$parent.checkSession();
            } else {
              console.log("error: " + results.error);
            }
          })
          .fail(function (strError) {
            console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
          })
    },
    deleteTeach(idTeacher, idCourse) {
      let ref = this;
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-managment-administrator;jsessionid=" + this.user.sessionToken,
        dataType: 'json',
        data: {
          type: "deleteTeach",
          idTeacher: idTeacher,
          idCourse: idCourse,
          sessionToken: this.user.sessionToken
        },
        timeout: 5000
      })
          .done(function (results) {
            if (results.done) {
              for (let i = 0; i < ref.teaches.length; i++) {
                if (ref.teaches[i].IDTeacher == idTeacher && ref.teaches[i].IDCourse == idCourse)
                  ref.teaches.splice(i, 1);
              }

              ref.deleteResult[0].deleteSuccess = true;
              ref.deleteResult[0].deleteMessage = "Teach deleted successfully";
              setTimeout(function () {
                ref.deleteResult[0].deleteSuccess = false;
              }, 5000);
            } else if (results.error == "no session") {
              localStorage.clear();
              ref.user.account = "";
              ref.user.sessionToken = "";
              ref.user.role = "";
              this.$parent.checkSession();
            } else {
              ref.deleteResult[1].deleteError = true;
              ref.deleteResult[1].deleteMessage += " " + results.error();
              setTimeout(function () {
                ref.deleteResult[1].deleteError = false;
              }, 5000);
            }
          })
          .fail(function (strError) {
            console.log("error: " + JSON.stringify(strError.status + ": " + strError.statusText));
          })
    }
  }
}
</script>

<style scoped>
  #nav-tab:hover{ cursor: pointer; }
</style>