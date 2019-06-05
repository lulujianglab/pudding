<template>
  <!-- <component class="flex-row" is="div" v-bind="data.attrs" v-on="listeners"> -->
  <component class="flex-row" is="div">
    <slot></slot>
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  }
}
</script>
