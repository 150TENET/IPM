<script setup lang="ts">
defineProps({
  mostrar: Boolean,
  classeCaixa: { type: String, default: '' },
  fundoEscuro: { type: Boolean, default: false }
})

defineEmits(['fechar'])
</script>

<template>
  <Teleport to="body">
    <div v-if="mostrar" class="modal-overlay" @click.self="$emit('fechar')">
      <div class="modal-box" :class="classeCaixa">
        <button
          class="modal-close"
          :style="fundoEscuro ? 'color:white' : ''"
          @click="$emit('fechar')"
        >✕</button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>