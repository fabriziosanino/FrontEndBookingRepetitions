<template>
    <tbody id="freeRepetitionsList" v-if="dataLoaded">
      <tr v-for="(repetition, index) in freeRepetitions" :key="index">  
        <td>{{ repetition.startTime }} - {{ getEndTime(repetition.startTime) }}</td>
        <td>
          <div class="form-group">
            <select class="form-control" id="FormControlSub">
              <option value="-1">Choose a course...</option>
              <option v-for="(courseItem, index2) in freeRepetitions[index].coursesList" :key="index2" :value="courseItem.IDCourse">{{ courseItem.Title }}</option>
            </select>
          </div>
        </td>
        <td>
          <div class="form-group">
            <select class="form-control" id="FormControlTeacher">
              <option value="-1">Choose a teacher...</option>
              <option v-for="(teacherItem, index3) in freeRepetitions[index].coursesList[index]" :key="index3" :value="teacherItem.IDTeacher">{{ teacherItem.Surname }}</option>
            </select>
          </div>
        </td>
        <td >
          <input id="log" class="btn btn-info btn-md" value="BOOK">
        </td>
      </tr>
    </tbody>
</template>

<script>
  export default {
      name: 'FreeRepetitionsList',
      props: {selectedDay: String},
      data: () => {
        return{
          dataLoaded:false
      
        }
      },
      mounted: function () {
        this.dataLoaded = false;
        var userStored = this.$store.getters.user;
        if(userStored != undefined)
          this.$store.dispatch('getFreeRepetitions', {account: userStored.account, selectedDay: this.selectedDay}).then( () => {this.dataLoaded=true;});
        else
          this.$store.dispatch('getFreeRepetitions', {account: '', selectedDay: this.selectedDay}).then(() => {this.dataLoaded=true;});
      },
      computed: {
        freeRepetitions(){
          return this.$store.getters.getFreeRepetitions;
        }
      },
      methods: {
        getEndTime: (startTime) => {
          var tmp = startTime.split(':');
          var endTime = parseInt(tmp[0])+1;
          return endTime + ":00";
        }
      }
  };
</script>

<style scoped>
  .hiddenTeacherList{
    visibility: hidden;
  }

  .visibleTeacherList{
    visibility: visible;
  }
</style>