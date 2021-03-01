new Vue({
    el: "#app",
    data: {
        input: {
            filename: "version_1/output/compare_version.jsonl",
            start: 0,
            limit: 10,
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
        labelList: [],
        requestUrl: "",
        isJudge: false,
        judgeInfo: {
            leftCount: 0,
            leftIndexList: [],
            midCount: 0,
            midIndexList: [],
            rightCount: 0,
            rightIndexList: [],
            queue: []
        },
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
                    return none;
                }
                $("#modal").modal();
                this.alert.message = "正在查询中，请稍候";
                $.ajax({
                    type: "GET",
                    url: this.requestUrl + "/get_page",
                    data: {
                        uid: this.input.uid,
                        method: "compare",
                        start: Number(this.input.start),
                        limit: Number(this.input.limit)
                    },
                    success: function (resp) {
                        if (resp.code === 1) {
                            _this.labelList = resp.data.list;
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
                    }
                });
            } else if (type === "outputVoteResult") {
                $("#voteResultModal").modal("hide");
                $.ajax({
                    type: "POST",
                    url: this.requestUrl + "/vote/output",
                    data: {
                        uid: this.input.uid,
                        leftIndexList: JSON.stringify(this.judgeInfo.rightIndexList),
                        midIndexList: JSON.stringify(this.judgeInfo.midIndexList),
                        rightIndexList: JSON.stringify(this.judgeInfo.rightIndexList)
                    },
                    success: function (resp) {
                        if (resp.code === 1) {
                            window.open(_this.requestUrl + "/" + resp.data.file);
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
        popup(modalName) {
            $("#" + modalName).modal();
        },
        enterJudgeModel() {
            this.isJudge = true;
            this.input.limit = 1;
            this.request("get");
        },
        leaveJudgeModel() {
            let _this = this;

            this.isJudge = false;
            this.input.limit = 10;
            $("#leaveVoteModal").modal("hide");
            setTimeout(() => {
                _this.request("get");
            }, 300);
        },
        vote(choice) {
            if (choice === "left") {
                this.judgeInfo.leftCount += 1;
                this.judgeInfo.leftIndexList.push(Number(this.input.start));
            } else if (choice === "mid") {
                this.judgeInfo.midCount += 1;
                this.judgeInfo.midIndexList.push(Number(this.input.start));
            } else {
                this.judgeInfo.rightCount += 1;
                this.judgeInfo.rightIndexList.push(Number(this.input.start));
            }

            this.judgeInfo.queue.push(choice);
            if (this.judgeInfo.queue.length > 5) {
                this.judgeInfo.queue.shift();
            }
            this.turnPage("next");
        },
        voteBack() {
            const choice = this.judgeInfo.queue.pop();

            if (choice === "left") {
                this.judgeInfo.leftCount -= 1;
                this.judgeInfo.leftIndexList.pop();
            } else if (choice === "mid") {
                this.judgeInfo.midCount -= 1;
                this.judgeInfo.midIndexList.pop();
            } else {
                this.judgeInfo.rightCount -= 1;
                this.judgeInfo.rightIndexList.pop();
            }
            this.turnPage("prev");
        },
        voteFinish() {
            const voteOption = {
            title: {
                text: '各投票占比饼图',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '投票类型',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        {name: "左侧", value: this.judgeInfo.leftCount},
                        {name: "弃权", value: this.judgeInfo.midCount},
                        {name: "右侧", value: this.judgeInfo.rightCount},
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

            $("#voteResultModal").modal();
            this.$nextTick(() => {
                const voteChart = echarts.init(document.getElementById("voteChart"));
                voteChart.setOption(voteOption);
            });
        },
        backToTop() {
            document.documentElement.scrollTop = 0;
        }
    }
})