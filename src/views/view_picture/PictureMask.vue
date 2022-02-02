<template>
    <nav-comp title="图片遮罩处理工具"></nav-comp>

    <div class="container-fluid mt-20">
        <div class="row">
            <div class="col-md-8">
                <div id="content" class="input-container">
                    <h3>
                        <span>图片区域</span>
                        <span class="float-right">
                            <input id="pictureFile" type="file" class="sr-only"/>
                            <button @click="openPicture" class="btn btn-default">上传图片</button>
                        </span>
                    </h3>
                    <hr/>
                    <div id="pictureArea"
                         class="picture-area"
                         @mousedown="startMoveMask"
                         @mousemove="moveMask"
                         @mouseup="mask.isMove=false">
                        <img id="picture" class="picture" src="#" :src="picture.url" alt="待遮罩图片"/>
                        <div id="mask"
                             class="picture-mask"
                             :style="{'width': validWidth + 'px', 'height': validHeight + 'px', 'background-color': mask.color, 'top': mask.y + 'px', 'left': mask.x + 'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="content-list">
                    <h3>设置区域</h3>
                    <hr/>
                    <form class="form-inline">
                        <h4>图片信息</h4>
                        <hr/>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <span>原始图片：</span>
                                <div class="form-group">
                                    <label class="control-label mr-20">
                                        <span>宽度：</span>
                                        <input :value="picture.sourceWidth" type="number" class="form-control wd-80" min="0"
                                               disabled/>
                                    </label>
                                    <label class="control-label mr-20">
                                        <span>高度：</span>
                                        <input :value="picture.sourceHeight" type="number" class="form-control wd-80" min="0"
                                               disabled/>
                                    </label>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <span>显示图片：</span>
                                <div class="form-group">
                                    <label class="control-label mr-20">
                                        <span>宽度：</span>
                                        <input :value="picture.width" type="number" class="form-control wd-80" min="0"
                                               disabled/>
                                    </label>
                                    <label class="control-label mr-20">
                                        <span>高度：</span>
                                        <input :value="picture.height" type="number" class="form-control wd-80" min="0"
                                               disabled/>
                                    </label>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <span>其他信息：</span>
                                <div class="form-group">
                                    <label class="control-label mr-20">
                                        <span>缩放率：</span>
                                        <span v-text="pictureScaleRatio"></span>
                                    </label>
                                </div>
                            </li>
                        </ul>

                        <h4 class="mt-20">遮罩块设置</h4>
                        <hr/>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <span>原始遮罩：</span>
                                <div class="form-group">
                                    <label class="control-label mr-20">
                                        <span>宽度：</span>
                                        <input v-model="mask.width" type="number" class="form-control wd-80" min="0"/>
                                    </label>
                                    <label class="control-label mr-20">
                                        <span>高度：</span>
                                        <input v-model="mask.height" type="number" class="form-control wd-80" min="0"/>
                                    </label>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <span>显示遮罩：</span>
                                <div class="form-group">
                                    <label class="control-label mr-20">
                                        <span>宽度：</span>
                                        <input v-model="mask.view.width" type="number" class="form-control wd-80" min="0" disabled/>
                                    </label>
                                    <label class="control-label mr-20">
                                        <span>高度：</span>
                                        <input v-model="mask.view.height" type="number" class="form-control wd-80" min="0" disabled/>
                                    </label>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="form-group">
                                    <label class="control-label mr-20">
                                        <span>X 轴：</span>
                                        <input @change="check('x')" v-model="mask.x" type="number"
                                               class="form-control wd-80"
                                               min="0"/>
                                    </label>
                                    <label class="control-label mr-20">
                                        <span>Y 轴：</span>
                                        <input @change="check('y')" v-model="mask.y" type="number"
                                               class="form-control wd-80"
                                               min="0"/>
                                    </label>
                                    <label class="control-label">
                                        <span>颜色：</span>
                                        <div id="colorPicker" class="mask-color-panel form-control"></div>
                                    </label>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="form-group">
                                    <label class="control-label mr-20">
                                        <span>真实 X 轴：</span>
                                        <input :value="maskScaledX" type="number" class="form-control wd-80" min="0" disabled/>
                                    </label>
                                    <label class="control-label mr-20">
                                        <span>真实 Y 轴：</span>
                                        <input :value="maskScaledY" type="number" class="form-control wd-80" min="0" disabled/>
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.picture-area {
    position: relative;
    width: 100%;
    height: 100%;
}

.picture-mask {
    position: absolute;
    top: 0;
    left: 0;
}

.picture {
    width: 100%;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    user-focus: none;
    user-select: none
}

/*.picture {*/
/*    width: 100%;*/
/*    height: 100%;*/
/*}*/

.mask-color-panel {
    height: 26px;
    /* background-color: #000; */
    border: 1px solid #fff;
    display: inline-block;
    cursor: pointer;
}
</style>

<script>
import NavComp from "@/components/NavComp.vue"


