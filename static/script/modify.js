new Vue({
    el: "#app",
    data: {
        input: {
            // filename: "version_2/output/para/model_output_v1_2000_bio_check.jsonl",
            filename: "test.jsonl",
            fileSelect: "",
            start: 0,
            total: 0,
            uid: ""
        },
        file: {
            isExisted: false,
            status: "close"
        },
        alert: {
            isShow: false,
            type: "alert-success",
            message: "正在查询中，请稍候"
        },
        labelDict: {
            entityList: [

            ]
        },
        requestUrl: ""
    },
    created() {
        let _this = this;

        $.getJSON({
            url: "/static/config/config.json",
            method: "GET",
            success(resp) {
                _this.requestUrl = resp.requestUrl;
            },
            fail(error) {
                $("#modal").modal();
                this.alert = {
                    type: "alert-danger",
                    message: error
                };
                setTimeout(function () {
                    $("#modal").modal("hide");
                }, 3000);
            }
        })
    },
    methods: {
        request(type) {
            let _this = this;

            if (type === "open") {
                $.ajax({
                    type: "GET",
                    url: this.requestUrl + "/open",
                    data: {
                        path: this.input.filename
                    },
                    success: function (resp) {
                        if (resp.code === 1) {
                            _this.alert = {
                                type: "alert-success",
                                message: resp.msg
                            };
                            _this.file = {
                                isExisted: true,
                                status: "success"
                            };
                            _this.input.total = Number(resp.data.length);
                            _this.input.uid = resp.data.uid;
                        } else {
                            _this.alert = {
                                isShow: true,
                                type: "alert-danger",
                                message: resp.msg
                            };
                            _this.file = {
                                isExisted: false,
                                status: "error"
                            };
                        }
                    },
                    fail: function (error) {
                        _this.alert = {
                            isShow: true,
                            type: "alert-danger",
                            message: error
                        };
                        _this.file = {
                            isExisted: false,
                            status: "error"
                        };
                    },
                    complete: function () {
                        setTimeout(function () {
                            _this.alert.isShow = false;
                        }, 3000);
                    }
                });
            } else if (type === "get") {
                $("#modal").modal();
                if (!this.file.isExisted) {
                    this.alert = {
                        type: "alert-danger",
                        message: "请先打开数据文件，再执行查询"
                    };
                    setTimeout(function () {
                        _this.alert.isShow = false;
                    }, 3000);
                    return none;
                }
                this.alert.message = "正在查询中，请稍候";
                $.ajax({
                    type: "GET",
                    url: this.requestUrl + "/get_one",
                    data: {
                        uid: this.input.uid,
                        method: "modify",
                        start: Number(this.input.start)
                    },
                    success: function (resp) {
                        if (resp.code === 1) {
                            _this.labelDict = resp.data.data;
                            _this.alert = {
                                isShow: true,
                                type: "alert-success",
                                message: resp.msg
                            };
                            _this.backToTop();
                            $("#modal").modal("toggle");
                        } else {
                            _this.alert = {
                                isShow: true,
                                type: "alert-danger",
                                message: resp.msg
                            };
                        }
                    },
                    fail: function (error) {
                        _this.alert = {
                            isShow: true,
                            type: "alert-danger",
                            message: error
                        };
                    },
                    complete: function () {
                        _this.changePageSize();
                    }
                });
            }
        },
        turnPage(type) {
            if (type === "prev") {
                this.input.start = Number(this.input.start) - 1;

                if (this.input.start >= this.input.total) {
                    this.input.start = this.input.total;
                }
            } else if (type === "next") {
                this.input.start = Number(this.input.start) + 1;

                if (this.input.start < 0) {
                    this.input.start = 0;
                }
            }
            this.request("get");
        },
        save() {
            let _this = this;

            $.ajax({
                type: "GET",
                url: this.requestUrl + "/save",
                data: {
                    uid: this.input.uid
                },
                success: function (resp) {
                    if (resp.code === 1) {
                        _this.alert = {
                            isShow: true,
                            type: "alert-success",
                            message: resp.msg
                        };
                    } else {
                        _this.alert = {
                            isShow: true,
                            type: "alert-danger",
                            message: resp.msg
                        };
                    }
                },
                fail: function (error) {
                    _this.alert = {
                        isShow: true,
                        type: "alert-danger",
                        message: error
                    };
                },
                complete: function () {
                    setTimeout(function () {
                        _this.alert.isShow = false;
                    }, 3000);
                }
            });
        },
        update() {
            let _this = this,
                $singleItem = $(".label-list").find(".label-single-item"),
                entityList = [];

            for (let i = 0, len = $singleItem.length; i < len; i++) {
                let $groupList = $singleItem.eq(i).find(".label-group-item"),
                    $singleTextList = $groupList.find("[data-type='text']"),
                    $singleStartList = $groupList.find("[data-type='start']"),
                    $singleEndList = $groupList.find("[data-type='end']"),
                    $singleTypeList = $groupList.find("[data-type='labelType']"),
                    singleList = [];

                for (let i = 0; i < $singleTextList.length; i++) {
                    singleList.push({
                        name: $singleTextList[i].value,
                        start: $singleStartList[i].value,
                        end: $singleEndList[i].value,
                        type: $singleTypeList[i].value
                    });
                }
                entityList.push(singleList);
            }

            $.ajax({
                type: "POST",
                url: this.requestUrl + "/update",
                data: {
                    uid: this.input.uid,
                    index: Number(this.input.start),
                    entityList: JSON.stringify(entityList)
                },
                success: function (resp) {
                    if (resp.code === 1) {
                        _this.alert = {
                            isShow: true,
                            type: "alert-success",
                            message: resp.msg
                        };
                    } else {
                        _this.alert = {
                            isShow: true,
                            type: "alert-danger",
                            message: resp.msg
                        };
                    }
                },
                fail: function (error) {
                    _this.alert = {
                        isShow: true,
                        type: "alert-danger",
                        message: error
                    };
                },
                complete: function () {
                    setTimeout(function () {
                        _this.alert.isShow = false;
                    }, 3000);
                }
            });
        },
        add_group() {
            this.save_item();
            this.labelDict.entityList.push([]);
        },
        save_item() {
            let $singleItem = $(".label-list").find(".label-single-item");

            for (let i = 0, len = $singleItem.length; i < len; i++) {
                let $groupList = $singleItem.eq(i).find(".label-group-item"),
                    $singleTextList = $groupList.find("[data-type='text']"),
                    $singleStartList = $groupList.find("[data-type='start']"),
                    $singleEndList = $groupList.find("[data-type='end']"),
                    $singleTypeList = $groupList.find("[data-type='labelType']");

                for (let j = 0; j < $singleTextList.length; j++) {
                    this.labelDict.entityList[i][j] = {
                        name: $singleTextList[j].value,
                        start: Number($singleStartList[j].value),
                        end: Number($singleEndList[j].value),
                        type: $singleTypeList[j].value
                    };
                }
            }
            this.$forceUpdate();
        },
        add_item(event) {
            let groupIndex = Number(event.target.dataset.groupIndex);

            this.save_item();
            this.labelDict.entityList[groupIndex].push({
                name: "",
                start: 0,
                end: 0,
                type: "1"
            });
        },
        del_item(event) {
            let groupIndex = Number(event.target.dataset.groupIndex),
                extractIndex = Number(event.target.dataset.extractIndex),
                entityList = this.labelDict.entityList[groupIndex],
                newExtractList = [];

            for (let i = 0; i < extractIndex; i++) {
                newExtractList.push(entityList[i]);
            }
            for (let i = extractIndex + 1; i < entityList.length; i++) {
                newExtractList.push(entityList[i]);
            }

            this.save_item();
            if (newExtractList.length === 0) {
                for (let i = groupIndex, length = this.labelDict.entityList.length - 1; i < length; i++) {
                    this.labelDict.entityList[i] = this.labelDict.entityList[i + 1];
                }
                this.labelDict.entityList.pop();
            } else {
                this.$forceUpdate();
                this.labelDict.entityList[groupIndex] = newExtractList;
            }
        },
        changeRange(event) {
            let entityIndex = $(event.target).siblings().eq(3).data("extract-index"),
                type = event.target.dataset.type,
                value = event.target.value,
                start = this.labelDict.entityList[0][entityIndex].start,
                end = this.labelDict.entityList[0][entityIndex].end,
                newName = "";

            if (type === "start") {
                start = Number(value);
                this.labelDict.entityList[0][entityIndex].start = start;
            } else {
                end = Number(value);
                this.labelDict.entityList[0][entityIndex].end = end;
            }

            for (let i = start; i < end; i++) {
                newName += this.labelDict.indexList[i].char;
            }
            this.labelDict.entityList[0][entityIndex].name = newName;
            this.$forceUpdate();
        },
        changePageSize() {
            this.$nextTick(() => {
                $("#app").height(document.getElementById("content").offsetHeight + 300);
            });
        },
        backToTop() {
            document.documentElement.scrollTop = 0;
        }
    }
})