<template>
    <nav-comp title="知识问答"></nav-comp>

    <div class="container-fluid">
        <div class="flex-space-between">
            <file-list-comp @selectFile="selectFile" ref="fileList"></file-list-comp>
            <div class="input-container ml-20">
                <div class="input-header">
                    <h3>题目区域</h3>
                </div>
                <div class="input-body flex-row">
                    <div class="qa-area">
                        <div class="question-area">
                            <div class="question-content" v-text="file.item.desc"></div>
                        </div>
                        <hr/>
                        <div class="answer-area">
                            <div class="btn btn-default">评估</div>
                            <div class="answer-content" v-text="file.item.answer"></div>
                        </div>
                    </div>
                    <div class="input-area">
                        <div class="input-header">回答区域</div>
                        <div class="input-body">
                            <div v-if="file.item.type === 'text'" class="input-item-text">
                                <textarea class="form-control" rows=5></textarea>
                            </div>
                            <div v-else-if="file.item.type === 'selectSingle'" class="input-item-select-single">
                                <label class="radio-inline">
                                    <input type="radio" name="select" id="inlineRadio1" value="A">
                                    <span v-text="file.item.option.A"></span>
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="select" id="inlineRadio2" value="B">
                                    <span v-text="file.item.option.B"></span>
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="select" id="inlineRadio3" value="C">
                                    <span v-text="file.item.option.C"></span>
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="select" id="inlineRadio3" value="D">
                                    <span v-text="file.item.option.D"></span>
                                </label>
                            </div>
                            <div v-else-if="file.item.type === 'selectMulti'" class="input-item-select-multi">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox1" value="true"> 对
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox2" value="false"> 错
                                </label>
                            </div>
                            <div v-else-if="file.item.type === 'judge'" class="input-item-judge">
                                <label class="radio-inline">
                                    <input type="radio" name="judge" value="true"> 对
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="judge" value="false"> 错
                                </label>
                            </div>
                            <div v-else></div>
                        </div>
                        <div class="input-footer">
                            <i class="glyphicon glyphicon-thumbs-up glyphicon-select"></i>
                            <i class="glyphicon glyphicon-thumbs-down"></i>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import NavComp from "@/components/NavComp.vue"
import FileListComp from "@/components/container_comp/FileListComp.vue"
import mock_data from "@/assets/configs/qa.json"

console.log(mock_data);

export default {
    name: "KnowledgeQA",
    components: {
        NavComp,
        FileListComp
    },
    data() {
        return {
            file: {
                list: mock_data,
                item: {}
            }
        }
    },
    created() {
        const _this = this;

        this.$nextTick(() => {
            _this.$refs.fileList.setFileList(_this.file.list);
        });
    },
    methods: {
        selectFile(fileItem) {
            this.file.item = fileItem;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/base.scss";

.qa-area {
    width: 75%;
    min-width: 850px;
    height: 450px;
    padding: 0 10px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.question-area {
    height: 300px;
    
    .question-content {
        width: 100%;
    }
}

.input-area {
    position: relative;
    width: 25%;
    min-width: 295px;
    padding: 0 10px;

    .input-header {
        height: 30px;
        line-height: 30px;
        font-weight: bold;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .input-body {
        margin-top: 20px;
        width: 100%;
        height: 350px;

        .input-item-text {

            textarea {
                resize: none;
            }
        }
    }

    .input-footer {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        bottom: 0;
        width: 100%;
        height: 50px;        
        border-top: 1px solid rgba(0, 0, 0, 0.1);

        .glyphicon {
            font-size: 24px;
            line-height: 50px;
        }

        .glyphicon-select {
            color: #f00;
        }
    }
}
</style>