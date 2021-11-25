<template>
  <div id="manage" class="manage" v-if="getUser.account !== ''">
    <section v-if="dialog==''">
      <div style="margin: 5px;" class="card">
        <div class="card-body">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a v-bind:class = "(selectedTab==='course')?'nav-item nav-link active':'nav-item nav-link'" id="nav-course-tab" data-toggle="tab" v-on:click="setTab('course')">COURSES</a>
              <a v-bind:class = "(selectedTab==='teacher')?'nav-item nav-link active':'nav-item nav-link'" id="nav-teacher-tab" data-toggle="tab" v-on:click="setTab('teacher')">TEACHERS</a>
              <a v-bind:class = "(selectedTab==='course-teacher')?'nav-item nav-link active':'nav-item nav-link'" id="nav-teach-tab" data-toggle="tab" v-on:click="setTab('course-teacher')">TEACHES</a>
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
              <td>{{ course.Title}}</td>
              <td >
                <input id="deleteCourse" class="btn btn-info btn-md" value="DELETE" v-on:click="deleteCourse(course.IDCourse)">
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
                <input id="addTeacher" class="btn btn-info btn-md" value="ADD NEW TEACHER" v-on:click="dialog='teacher'">
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="teacher in teachers" v-bind:key="teacher.IDTeacher">
              <td>{{ teacher.IDTeacher }}</td>
              <td>{{ teacher.Mail}}</td>
              <td>{{ teacher.Surname}}</td>
              <td>{{ teacher.Name}}</td>
              <td >
                <input id="deleteTeacher" class="btn btn-info btn-md" value="DELETE" v-on:click="deleteTeacher(teacher.IDTeacher)">
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
              <td>{{ teach.Name}}</td>
              <td>{{ teach.Surname}}</td>
              <td >
                <input id="deleteTeach" class="btn btn-info btn-md" value="DELETE" v-on:click="deleteTeach(teach.IDTeacher, teach.IDCourse)">
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
  export default {
    name: 'Manage',
    data: () => ({
      courses: [],
      teachers: [],
      teaches: [],
      selectedTab: "course",
      dialog:"",
    }),
    components: {
      Modal
    },
    computed: {
      getUser(){
        return this.$store.getters.getUser;
      }
    },
    mounted: function(){
      //elements might not have been added to DOM yet
      this.$nextTick(() => {
        //definetely added
        this.getCourses();
        this.getTeachers();  //serve per averli nelle modal
      });
    },
    methods: {
      setTab(type){
        this.selectedTab = type;
        if(type == 'course')
          this.getCourses();
        else if(type == 'teacher')
          this.getTeachers();
        else if(type == 'course-teacher')
          this.getTeaches();
      },
      getCourses(){
        this.$store.dispatch('getCourses').then((results) => {
          this.courses = results;
        })
      },
      deleteCourse(idCourse){
        this.$store.dispatch('deleteCourse', idCourse).then(() => {
          for(let i = 0; i < this.courses.length; i++){
            if(this.courses[i].IDCourse == idCourse)
              this.courses.splice(i, 1);
          }
          alert("Corso eliminato correttamente!");
        })
      },
      getTeachers(){
        this.$store.dispatch('getTeachers').then((results) => {
          this.teachers = results;
        })
      },
      deleteTeacher(idTeacher){
        this.$store.dispatch('deleteTeacher', idTeacher).then(() => {
          for(let i = 0; i < this.teachers.length; i++){
            if(this.teachers[i].IDTeacher == idTeacher)
              this.teachers.splice(i, 1);
          }
          alert("Professore eliminato correttamente!");
        })
      },
      getTeaches(){
        this.$store.dispatch('getTeaches').then((results) => {
          this.teaches = results;
        })
      },
      deleteTeach(idTeacher, idCourse){
        let teachToDelete = {idTeacher: idTeacher, idCourse: idCourse};
        this.$store.dispatch('deleteTeach', teachToDelete).then(() => {
          for(let i = 0; i < this.teaches.length; i++){
            if(this.teaches[i].IDTeacher == idTeacher && this.teaches[i].IDCourse == idCourse)
              this.teaches.splice(i, 1);
          }
          alert("Professore - Corso eliminato correttamente!");
        })
      }
    }
  }
</script>

