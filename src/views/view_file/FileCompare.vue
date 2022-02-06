<template>
    <!-- <nav-input-comp></nav-input-comp> -->

    <div class="container-fluid">
        <div class="main-body">
            <file-list-comp @selectFile="selectFile" class="height-300" :fileList="file.list"></file-list-comp>
            <div class="compare-block">
                <div class="compare-wrapper">
                    <content-show-comp class="compare-content" name="左侧比对文件" :content="file.select.left"></content-show-comp>
                    <content-show-comp class="compare-content" name="右侧比对文件" :content="file.select.left"></content-show-comp>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import NavInputComp from "@/components/nav_comp/NavInputComp.vue"
import FileListComp from "@/components/container_comp/FileListComp.vue"
import ContentShowComp from "@/components/container_comp/ContentShowComp.vue"

export default {
    name: "fileCompare",
    components: {
        NavInputComp,
        FileListComp,
        ContentShowComp
    },
    data() {
        return {
            file: {
                list: [
                    {name: "测试"},
                    {name: "测试"},
                    {name: "测试"},
                    {name: "测试"},
                    {name: "测试"}
                ],
                select: {
                    left: {
                        type: "json",
                        name: "测试.json"
                    }
                }
            }
        }
    },
    methods: {
        selectFile(fileItem) {
            console.log(fileItem);
        }
    }
}
</script>

<style lang="scss" scoped>
.height-300 {
    height: 300px;
}

.main-body {
    display: flex;
    flex-direction: row;
}

.compare-block {
    width: 100%;
    height: 100%;
    margin-left: 10px;
}

.compare-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 1350px;
    height: 100%;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.5);
    background-color: #fff;

    .compare-content {
        width: 50%;
    }

    .compare-content:nth-child(1) {
        border-right: 1px dashed rgba(0, 0, 0, 0.1);
    }
}


</style>