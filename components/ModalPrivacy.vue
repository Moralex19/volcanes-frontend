<template>
    <div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="privacyModalLabel">Aviso de Privacidad</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>AVISO DE PRIVACIDAD</h5>
            <h6>Última actualización: [Fecha]</h6>
            
            <h6>1. Información Recopilada</h6>
            <p>
              Recopilamos la siguiente información de nuestros usuarios:
            </p>
            <ul>
              <li>Información personal proporcionada por el usuario.</li>
              <li>Datos de uso del sitio/aplicación.</li>
              <li>Información de contacto.</li>
            </ul>
  
            <h6>2. Uso de la Información</h6>
            <p>
              La información recopilada se utiliza para:
            </p>
            <ul>
              <li>Proporcionar y mejorar nuestros servicios.</li>
              <li>Contactar a los usuarios con actualizaciones y promociones.</li>
              <li>Responder a consultas y brindar soporte.</li>
            </ul>
  
            <h6>3. Seguridad</h6>
            <p>
              Tomamos medidas razonables para proteger la información personal de los usuarios. Sin embargo, no 
              podemos garantizar la seguridad completa de la información transmitida a través de Internet.
            </p>
  
            <h6>4. Derechos del Usuario</h6>
            <p>
              Los usuarios tienen derecho a acceder, corregir y eliminar su información personal. Para ejercer estos 
              derechos, contáctanos en [Dirección de Correo Electrónico].
            </p>
  
            <h6>5. Cambios en el Aviso de Privacidad</h6>
            <p>
              Podemos actualizar este aviso de privacidad de vez en cuando. Las modificaciones se publicarán en esta 
              página y serán efectivas desde el momento de su publicación.
            </p>
  
            <h6>6. Contacto</h6>
            <p>
              Si tienes alguna pregunta sobre este aviso de privacidad, por favor contáctanos en [Dirección de Correo Electrónico].
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // No es necesario añadir lógica aquí para el modal.
  </script>
  
  <style scoped>
  .modal-body {
    color: #000000; /* Cambia el color del texto a negro para todo el cuerpo del modal */
  }
  
  .modal-body h5 {
    font-weight: bold;
    margin-bottom: 1em; /* Separación inferior para el título */
  }
  
  .modal-body h6 {
    font-weight: bold;
    margin-top: 1em;
  }
  
  .modal-body p, .modal-body ul {
    margin: 0.5em 0;
  }
  
  .modal-content {
    background-color: #ffffff; /* Color de fondo blanco para el modal */
  }
  </style>
  