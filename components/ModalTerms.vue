<template>
    <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="termsModalLabel">Términos y Condiciones</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>TERMINOS Y CONDICIONES</h5>
            <h6>Última actualización: [Fecha]</h6>
            
            <h6>1. Aceptación de los Términos</h6>
            <p>
              Al acceder y usar [Nombre del Sitio/Aplicación], aceptas cumplir con estos Términos y Condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro sitio/aplicación.
            </p>
  
            <h6>2. Modificaciones a los Términos</h6>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones 
              se publicarán en esta página y se considerarán efectivas desde el momento de su publicación.
            </p>
  
            <h6>3. Uso del Sitio/Aplicación</h6>
            <p>
              Tienes permiso para usar nuestro sitio/aplicación solo para fines legales y de acuerdo con estos términos. 
              No puedes usar el sitio para:
            </p>
            <ul>
              <li>Realizar actividades ilegales o fraudulentas.</li>
              <li>Transmitir virus o cualquier código dañino.</li>
              <li>Recolectar o almacenar información personal de otros usuarios sin su consentimiento.</li>
            </ul>
  
            <h6>4. Propiedad Intelectual</h6>
            <p>
              Todo el contenido del sitio/aplicación, incluidos pero no limitados a textos, gráficos, logos, y software, 
              es propiedad de [Nombre de la Empresa] o de sus licenciantes y está protegido por leyes de propiedad intelectual.
            </p>
  
            <h6>5. Limitación de Responsabilidad</h6>
            <p>
              No seremos responsables por daños directos, indirectos, incidentales o consecuentes que resulten del uso o 
              la imposibilidad de usar el sitio/aplicación, incluso si se nos ha informado de la posibilidad de tales daños.
            </p>
  
            <h6>6. Enlaces a Sitios de Terceros</h6>
            <p>
              Nuestro sitio/aplicación puede contener enlaces a sitios web de terceros. No somos responsables del contenido 
              ni de las prácticas de privacidad de esos sitios.
            </p>
  
            <h6>7. Ley Aplicable</h6>
            <p>
              Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de [Jurisdicción].
            </p>
  
            <h6>8. Contacto</h6>
            <p>
              Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor contáctanos en [Dirección de Correo Electrónico].
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
  
  .modal-body h5, .modal-body h6, .modal-body p, .modal-body ul {
    color: #000000; /* Asegura que los encabezados y párrafos sean de color negro */
  }
  
  .modal-body h5 {
    font-weight: bold;
  }
  
  .modal-body h6 {
    font-weight: bold;
    margin-top: 1em;
  }
  
  .modal-body p, .modal-body ul {
    margin: 0.5em 0;
  }
  </style>
  