<template>
  <div id="modal" class="modal">
    <h3 class="text-center">COURSE</h3>
    <div class="container">
      <div id="modal-row" class="row justify-content-center align-items-center">
        <div id="modal-column" style="border: #adacac 1px solid; padding: 5%;border-radius: 5%;" class="col-md-6">
          <div id="modal-box" class="col-md-12">
            <form id="modal-form" class="form">
              <h1 class="text-center text-info" style="margin-bottom: 0!important;">Add a new Course</h1>
              <div class="form-group">
                <label for="title" class="text-info">Title:</label><br>
                <input type="text" v-model="title" placeholder="Reti I" name="title" id="title" class="form-control"
                       required/>
              </div>
              <div class="form-group">
                <button v-on:click="insertElement()" id="btn-add" name="btn-add" class="btn btn-info btn-md">ADD
                </button>
              </div>

              <br/>
              <div v-if="error[0].titleError" class="alert alert-danger" role="alert">{{ error[0].titleMsg }}</div>
              <div v-else-if="error[1].generalError" class="alert alert-danger" role="alert">{{
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
    error: [
      {titleError: false, titleMsg: "Please enter a valid Title"},
      {generalError: false, generalMsg: ""}]
  }),
  methods: {
    insertElement() {
      if (this.type == "course") {
        if (this.title != '') {
          this.$store.dispatch('insertCourse', this.title).then(() => {
            alert("Corso aggiunto correttamente!");
          })
        }
      }
    }
  }
}
</script>