<template>
  <!-- <component class="flex-col" v-bind="data.attrs" is="div" v-on="listeners"> -->
  <component class="flex-col" is="div">
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
