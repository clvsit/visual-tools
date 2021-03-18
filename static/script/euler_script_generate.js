new Vue({
    el: "#app",
    data: {
        alert: {
            isShow: false,
            type: "alert-success",
            message: ""
        },
        code: {
            header: {},
            body: {}
        },
        codeView: "",
        extension: {
            list: [
                {type: 1, class: "label-danger", text: "钉钉报警", isShow: true},
                {type: 2, class: "label-info", text: "ConfigCenter 配置文件加载", isShow: true},
                {type: 3, class: "label-warning", text: "函数参数检查", isShow: true}
            ],
            basic: {
                fileName: "test.py",
                className: "ModelName"
            },
            dingding: {
                isShow: false,
                title: "报警消息",
                url: ""
            },
            config: {
                isShow: false,
                namespace: "dev",
                url: ""
            },
            paraCheck: {
                isShow: false,
            }
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

        this.$nextTick(() => {
            this.addCode(0);
            this.changePageSize();
        });
    },
    methods: {
        request(type) {
            let _this = this;

            if (type === "output") {
                $.ajax({
                    type: "POST",
                    url: this.requestUrl + "/other/code/output",
                    data: {
                        fileName: this.extension.basic.fileName,
                        code: this.codeView
                    },
                    success(resp) {
                        console.log(resp);
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
                    fail(error) {
                        _this.alert = {
                            isShow: true,
                            type: "alert-danger",
                            message: error
                        };
                    }
                });
            }
        },
        changePageSize() {
            this.$nextTick(() => {
                let height = document.getElementById("content").offsetHeight + 200;

                if (height < window.screen.availHeight) {
                    height = window.screen.availHeight - 100;
                }
                $("#app").height(height);
            });
        },
        addExtension(event) {
            const type = Number(event.target.dataset.extensionType);

            // 添加钉钉报警代码
            if (type === 1) {
                this.extension.list[type - 1].isShow = false;
                this.extension.dingding = {
                    isShow: true
                };
            }
            // 添加 ConfigCenter 配置文件读取代码
            else if (type === 2) {
                this.extension.list[type - 1].isShow = false;
                this.extension.config = {
                    isShow: true
                };
            }
            // 添加函数参数检查
            else if (type === 3) {
                this.extension.list[type - 1].isShow = false;
                this.extension.paraCheck = {
                    isShow: true
                };
            }
        },
        removeExtension(extensionType) {
            const type = Number(extensionType);

            this.extension.list[type - 1].isShow = true;
            if (type === 1) {
                this.extension.dingding = {
                    isShow: false,
                    title: "报警消息",
                    url: ""
                };
                this.code.header.dingding = [];
                this.code.body.dingding = [];
            }
            else if (type === 2) {
                this.extension.config = {
                    isShow: false,
                    namespace: "dev",
                    url: ""
                };
                this.code.header.config = [];
                this.code.body.config = [];
            }
            else if (type === 3) {
                this.extension.paraCheck = {
                    isShow: false,
                };
                this.code.header.paraCheck = [];
                this.code.body.paraCheck = [];
            }
            this.makeCode();
        },
        addCode(extensionType) {
            const type = Number(extensionType);

            if (type === 0) {
                this.code.header.basic = [
                    "import logging\n" +
                    "from simplex_base_model import SimplexBaseModel\n"
                ];
                this.code.body.basic = [
                    "class " + this.extension.basic.className + "(SimplexBaseModel):\n" +
                    "\n" +
                    "    def __init__(self, *args, **kwargs):\n" +
                    "        super(ModelName, self).__init__(*args, **kwargs)\n" +
                    "\n" +
                    "    def predict(self, data, **kwargs):\n" +
                    "        pass\n" +
                    "\n"
                ];
            }
            else if (type === 1) {
                this.code.header.dingding = [
                    "import json\n" +
                    "import requests\n"
                ];
                this.code.body.dingding = [
                    "    def send_ding_ding(self, content: str) -> None:\n" +
                    "        \"\"\"\n" +
                    "        发送钉钉报警消息\n" +
                    "        :param content: str 报警内容\n" +
                    "        :return: None\n" +
                    "        \"\"\"\n" +
                    "        headers = {\"Content-Type\": \"application/json;charset=utf-8\"}\n" +
                    "        msg = {\n" +
                    "            \"msgtype\": \"markdown\",\n" +
                    "            \"markdown\": {\n" +
                    "            \"title\": \"" + this.extension.dingding.title + "\",\n" +
                    "            \"text\": content\n" +
                    "            }\n" +
                    "        }\n" +
                    "        msg = json.dumps(msg)\n" +
                    "        try:\n" +
                    "            requests.post(self.report_url, data=msg, headers=headers, timeout=0.5)\n" +
                    "        except Exception as error:\n" +
                    "            logger.debug(error)\n\n"
                ];
                this.code.body.basic = [
                    "class ModelName(SimplexBaseModel):\n" +
                    "\n" +
                    "    def __init__(self, *args, **kwargs):\n" +
                    "        super(ModelName, self).__init__(*args, **kwargs)\n" +
                    "        self.report_url = kwargs.get(\"report_url\", \"" + this.extension.dingding.url + "\")\n" +
                    "\n" +
                    "    def predict(self, data, **kwargs):\n" +
                    "        pass\n" +
                    "\n"
                ];
            }
            else if (type === 2) {
                this.code.header.config = [
                    "import eigen_config\n"
                ];
                this.code.body.config = [
                    "    @staticmethod\n" +
                    "    def load_configs() -> dict:\n" +
                    "        \"\"\"\n" +
                    "        加载配置文件\n" +
                    "        :return: dict\n" +
                    "        \"\"\"\n" +
                    "        configs = eigen_config.Configs()\n" +
                    "        configs.set('NAMESPACE', '" + this.extension.config.namespace  + "')\n" +
                    "        configs.from_center(\"" + this.extension.config.url + "\")\n" +
                    "        return configs\n\n"
                ];
            }
            else if (type === 3) {
                this.code.header.paraCheck = [
                    "from functools import wraps\n" +
                    "from inspect import signature\n"
                ];
                this.code.body.paraCheck = [
                    "def input_check():\n" +
                    "    def decorate(func):\n" +
                    "        # 获取函数注释元信息\n" +
                    "        annotations = func.__annotations__\n" +
                    "        sig = signature(func)\n" +
                    "\n" +
                    "        @wraps(func)\n" +
                    "        def wrapper(*args, **kwargs):\n" +
                    "            # 获取执行函数的参数名与值\n" +
                    "            param_dict = sig.bind(*args, **kwargs).arguments\n" +
                    "\n" +
                    "            for param_name, param_value in param_dict.items():\n" +
                    "                if type(param_value) != annotations[param_name]:\n" +
                    "                    raise TypeError(\"The param {} must be {}!\".format(param_name, annotations[param_name]))\n" +
                    "\n" +
                    "            return func(*args, **kwargs)\n" +
                    "\n" +
                    "        return wrapper\n" +
                    "\n" +
                    "    return decorate\n\n\n"
                ];
            }
            this.makeCode();
        },
        makeCode() {
            let code = "",
                operationList = [
                    "paraCheck", "basic", "dingding", "config"
                ];

            // 添加头部引用
            for (let i = 0, len = operationList.length; i < len; i++) {
                let operation = operationList[i];

                if (operation in this.code.header) {
                    for (let j = 0; j < this.code.header[operation].length; j++) {
                        code += this.code.header[operation][j];
                    }
                }
            }

            code += "\nlogger = logging.getLogger(__name__)\n\n\n";

            // 添加主体代码
            for (let i = 0, len = operationList.length; i < len; i++) {
                let operation = operationList[i];

                if (operation in this.code.body) {
                    for (let j = 0; j < this.code.body[operation].length; j++) {
                        code += this.code.body[operation][j];
                    }
                }
            }

            this.codeView = code;
            this.changePageSize();

            this.$nextTick(() => {
                hljs.highlightAll();
            });
        }
    }
})
