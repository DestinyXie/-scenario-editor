<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <vue-tinymce
        ref="tinymce"
        v-model="content"
        :setting="setting">
    </vue-tinymce>
  </div>
</template>

<script>
import { TinymceSetting } from '@packy-tang/vue-tinymce';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
      return {
        content: '<p>html content</p>',
        setting: {
            ...TinymceSetting,
            height: 200,
            language_url: "langs/zh_CN.js",
            block_formats: "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;"
        }
      }
  },
  mounted () {
    const bm = this.$refs.tinymce.editor.selection.getBookmark();
    console.log(bm);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
