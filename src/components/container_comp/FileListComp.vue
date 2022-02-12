<template>
    <div class="file-block">
        <h3 class="text-center">文件列表</h3>
        <hr/>
        <div class="func-area">
            <div class="form form-inline">
                <div class="form-group">
                    <label for="fileName">名称：</label>
                    <input v-model="search.name" type="text" class="form-control file-name-input" id="fileName" placeholder="检索的文件名称">
                    <i @click="searchFile" class="glyphicon glyphicon-search func-search"></i>
                </div>
            </div>
        </div>
        <hr/>
        <div @click="selectFileItem" id="fileList" class="file-list list-group">
            <div class="list-group-item file-item" v-for="(item, index) in file.search" :key=index :data-index="index">
                <div class="file-name" v-text="item.name"></div>
            </div>
        </div>
        <div class="file-footer">
            <b>当前文件数：</b>
            <span v-text="file.search.length"></span>&nbsp;&nbsp;
            <b>总文件数：</b>
            <span v-text="file.list.length"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: "FileList",
    emits: ["selectFile"],
    data() {
        return {
            search: {
                name: ""
            },
            file: {
                list: [],
                search: []
            }
        }
    },
    methods: {
        searchFile() {
            console.log(this.search.name);
            if (this.search.name == "") {
                this.file.search = this.file.list;
            } else {
                this.file.search = [];

                for (let idx = 0; idx < this.file.list.length; idx++) {
                    if (this.file.list[idx].name.indexOf(this.search.name) !== -1) {
                        this.file.search.push(this.file.list[idx]);
                    }
                }
            }
        },
        setFileList(fileList) {
            this.file.list = fileList;
            this.file.search = fileList;
        },
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
    position: relative;
    width: 300px;
    min-height: 550px;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.5);
    background-color: #fff;

    .func-area {
        width: 100%;
        height: 40px;

        .file-name-input {
            width: 200px;
        }

        .func-search {
            margin-left: 10px;
            cursor: pointer;
        }
    }

    .file-list {
        height: 300px;
        overflow: auto;

        .file-item {
            position: relative;
            width: 276px;
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

    .file-footer {
        height: 50px;
        line-height: 50px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

}
</style>