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
    <ul>
      <h4>Sto stampando dal componente FreeReservation chiamato da Home.vue passandomi questi dati:</h4>
      <li v-for="(product, index) in products" :key="index">
          <span class="name">{{ product.name }}</span>
          <span class="price">£{{ product.price }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FreeReservations',
  props: ['products'],
  data(){return{}}
}
</script>