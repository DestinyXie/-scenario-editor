<template>
    <div :id="wrapperId" class="wrapper">
        <div class="menu">
            <el-dropdown size="mini" split-button @command="handleCommand">
                编辑
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="createNewScene">创建场景(shift+option/alt+s)</el-dropdown-item>
                    <el-dropdown-item command="createNewBlockDesc">创建描述(shift+option/alt+d)</el-dropdown-item>
                    <el-dropdown-item command="createNewBlockTalk">创建对白(shift+option/alt+t)</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
        </div>
        <div class="toolbar">
            <div class="item active desc">
                描述
            </div>
            <div class="item other">
                其他
            </div>

            <span class="save" @click="save">保存</span>
        </div>
        <div class="content">
            <div class="scene-item" v-for="(scene, idx) in scenes">
                <div class="scene-title" @click="selectScene(scene.num)" @select="selectScene(scene.num)">
                    {{scene.num}}.
                    <span class="name">
                        <el-input size="small" v-model="scene.locationDisplayName.main" placeholder="(场景名称)" @keyup="titleKey"></el-input>
                    </span>
                    - 
                        <el-select class="littleSelect" size="small" v-model="scene.terior" placeholder="(内/外)" @keyup="titleKey">
                            <el-option
                            v-for="item in teriorOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    - 
                    <el-select class="littleSelect" size="small" v-model="scene.atmosphere" placeholder="(昼/夜/晨/昏)" @keyup.enter.native="evt => titleKey(evt, scene)">
                            <el-option
                            v-for="item in atmosphereOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                </div>
                <!-- 当前场景展开，非当前场景只显示标题 -->
                <div class="scene-blocks" v-if="curIndex == scene.num">
                        <div class="block-item" v-for="(block, index) in scene.blocks" :class="2 == block.type * 1 ? 'desc-block': 'talk-block'">
                            <div v-if="2 == block.type * 1">{{ block.content }}</div>
                            <div v-else class="talk-wrapper">
                                <span class="name">
                                    <el-input size="small" v-model="block.spokesman" placeholder="(角色)"></el-input>
                                </span>
                                <span class="colon">:</span>
                                <div class="talk">
                                    <vue-tinymce
                                        ref="tinymce"
                                        v-model="block.content"
                                        :setting="setting">
                                    </vue-tinymce>
                                </div>
                            </div>
                        </div>
                        <!-- 占位符输入框 -->
                        <div class="block-item temp-block-item">
                            <div v-if="2 == tempType * 1">{{ tempContent }}</div>
                            <div v-else class="talk-wrapper">
                                <span class="name">
                                    <el-input size="small" v-model="tempSpokeman" placeholder="(角色)"></el-input>
                                </span>
                                <span class="colon">:</span>
                                <div class="talk">
                                    <vue-tinymce
                                        ref="tinymce"
                                        v-model="tempContent"
                                        :setting="setting">
                                    </vue-tinymce>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
      </div>
    </div>
</template>

<script>
import { TinymceSetting } from '@packy-tang/vue-tinymce';
export default {
    props: {
        wrapperId: {
            type: String,
            default: 'editorWrapper'
        },
        scenes: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            // 编辑器配置
            setting: {
                ...TinymceSetting,
                // height: "auto",
                toolbar: false,
                toolbar: 'undo redo | bold italic underline',
                // plugins: [ 'quickbars' ],
                // quickbars_insert_toolbar: 'undo redo',
                // quickbars_selection_toolbar: 'italic underline',
                menubar: false,
                inline: true,
                language_url: "langs/zh_CN.js"
            },
            curIndex: 1, // 当前场景序号
            tempType: '1', // 新增内容类型
            tempSpokeman: '', // 新增角色名
            tempContent: '', // 新增编辑内容
            // 内外选项
            teriorOptions: [
                {
                    value: '内',
                    lable: '内'
                },
                {
                    value: '外',
                    lable: '外'
                },
                {
                    value: '(内/外)',
                    lable: '(内/外)'
                },
                {
                    value: '(外/内)',
                    lable: '(外/内)'
                }
            ],
            // 昼夜选项
            atmosphereOptions: [
                {
                    value: '日',
                    lable: '日'
                },
                {
                    value: '夜',
                    lable: '夜'
                },
                {
                    value: '日出',
                    lable: '日出'
                },
                {
                    value: '上午',
                    lable: '上午'
                },
                {
                    value: '下午',
                    lable: '下午'
                },
                {
                    value: '旁晚',
                    lable: '旁晚'
                },
                {
                    value: '日落',
                    lable: '日落'
                },
            ],
            // 空场景模版
            emptyScene: {
                // "num": 1,
                "no":"",
                "atmosphere": "", 
                "terior": "", 
                "files": [],
                "project_id": "",
                "episode_id": "",
                "location": "",
                "locationDisplayName": { 
                    "main": "",
                    "sub": ""
                },
                "blocks": []
            },
            // 空描述/对白模版
            emptyBlock: {
                "type": "1", 
                "content": "", 
                "spokesman": "",
                "rows": 10,
                "words": 0
            }
        }
    },
    mounted() {
        // 设置快捷键
        document.onkeydown = evt => {
            // shift + alt 触发快捷键
            console.log('onkeydown: ', evt.shiftKey, evt.altKey, evt.keyCode);
            if (evt.shiftKey && evt.altKey) {
                switch (evt.keyCode) {
                    case 83:
                        this.createNewScene();
                        break;
                    case 68:
                        this.createNewBlockDesc();
                        break;
                    case 65:
                        this.createNewBlockTalk();
                        break;
                }
            }
        }
    },
    beforeDestroy() {

    },
    methods: {
        handleCommand(command) {
            switch (command) {
                case 'createNewScene':
                    this.createNewScene();
                    break;
                case 'createNewBlockDesc':
                    this.createNewBlockDesc();
                    break;
                case 'createNewBlockTalk':
                    this.createNewBlockTalk();
                    break;
            }
        },
        createNewScene() {
            console.log('type: createNewScene');
            var newScene = JSON.parse(JSON.stringify(this.emptyScene))
            newScene.num = this.scenes.length + 1;
            this.scenes.push(newScene);
        },
        createNewBlockDesc() {
            console.log('type: createNewBlockDesc');
            alert('TODO: 创建描述');
        },
        createNewBlockTalk() {
            console.log('type: createNewBlockTalk');
            alert('TODO: 创建对话');
        },
        // 快捷
        titleKey(evt) {
        },
        spokesmanKey(evt) {

        },
        // 选中场景序号
        selectScene(idx) {
            this.curIndex = idx;
        },
        save() {
            console.log('new scenes: ', this.scenes);
            this.$emit('scenesSave', this.scenes);
        }
    }
}
</script>

