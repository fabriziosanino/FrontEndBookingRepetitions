<template>
  <div class="freeReservations">
    <section>
      <div style="margin: 5px;" class="card">
        <div class="card-body">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a class="nav-item nav-link active" id="nav-monday-tab" data-toggle="tab" href="#">ACTIVE</a>
              <a class="nav-item nav-link" id="nav-tuesday-tab" data-toggle="tab" href="#">CANCELLED</a>
              <a class="nav-item nav-link" id="nav-wednesday-tab" data-toggle="tab" href="#">DONE</a>
            </div>
          </nav>
          <br>
        </div>
      </div>
    </section>
    <br/><br/>
    <h4>Sto stampando dal componente FreeReservation chiamato da Home.vue estraendo i dati dallo STORE (attendi 2 secondi):</h4>
    <ul>
      <li v-for="(product, index) in products" :key="index"> <!-- products è la computed proprerty che è contenuta nello store -->
          <span class="name">{{ product.name }}</span>
          <span class="price">£{{ product.price }}</span>
      </li>
    </ul>

    <br/><br/>
    <h4>Prodotti scontati:</h4>
    <ul>
      <li v-for="(product, index) in saleProducts" :key="index"> <!-- products è la computed proprerty che è contenuta nello store -->
          <span class="name">{{ product.name }}</span>
          <span class="price">£{{ product.price }}</span>
      </li>
    </ul>
    <button @click="reducePrice(2)">reduce price</button>
  </div>
</template>

<script>

export default {
  name: 'FreeReservations',

  computed:{ //computed property: funzione trattata come un oggetto nel template che ricava dati dallo store
    
    products(){
      return this.$store.state.products;
    },

    saleProducts(){
      return this.$store.getters.salesProducts;
    }
    /* CALCOLO DELLO SCONTO SPOSTATO NEI GETTERS DELLO STORE..
    saleProducts(){
      var saleProducts = this.$store.state.products.map(product => {
        return {name:"**"+product.name+"**", price:product.price/2}
      }); //prende l'array products nello store e, per ogni elemento(product), lo "sconta" alla metà
      
      return saleProducts;
    }*/
  },

  methods:{
    reducePrice: function(saleReduction){
      //this.$store.commit('reducePrice'); //chiamata diretta alla mutations bypassata chiamando un action che simula un async task e committa poi lei la mutation

      this.$store.dispatch('reducePrice', saleReduction); //sconto il prezzo di quanto indicato dal parametro 
    }
  }
}
</script>