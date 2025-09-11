<template>
    <div class="container">
      <h2>Contacto</h2>
      <form>
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" class="form-control" id="name" placeholder="Ingresa tu nombre">
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" class="form-control" id="email" placeholder="Ingresa tu correo electrónico">
        </div>
        <div class="form-group">
          <label for="message">Mensaje</label>
          <textarea class="form-control" id="message" rows="3" placeholder="Tu mensaje"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </form>
    </div>
  </template>
  
  <style scoped>
  /* Ajusta los estilos específicos aquí si es necesario */
  </style>
  