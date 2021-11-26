import Vue from 'vue'
import Vuex from 'vuex'
import $ from 'jquery';

Vue.use(Vuex)

//TODO:ogni volta che viene ritornato no session bisogna sloggare l'utente

export const store = new Vuex.Store({
  strict: true, //non permette di modificare i dati contenuti nello store(in state, nello specifico) se non attraverso una mutations!
  
  state: {
    user: {
      account: '',
      pwd: '',
      role: '',
      name: '',
      surname: '',
      sessionToken: ''
    },
    freeRepetitions: [
      {
        startTime: '16:00',
        coursesList: [
          {
            Title: '', 
            IDCourse: '', 
            teacherList:[
              {
                Surname: '',
                Name: '',
                IDTeacher: ''
              }
            ]
          }  
        ]
      }
    ]

  },

  getters:{
    getUser: state => {
      return state.user;
    },

    getFreeRepetitions: state => {
      return state.freeRepetitions;
    }

  },

    mutations: { //NB. con l'estensione VueJS DevTools queste mutazioni possono essere debuggate
    setFreeRepetitions: (state, payload) => {
        if(payload !== undefined){
          state.freeRepetitions = payload.map((item) => {
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
      }
  },
   
  actions: {
    getFreeRepetitions: (context, payload) => {
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-get-free-repetitions",
        dataType: 'json',
        data: {day: payload.selectedDay, account: payload.account},
        timeout: 5000
      })
      .done(function(results) { 
        if(results.done)
          context.commit('setFreeRepetitions',results.results);
      })
      .fail(function(strError) {
        console.log("error: "+JSON.stringify(strError.status + ": " + strError.statusText));
      });
    },
  }
});

/*
template  
export default new Vuex.Store({
  state: { //stato dell'applicazione, banalmente i DATI!!!!
  },
  getters:{ //sono dei getters come in java.. mi servono i prodotti scontati? ok calcolo il loro sconto e li ritorno al componente qualsiasi che me li ha chiesti
  },
  mutations: { //contiene tutti i metodi che vanno a modificare i dati contenuti nello state dello store
  },
  actions: { //permette di gestire async task: una volta eseguiti, come callback eseguiranno una mutazione sui dati con quanto ricavato dall'async task appena eseguito (es. reperimento dati da un server)
  },
  modules: { //utilizzato per dividere lo state in piu moduli (appunto), quando cresce troppo di dimensione. vedi documentazione ufficiale
  }
})

*/