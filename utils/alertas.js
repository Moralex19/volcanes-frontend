// utils/alertas.js


// Alerta de éxito
export const alertaExito = () => {
  Swal.fire({
    title: '¡Éxito!',
    text: 'El formulario se envió correctamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar',
    customClass: {
        popup: 'popup-class',
        confirmButton: 'confirm-button' // Aplica una clase personalizada al botón
    },
    //grow: 'row',
    backdrop: true,
    timer: 4000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey:false,
    stopKeydownPropagation: true,
  });
}

// Alerta de error
export const alertaError = (mensaje) => {
  Swal.fire({
    title: 'Error',
    text: mensaje || 'Ocurrió un error inesperado.',
    icon: 'error',
    confirmButtonText: 'OK',
    
  });
}

// Alerta personalizada
export const alertaPersonalizada = (titulo, texto, icono) => {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    confirmButtonText: 'Aceptar'
  });
}

export const showAlertEmail = () => {
  Swal.fire({
    icon: 'warning',
    title: 'Correo electrónico no válido',
    text: 'Por favor, ingrese un correo electrónico válido.',
    confirmButtonText: 'O K',
    //showConfirmButton: false,
    customClass: {
        popup: 'popup-class',
        confirmButton: 'confirm-button' // Aplica una clase personalizada al botón
    },
    //grow: 'row',
    backdrop: true,
    timer: 3000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey:false,
    stopKeydownPropagation: true,
  });
};