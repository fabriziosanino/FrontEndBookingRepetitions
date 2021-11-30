<template>
    <tbody id="freeRepetitionsList" v-if="dataLoaded">
      <tr v-for="(repetition, index) in freeRepetitions" :key="index">  
        <td><a>{{ repetition.startTime }} - {{ getEndTime(repetition.startTime) }}</a></td>
        <td>
          <div class="form-group">
            <select class="form-control" :id="'FormControlSub_'+index" @change="courseSelectedChangeListener($event)">
              <option selected value="-1">Choose a course...</option>
              <option v-for="(courseItem, index2) in freeRepetitions[index].coursesList" :key="index2" :value="courseItem.IDCourse+'_'+index2">{{ courseItem.Title }}</option>
            </select>
          </div>
        </td>
        <td>
          <div class="form-group" >
            <select :id="'FormControlTeacher_'+index" class="form-control hiddenTeacherList">
              <option selected value="-1">Choose a teacher...</option>
              <option v-for="(teacherItem, index3) in teachersOfSelectedCourse" :key="index3" :value="teacherItem.IDTeacher">{{ teacherItem.Surname }}</option>
            </select>
          </div>
        </td>
        <td >
          <input :id="'btnBookARepetition_'+index" v-if="userRole != 'Administrator'" class="btn btn-info btn-md" value="BOOK" @click="bookThisRepetitionListener($event)">
        </td>
      </tr>
      <tr v-if="freeRepetitions.length<=0"><td><div class="alert alert-warning" role="alert">No repetitions left on this day.</div></td></tr>
    </tbody>
</template>

