<template lang="pug">
  ul.colors-list
    li.color-box(
      v-for="[colorName, colorValue] in colors"
      :key="colorValue" :class="{'active': activeColor === colorName}"
      :style="{backgroundColor: colorValue}"
      @click="$emit('change', [colorName, colorValue])"
    )
</template>

<script>
  export default {
    name: 'Colorpicker',
    props: {
      colors: {type: Array, default: () => []},
      activeColor: {type: String, default: "#000000"}
    }
  }
</script>

<style src="./Colorpicker.scss" lang="scss" scoped></style>
