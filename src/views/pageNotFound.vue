<template>
  <main>
    <div id="header">
      <h1>Server Error</h1>
    </div>
    <div id="content">
      <div class="content-container">
        <fieldset>
          <h2>404 - File or directory not found.</h2>
          <h3>The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.</h3>
        </fieldset>
      </div>
    </div>
  </main>
</template>

<style scoped>
  body{font-size:.7em;font-family:Verdana, Arial, Helvetica, sans-serif;background:#EEEEEE;}
  fieldset{padding:0 15px 10px 15px;} 
  h1{font-size:2.4em;color:#FFF;}
  h2{font-size:1.7em;color:#CC0000;} 
  h3{font-size:1.2em;color:#000000;} 
  #header{width:100%;padding:6px 2% 6px 2%;font-family:"trebuchet MS", Verdana, sans-serif;color:#FFF;background-color:#555555;}
  #content{margin:0 0 0 2%;position:relative;}
  .content-container{background:#FFF;width:96%;margin-top:8px;padding:10px;position:relative;}
</style>