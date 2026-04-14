<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function entrar() {
  router.push('/')
}
</script>

<template>
  <div class="entrar-fundo">
    <div class="entrar-cartao">
      <img src="@/assets/eu.jpg" alt="Bandeira da União Europeia" class="entrar-logo">
      <h1 class="entrar-titulo">União Europeia</h1>
      <p class="entrar-subtitulo">Plano de Recuperação e Resiliência</p>

      <button class="entrar-btn" @click="entrar">Entrar</button>

      <p class="entrar-bemvindo">Bem-vindo</p>
    </div>
  </div>
</template>

<style scoped>
.entrar-fundo {
  min-height: 100vh;
  background: #d4d4d4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.entrar-cartao {
  background: #b3b8e8;
  border-radius: 16px;
  width: 380px;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 32px;
}

.entrar-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
}

.entrar-titulo {
  font-family: 'Anek Latin', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #e8eaf6;
  margin: 0 0 6px 0;
  text-align: center;
}

.entrar-subtitulo {
  font-family: 'Anek Latin', sans-serif;
  font-size: 14px;
  color: #c5c8e0;
  margin: 0 0 80px 0;
  text-align: center;
}

.entrar-btn {
  width: 100%;
  padding: 14px;
  background: #4a5a96;
  color: #d0d4f0;
  border: none;
  border-radius: 8px;
  font-family: 'Anek Latin', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: auto;
}

.entrar-btn:hover {
  background: #7a85b8;
  color: #eef0f8;
}

.entrar-bemvindo {
  font-family: 'Anek Latin', sans-serif;
  font-size: 15px;
  color: #7a80a8;
  margin: 40px 0 0 0;
  text-align: center;
}
</style>