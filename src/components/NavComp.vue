<template>
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="navbar-title" v-text="title"></div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  padding-right: 20px;
  box-shadow: 0 3px 5px 3px rgba(0, 0, 0, 0.3);

  .navbar-title {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.25s linear;
  }

  .navbar-title:hover {
    text-shadow: 0 0 2px #000;
  }
}
</style>

<script>
export default {
  name: "navBasic",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>