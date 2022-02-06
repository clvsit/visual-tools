<template>
    <div class="file-block">
        <h3 class="text-center">文件列表</h3>
        <hr/>
        <div @click="selectFileItem" class="file-list list-group">
            <div class="list-group-item file-item" v-for="(item, index) in fileList" :key=index :data-index="index">
                <div class="file-name" v-text="item.name"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "FileList",
    emits: ["selectFile"],
    props: ["fileList"],
    methods: {
        selectFileItem(event) {
            const $fileItem = $(event.target).parents(".file-item"),
                index = $fileItem.data("index");

            $fileItem.addClass("file-item-selected")
                .siblings().removeClass("file-item-selected");
            
            if (index !== undefined) {                
                this.$emit("selectFile", this.fileList[index]);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.file-block {
    width: 300px;
    height: 100%;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.5);
    background-color: #fff;

    .file-list {
        height: 790px;
        overflow: auto;

        .file-item {
            position: relative;
            width: 100%;
            min-width: 280px;
            height: 40px;
            cursor: pointer;
            transition: all 0.5s ease-in-out;

            .file-name {
                width: 80%;
                min-width: 240px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .file-item:hover {
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
        }

        .file-item-selected {
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
        }
    }

    .file-list::-webkit-scrollbar {
        width: 4px;
    }

    .file-list::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(0,0,0,0.2);
    }

    .file-list::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(0,0,0,0.1);
    }

}
</style>