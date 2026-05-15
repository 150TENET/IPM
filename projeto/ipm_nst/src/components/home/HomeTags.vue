<script setup lang="ts">
export type HomeTag = {
  label: string
  className: string
}

defineProps<{
  tags: HomeTag[]
}>()
</script>

<template>
  <div class="home-tags">
    <span v-for="tag in tags" :key="tag.label" class="tag" :class="tag.className">
      {{ tag.label }}
    </span>
  </div>
</template>

<style scoped>
.home-tags {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  max-width: 440px;
}

.tag {
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 16px rgba(20, 28, 55, 0.05);
}

.tag--green {
  background: #b8e6c4;
  color: #1a4a2e;
}

.tag--purple {
  background: #d4c9f0;
  color: #3a1a6e;
}

.tag--beige {
  background: #e8d8b0;
  color: #4a3010;
}

.tag--teal {
  background: #a8ddd8;
  color: #0a3a36;
}

.tag--salmon {
  background: #f0c4bc;
  color: #5a1a14;
}

.tag--white {
  background: #ffffff;
  color: #333;
}
</style>
