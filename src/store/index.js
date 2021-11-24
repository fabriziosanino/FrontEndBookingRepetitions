import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true, //non permette di modificare i dati contenuti nello store(in state, nello specifico) se non attraverso una mutations!
  state: {
    products: [
      {name: 'Banana Skin', price: 20},
      {name: 'Shiny Star', price: 40},
      {name: 'Green Shells', price: 60},
      {name: 'Red Shells', price: 80}
    ]
  },

  getters:{
    salesProducts: state => { // applicato per ogni elemento in state
      var saleProducts = state.products.map(product => {
        return {name:"**"+product.name+"**", price:product.price/2}
      }); //prende l'array products nello store e, per ogni elemento(product), lo "sconta" alla metà
      
      return saleProducts;
     }
  },

  mutations:{ //NB. con l'estensione VueJS DevTools queste mutazioni possono essere debuggate
    reducePrice: (state, payload) => { // applicato per ogni elemento in state(dati dello store), riduco di un intero pari a quanto specificato dal payload parameter
        state.products.forEach(product => {
          product.price -= payload;
        });
    } 
  },

  actions:{
    reducePrice: (context, payload) => { //context mi rappresenta lo store | payload è un eventuale parametro che in questo caso specifica di quanto modificare il valore dei dati 
      setTimeout(function(){ //simulo un async task (es. chiamata al server)
        context.commit('reducePrice', payload); //mutation che vogliamo venga eseguita al RITORNO dall'async task (es. estrapolazione dati dal server)
      }, 2000);
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