<style lang="less">
.wrapper {
    width: 100%;
    height: 100%;
    .menu {
        height: 40px;
        line-height: 40px;
        background: rgba(0, 0, 0, 0.05);
        padding: 0 10px;
        text-align: left;
    }
    .toolbar {
        position: relative;
        height: 70px;
        padding: 0 200px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        .item {
            float: left;
            width: 50px;
            margin: 0 20px;
            line-height: 30px;
            padding: 40px 0 0;
            border-bottom: 2px solid transparent;
            color: #8a8a8a;
            cursor: pointer;
            &.desc {
                background: url(../assets/desc.png) no-repeat center 10px;
                background-size: 32px 32px;
                &.active {
                    background-image: url(../assets/desc-s.png);
                }
            }
            &.other {
                background: url(../assets/quot.png) no-repeat center 10px;
                background-size: 32px 32px;
            }
            &.active {
                color: #f46449;
                border-bottom-color: #f46449;
            }
        }
        .save {
            position: absolute;
            color: #fff;
            border-radius: 5px;
            top: 20px;
            height: 30px;
            line-height: 30px;
            width: 60px;
            right: 10px;
            background: #f46449 url(../assets/save.png) no-repeat 10px center;
            background-size: 16px 16px;
            padding-left: 15px;
            cursor: pointer;
            transition: all 100ms;
            &:hover {
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
            }
        }
    }
    .content {
        padding: 10px;
        text-align: left;

        .name {
            display: inline-block;
            width: 100px;
            input {
                border: 0;
                padding-left: 10px;
                padding-right: 0;
                text-align: left;
                background: transparent;
                &:focus {
                    background: #fff;
                }
            }
        }

        .block-item {
            .name {
                width: 80px;
            }
            .talk-wrapper {
                overflow: hidden;
                zoom: 1;
                line-height: 30px;
                .name, .colon, .talk {
                    float: left;
                }
                .name input:focus {
                    outline: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 0 0 3px rgba(0, 0, 0, 0.05) inset;
                }
                .colon {
                    width: 20px;
                    text-align: center;
                }
                .talk {
                    width: 830px;
                    * {
                        margin: 0;
                        // line-height: 24px;
                    }
                    .mce-content-body {
                        padding: 5px;
                        &.mce-edit-focus {
                            outline: 1px solid rgba(0, 0, 0, 0.1);
                            box-shadow: 0 0 3px rgba(0, 0, 0, 0.05) inset;
                        }
                    }
                }
            } 
        }

        .scene-title {
            padding: 5px;
            background: rgba(0, 0, 0, 0.05);
            margin-top: 5px;
            .littleSelect {
                width: 80px;
                text-align: center;
                input {
                    text-align: center;
                    border: 0;
                    padding-left: 0;
                    padding-right: 0;
                    background: transparent;
                    &:focus {
                        background: #fff;
                    }
                }
                span {
                    display: none;
                }
            }
        }
        
        .scene-blocks {
            padding: 5px 0 5px 50px;
        }
    }
}
</style>