export default {
    name: "pictureMask",
    data() {
        return {
            picture: {
                width: 1200,
                height: 1200,
                sourceWidth: 1200,
                sourceHeight: 1200,
                maxWidth: 260,
                ratio: 1,
                url: "../assets/images/back.jpg",
            },
            mask: {
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                view: {
                    width: 0,
                    height: 0
                },
                scale: {
                    x: 0,
                    y: 0
                },
                color: "#000",
                isMove: false
            },
            requestUrl: ""
        }
    },
    computed: {
        pictureScaleRatio() {
            const ratio = this.picture.maxWidth / this.picture.sourceWidth;

            if (ratio >= 1) {
                this.picture.ratio = 1;
            } else {
                this.picture.ratio = ratio;
            }
            this.setMaskSizeByRatio();
            return this.picture.ratio.toFixed(2);
        },
        validWidth() {
            if (this.mask.view.width > this.picture.width) {
                this.mask.view.width = this.picture.width;
            }
            return this.mask.view.width;
        },
        validHeight() {
            if (this.mask.view.height > this.picture.height) {
                this.mask.view.height = this.picture.height;
            }
            return this.mask.view.height;
        },
        maskScaledX() {
            return Math.round(this.mask.x / this.picture.ratio);
        },
        maskScaledY() {
            return Math.round(this.mask.y / this.picture.ratio);
        }
    },
    watch: {
        "mask.x"() {
            this.mask.x = parseInt(this.mask.x);
        },
        "mask.y"() {
            this.mask.y = parseInt(this.mask.y);
        },
        "mask.width"() {
            this.mask.width = parseInt(this.mask.width);
        },
        "mask.height"() {
            this.mask.height = parseInt(this.mask.height);
        },
        "mask.view.width"() {
            this.mask.view.width = parseInt(this.mask.view.width);
        },
        "mask.view.height"() {
            this.mask.view.height = parseInt(this.mask.view.height);
        }
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
            const pictureAreaDom = document.getElementById("pictureArea");

            this.picture.maxWidth = pictureAreaDom.offsetWidth;

            this.changePageSize();

            this.createPictureListener();

            $(".mask-color-panel").paigusu({
                color: "#000"
            }, function (event, obj) {
                $(event).css('background-color', '#' + obj.hex);
                _this.mask.color = "#" + obj.hex
            });
        });
    },
    methods: {
        changePageSize() {
            this.$nextTick(() => {
                let height = document.getElementById("content").offsetHeight + 200;

                if (height < window.screen.availHeight) {
                    height = window.screen.availHeight - 100;
                }
                $("#app").height(height);
            });
        },
        createPictureListener() {
            /**
             * 创建图片监听器：获取上传图片，并将其呈现在页面上
             * @type {HTMLElement}
             */
            let pictureDom = document.getElementById("pictureFile"),
                imgObject = new Image(),
                _this = this;

            imgObject.onload = () => {
                _this.picture.sourceWidth = imgObject.width;
                _this.picture.sourceHeight = imgObject.height;
                _this.setPictureArea(imgObject.width, imgObject.height);
            };

            pictureDom.addEventListener("change", function () {
                let file = pictureDom.files[0];

                if (!/image\/\w+/.test(file.type)) {
                    alert("请确保文件为图像类型");
                    return false;
                }
                let reader = new FileReader();
                // 将文件以 Data URL 形式读入页面
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    // 在页面上显示文件
                    _this.picture.url = this.result;
                    _this.changePageSize();
                    imgObject.src = this.result;
                }
            }, false);

            imgObject.src = "/static/images/picture_handle_1.jpg";
            this.picture.url = "/static/images/picture_handle_1.jpg";
        },
        openPicture() {
            $("#pictureFile").click();
        },
        setPictureArea(width, height) {
            const pictureDom = document.getElementById("picture"),
                pictureAreaDom = document.getElementById("pictureArea");

            console.log(pictureDom);
            if (width > this.picture.maxWidth) {
                pictureAreaDom.style.width = this.picture.maxWidth + "px";
                this.picture.width = this.picture.maxWidth;
            }

            this.$nextTick(() => {
                // 修改 pictureArea 的尺寸，并同步更新 picture 的 width 和 height 参数
                console.log(width, this.picture.maxWidth);
                if (width > this.picture.maxWidth) {
                    pictureAreaDom.style.height = pictureDom.offsetHeight + "px";
                    this.picture.height = pictureDom.offsetHeight;
                } else {
                    pictureAreaDom.style.width = width + "px";
                    pictureAreaDom.style.height = height + "px";
                    this.picture.width = width;
                    this.picture.height = height;
                }

                // 重置 mask 的坐标为原点 (0, 0)
                this.mask.x = 0;
                this.mask.y = 0;

                // 重新设置页面的尺寸
                this.changePageSize();
            });
        },
        setMaskSizeByRatio() {
            this.mask.view = {
                width: this.mask.width * this.picture.ratio,
                height: this.mask.height * this.picture.ratio
            };
        },
        check(type) {
            /**
             * 边界检测：检查图片遮罩元素的坐标是否超过图片的边界
             * @param type: string 检测对象 x or y
             */
            if (type === "x") {
                if (this.mask.x + this.mask.view.width > this.picture.width) {
                    this.mask.x = this.picture.width - this.mask.view.width;
                }
            } else if (type === "y") {
                if (this.mask.y + this.mask.view.height > this.picture.height) {
                    this.mask.y = this.picture.height - this.mask.view.height;
                }
            }
        },
        startMoveMask(event) {
            this.mask.isMove = true;
            this.mask.lastX = event.clientX;
            this.mask.lastY = event.clientY;
        },
        moveMask(event) {
            if (this.mask.isMove) {
                let lastX = this.mask.lastX,
                    lastY = this.mask.lastY,
                    x = event.clientX,
                    y = event.clientY,
                    move_x = x - lastX,
                    move_y = y - lastY;

                this.mask.lastX = x;
                this.mask.lastY = y;
                this.mask.x = this.mask.x + move_x;
                this.mask.y = this.mask.y + move_y;

                // 边界判断
                if (this.mask.x < 0) {
                    this.mask.x = 0;
                }
                if (this.mask.x + this.mask.view.width > this.picture.width) {
                    this.mask.x = this.picture.width - this.mask.view.width;
                }
                if (this.mask.y < 0) {
                    this.mask.y = 0;
                }
                if (this.mask.y + this.mask.view.height > this.picture.height) {
                    this.mask.y = this.picture.height - this.mask.view.height;
                }
            }
        }
    }
}
</script>