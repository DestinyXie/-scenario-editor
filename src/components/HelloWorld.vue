<template>
  <div class="hello">
    <div class="editor-cont">
      <scenario-editor
        :scenes="scenes"
        @scenesSave="onScenesSave"
      ></scenario-editor>
    </div>
  </div>
</template>

<script>
import ScenarioEditor from "@/components/ScenarioEditor";
import tempData from '../assets/template'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
      return {
        scenes: tempData
      }
  },
  mounted () {
    // console.log(bm, data);
  },
  methods: {
    // 保存场景数据
    onScenesSave(scenes) {
      console.log('components scenes: ', scenes);
      alert('新数据：' + JSON.stringify(scenes));
    }
  },
  components: {
    "scenario-editor": ScenarioEditor
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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

.editor-cont {
  width: 1000px;
  margin: 0 auto;
  height: auto;
  max-height: 800px;
  min-height: 500px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);

}
</style>
