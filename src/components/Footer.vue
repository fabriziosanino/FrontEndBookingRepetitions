<template>
  <footer>
    <p>Copyright &copy; {{new Date().getFullYear()}} Giacomo, Nicole e Fabrizio</p>
  </footer>
</template>

<script>
export default {
  name: "Footer"
}
</script>


<style>
footer{
  text-align: center;
  font-size: 8pt;
  width: -webkit-fill-available;
  position:fixed;
  margin-top:  10mm;
  bottom:0;
  background-color: white;
  padding-top: 4mm;
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.15);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.15);
  box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.15);
}
</style>