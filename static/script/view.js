new Vue({
    el: "#app",
    data: {
        input: {
            filename: "/nfs/users/chenxu/project/OpenNMT-tf/asr_correct/result/detect/redbook/result_food_no_label.jsonl",
            fileSelect: "",
            start: 0,
            limit: 10,
            uid: ""
        },
        file: {
            isExisted: false,
            status: "close"
        },
        alert: {
            isShow: false,
            type: "alert-success",
            message: ""
        },
        entity: {
            isShow: true,
            labelPanelClass: "col-md-7"
        },
        eval: {
            accuracy: 0,
            precision: 0,
            recall: 0,
            f1: 0
        },
        controls: {
            isEval: false,
            isQuickLink: false,
        },
        labelList: [],
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
        selectFile() {
            this.input.filename = this.input.fileSelect;
        },
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
                                isShow: true,
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
                if (!this.file.isExisted) {
                    this.alert = {
                        isShow: true,
                        type: "alert-danger",
                        message: "请先打开数据文件，再执行查询"
                    };
                    setTimeout(function () {
                        _this.alert.isShow = false;
                    }, 3000);
                }
                $.ajax({
                    type: "GET",
                    url: this.requestUrl + "/get_page",
                    data: {
                        start: Number(this.input.start),
                        limit: Number(this.input.limit),
                        uid: this.input.uid,
                        method: "view"
                    },
                    success: function (resp) {
                        if (resp.code === 1) {
                            _this.labelList = resp.data.list;
                            _this.alert = {
                                isShow: true,
                                type: "alert-success",
                                message: resp.msg
                            };
                            _this.eval = {
                                accuracy: Number(resp.data.list.eval.accuracy),
                                precision: Number(resp.data.list.eval.precision),
                                recall: Number(resp.data.list.eval.recall),
                                f1: Number(resp.data.list.eval.f1),
                            };
                            _this.drawRadarPicture(resp.data.list.eval);
                            _this.backToTop();
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
                        setTimeout(function () {
                            _this.alert.isShow = false;
                        }, 3000);
                    }
                });
            }
        },
        turnPage(type) {
            if (type === "prev") {
                this.input.start = Number(this.input.start) - Number(this.input.limit);

                if (this.input.start >= this.input.total) {
                    this.input.start = this.input.total;
                }
            } else if (type === "next") {
                this.input.start = Number(this.input.start) + Number(this.input.limit);

                if (this.input.start < 0) {
                    this.input.start = 0;
                }
            }
            this.request("get");
        },
        changePageSize() {
            this.$nextTick(() => {
                $("#app").height(document.getElementById("content").offsetHeight + 300);
            });
        },
        changeEntityShow(status) {
            if (status === "open") {
                this.entity = {
                    isShow: true,
                    labelPanelClass: "col-md-7"
                };
            } else {
                this.entity = {
                    isShow: false,
                    labelPanelClass: "col-md-10"
                };
            }
        },
        openPanel(panelType) {
            if (panelType === "evalPanel") {
                this.controls.isEval = true;
                this.drawRadarPicture();
            }
        },
        drawRadarPicture() {
            let option = {
                tooltip: {},
                legend: {
                    data: ['当前数据']
                },
                radar: {
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        {name: 'accuracy', max: 1},
                        {name: 'precision', max: 1},
                        {name: 'recall', max: 1},
                        {name: 'F1', max: 1},
                    ]
                },
                series: [{
                    name: '评估指标',
                    type: 'radar',
                    data: [
                        {
                            value: [
                                Number(this.eval.accuracy),
                                Number(this.eval.precision),
                                Number(this.eval.recall),
                                Number(this.eval.f1)
                            ],
                            name: '评估指标'
                        }
                    ]
                }]
            };

            this.$nextTick(() => {
                const evalEcharts = echarts.init(document.getElementById("evalChart"));
                evalEcharts.setOption(option);
            });
        },
        backToTop() {
            document.documentElement.scrollTop = 0;
        }
    }
})
