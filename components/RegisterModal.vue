<template>
    <div v-if="show" class="modal fade show d-block" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" :style="modalStyle">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Registro</h5>
            <button type="button" class="btn-close" @click="closeModal" :style="closeButtonStyle" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <!-- Formulario de registro -->
              <div class="mb-3">
                <label for="fullName" class="form-label">Nombre Completo</label>
                <input type="text" class="form-control" id="fullName" v-model="form.fullName" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" id="email" v-model="form.email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" v-model="form.password" required>
              </div>
              <div class="mb-3">
                <label for="gender" class="form-label">Sexo</label>
                <select class="form-control" id="gender" v-model="form.gender" required>
                  <option value="">Selecciona una opción</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Teléfono</label>
                <input type="tel" class="form-control" id="phone" v-model="form.phone" required>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="terms" v-model="form.terms" required>
                <label class="form-check-label" for="terms">He leído y acepto los términos y condiciones</label>
              </div>
              <button type="submit" class="btn btn-primary">Registrarse</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        form: {
          fullName: '',
          email: '',
          password: '',
          gender: '',
          phone: '',
          terms: false,
        },
      };
    },
    methods: {
      closeModal() {
        this.$emit('update:show', false);
      },
      handleSubmit() {
        // Aquí puedes manejar el envío del formulario
        console.log(this.form);
        this.closeModal();
      },
    },
    computed: {
      modalStyle() {
        return {
          zIndex: 1050,
        };
      },
      closeButtonStyle() {
        return {
          zIndex: 1051,
        };
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para el modal */
  .modal-backdrop {
    opacity: 0.8;
  }
  </style>
  