<script>
  import $ from 'jquery';

  export default {
    name: 'FreeRepetitionsList',
    props: ['selectedDay'],
    watch: { 
      '$props':{
        handler: function (val) { 
          this.fetchFreeRepetitions(val.selectedDay);
        },
        deep: true
      }
    },
    data: () => {
      return{
        dataLoaded:false,
        courseSelected: false,
        freeRepetitions: [],
        teachersOfSelectedCourse: [],
        userRole: ""
      }
    },
    mounted: function () {
      this.dataLoaded = false;
      this.$parent.bookedResult[0].newResults = false;
      this.$parent.bookedResult[1].bookedError = false;
      this.$parent.bookedResult[2].bookedSuccess = false;

      this.userRole = localStorage.getItem("role");

      this.fetchFreeRepetitions(this.$props.selectedDay);
    },
    methods: {
      fetchFreeRepetitions: function(selectedDay) {
        let account = "";
        if(localStorage.getItem('token') != undefined)
          account = localStorage.getItem('account');

        var self = this;
        $.post({
          url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-get-free-repetitions",
          dataType: 'json',
          data: {day: selectedDay, account: account},
          timeout: 5000
        })
        .done((results) => { 
          if(results.done){
            self.setFreeRepetitions(self, results.results);
          
            self.dataLoaded = true;
            $('select[id^="FormControlSub"]').val(-1);
            $('select[id^="FormControlTeacher"]').addClass("hiddenTeacherList");
            $('select[id^="FormControlTeacher"]').val(-1);
          } else
            errorHandling(self, results);
        })
        .fail((strError) => {
          if(strError.statusText != 'error' && strError.status != 0)
            self.$parent.bookedResult[1].errorMsg = JSON.stringify(strError.status + ": " + strError.statusText);
          else {
            if(strError.status !== 0)
              self.$parent.bookedResult[1].errorMsg = "Database unavailable.";
            else
              self.$parent.bookedResult[1].errorMsg = "503: Server unavailable.";
          }
          self.$parent.bookedResult[0].newResults = true;
          self.$parent.bookedResult[1].bookedError = true;
        });
      },
      getEndTime: (startTime) => {
        var tmp = startTime.split(':');
        var endTime = parseInt(tmp[0])+1;
        return endTime + ":00";
      },
      setFreeRepetitions: (self, payload) => {
        if(payload !== undefined){
          self.freeRepetitions = payload.map((item) => {
            const freeRepetitionsItem = {};

            freeRepetitionsItem.startTime = item.startTime;
            if(item !== undefined){
              freeRepetitionsItem.coursesList = item.coursesList.map((courseItem) => {
                const coursesListItem = {};
      
                coursesListItem.IDCourse = courseItem.IDCourse;
                coursesListItem.Title = courseItem.Title;
                if(courseItem !== undefined){
                  coursesListItem.teachersList = courseItem.teachersList.map((teacherItem) => {
                    const teachersListItem = {};
        
                    teachersListItem.IDTeacher = teacherItem.IDTeacher;
                    teachersListItem.Surname = teacherItem.Surname;
                    teachersListItem.Name = teacherItem.Name;
        
                    return teachersListItem;
                  });
                }
                return coursesListItem;
              });
            }
            return freeRepetitionsItem;
          });
        }
      },
      courseSelectedChangeListener: function(event) {
        var callerID = event.currentTarget.id;
        var selectedOption = event.target.value;

        var tmp = callerID.split('_');
        var tmp2 = selectedOption.split('_');
        if($("#"+callerID).val() != -1){
          this.teachersOfSelectedCourse = this.freeRepetitions[tmp[1]].coursesList[tmp2[1]].teachersList.map((teacherItem) =>{
            {
              const teachersListItem = {};

              teachersListItem.IDTeacher = teacherItem.IDTeacher;
              teachersListItem.Surname = teacherItem.Surname;
              teachersListItem.Name = teacherItem.Name;
  
              return teachersListItem;
            }
          });
          $("#FormControlTeacher_"+tmp[1]).removeClass('hiddenTeacherList');
        }else{
          $("#FormControlTeacher_"+tmp[1]).addClass('hiddenTeacherList');
          this.teachersOfSelectedCourse = [];
       }
      },
      bookThisRepetitionListener: function(event){
        this.$parent.bookedResult[0].newResults = false;
        this.$parent.bookedResult[1].bookedError = false;
        this.$parent.bookedResult[2].bookedSuccess = false;

        var callerID = event.currentTarget.id;
        var tmp = callerID.split('_');

        var day = this.selectedDay;
        var startTime =  this.freeRepetitions[tmp[1]].startTime;
        var IDCourseJOINED = $("#FormControlSub_"+tmp[1]).val();
        var IDCourse = IDCourseJOINED.split('_')[0];
        var IDTeacher = $("#FormControlTeacher_"+tmp[1]).val();
        var account = localStorage.getItem('account');
        if(IDCourse != -1 && IDTeacher != -1 && account != null){
          let self = this;
          this.$parent.$data.loading = true;
          $.post({
            url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-book-a-repetition;jsessionid="+localStorage.getItem('token'),
            dataType: 'json',
            data: {day: day, startTime: startTime, IDCourse: IDCourse, IDTeacher:IDTeacher, account:account, sessionToken: localStorage.getItem('token')},
            timeout: 5000
          })
          .done((results) => { 
            if(results.done){
              self.$parent.bookedResult[0].newResults = true;
              self.$parent.bookedResult[2].bookedSuccess = true;
              
              self.dataLoaded=false;
              $("#FormControlSub_"+tmp[1]).val(-1);
              $("#FormControlTeacher_"+tmp[1]).val(-1);
              $("#FormControlTeacher_"+tmp[1]).addClass("hiddenTeacherList");
              self.fetchFreeRepetitions(this.$props.selectedDay);
              self.dataLoaded=true;

              self.$parent.$data.loading = false;
            }else{
              errorHandling(self, results);
            }
          })
          .fail((strError) => {
            self.$parent.bookedResult[0].newResults = true;
            self.$parent.bookedResult[1].bookedError = true;
            self.$parent.bookedResult[1].errorMsg = JSON.stringify(strError.status + ": " + strError.statusText);
          });
        }else{
          if(account === null){
            this.$parent.bookedResult[0].newResults = true;
            this.$parent.bookedResult[1].bookedError = true;
            this.$parent.bookedResult[1].errorMsg = "Please Sign In to book a repetition";
          }else{
            this.$parent.bookedResult[0].newResults = true;
            this.$parent.bookedResult[1].bookedError = true;
            this.$parent.bookedResult[1].errorMsg = "Please select a Course and a Teacher, then try again.";
          }
        }
      }
    }
  };

  function errorHandling(ref, results) {
    if (results.error === "no session") {
      localStorage.clear();

      ref.$root.$children[0].user.account = "";
      ref.$root.$children[0].user.role = "";
      ref.$root.$children[0].user.sessionToken = "";

      ref.$router.push("/")
    } else {
      ref.$parent.bookedResult[0].newResults = true;
      ref.$parent.bookedResult[1].bookedError = true;
      ref.$parent.bookedResult[1].errorMsg = results.error;
    }
  }

</script>

<style scoped>
  .hiddenTeacherList{
    visibility: hidden;
  }



  td{
    vertical-align: middle!important;
    padding: 1rem!important;
  }

  .form-group{
    margin: 0!important;
  }
</style>