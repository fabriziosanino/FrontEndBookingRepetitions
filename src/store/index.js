import Vue from 'vue'
import Vuex from 'vuex'
import $ from 'jquery';

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true, //non permette di modificare i dati contenuti nello store(in state, nello specifico) se non attraverso una mutations!
  
  state: {
    products: [
      {name: 'Banana Skin', price: 20},
      {name: 'Shiny Star', price: 40},
      {name: 'Green Shells', price: 60},
      {name: 'Red Shells', price: 80}
    ],
    user: {
      account: '',
      pwd: '',
      role: '',
      name: '',
      surname: '',
      sessionToken: ''
    }
  },

  getters:{
    salesProducts: state => { // applicato per ogni elemento in state
      var saleProducts = state.products.map(product => {
        return {name:"**"+product.name+"**", price:product.price/2}
      }); //prende l'array products nello store e, per ogni elemento(product), lo "sconta" alla metà
      
      return saleProducts;
    },

    getUser: state => {
      return state.user;
    }

  },

  mutations:{ //NB. con l'estensione VueJS DevTools queste mutazioni possono essere debuggate
    reducePrice: (state, payload) => { // applicato per ogni elemento in state(dati dello store), riduco di un intero pari a quanto specificato dal payload parameter
        state.products.forEach(product => {
          product.price -= payload;
        });
    },

    setSessionToken: (state, payload) => {
      state.user.account = payload.account;
      state.user.name = payload.name;
      state.user.surname = payload.surname;
      state.user.role = payload.role;
      state.user.sessionToken = payload.token;
    }
  },

  actions:{
    reducePrice: (context, payload) => { //context mi rappresenta lo store | payload è un eventuale parametro che in questo caso specifica di quanto modificare il valore dei dati 
      setTimeout(function(){ //simulo un async task (es. chiamata al server)
        context.commit('reducePrice', payload); //mutation che vogliamo venga eseguita al RITORNO dall'async task (es. estrapolazione dati dal server)
      }, 2000);
    },

    loginUser: (context, payload) => {
      return new Promise((resolve, reject) => {
        $.post({
          url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-login",
          dataType: 'json',
          data: {account:payload.account, password:payload.pwd},
          timeout: 5000
        })
        .done(function(results) {
          if(results.done){
            context.commit('setSessionToken', results);
            resolve();
          }
          else{
            reject("Login failed. Please, try again!");
          }
        })
        .fail(function(strError) {
          console.log("error: "+JSON.stringify(strError.status + ": " + strError.statusText));
          reject(JSON.stringify(strError.status + ": " + strError.statusText));
        })

      })
    },
     
    checkSession: (context, payload) => {
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/ProvaAppAndroid_war_exploded/servlet-check-session",
        dataType: 'json',
        data: {sessionToken: payload},
        timeout: 5000
      })
      .done(function(results) { 
        if(results.done)
          context.commit("setSessionToken", results);
      })
      .fail(function(strError) {
        console.log("error: "+JSON.stringify(strError.status + ": " + strError.statusText));
      });	

    }
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