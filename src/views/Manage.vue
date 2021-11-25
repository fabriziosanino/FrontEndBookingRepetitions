<template>
  <div id="manage" class="mange">
    <section>
      <div style="margin: 5px;" class="card">
        <div class="card-body">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a class="nav-item nav-link active" id="nav-monday-tab" data-toggle="tab" v-on:click="setTab('course')">COURSES</a>
              <a class="nav-item nav-link" id="nav-tuesday-tab" data-toggle="tab" v-on:click="setTab('teacher')">TEACHERS</a>
              <a class="nav-item nav-link" id="nav-wednesday-tab" data-toggle="tab" v-on:click="setTab('course-teacher')">COURSE - TEACHERS</a>
            </div>
          </nav>
          <br>
          <table class="table" v-if="selectedTab === 'course'">
            <thead>
            <tr>
              <th scope="col">IDCourse</th>
              <th scope="col">Title</th>
              <th scope="col"></th>
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
              <th scope="col"></th>
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
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'Manage',
    data: () => ({
      courses: [],
      teachers: [],
      selectedTab: "course"
    }),
    mounted: function(){
      //elements might not have been added to DOM yet
      this.$nextTick(() => {
        //definetely added
        this.getCourses();
      });
    },
    methods: {
      setTab(type){
        this.selectedTab = type;
        if(type == 'course')
          this.getCourses();
        else if(type == 'teacher')
          this.getTeachers();
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
            if(this.teachers[i].IDCourse == idTeacher)
              this.teachers.splice(i, 1);
          }
          alert("Professore eliminato correttamente!");
        })
      }
    }
  }
</script>

