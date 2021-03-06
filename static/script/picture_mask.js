new Vue({
    el: "#app",
    data: {
        alert: {
            isShow: false,
            type: "alert-success",
            message: ""
        },
        picture: {
            width: 1200,
            height: 1200,
            sourceWidth: 1200,
            sourceHeight: 1200,
            maxWidth: 260,
            ratio: 1,
            url: "/static/images/back.jpg",
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
             * ????????????????????????????????????????????????????????????????????????
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
                    alert("??????????????????????????????");
                    return false;
                }
                let reader = new FileReader();
                // ???????????? Data URL ??????????????????
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    // ????????????????????????
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
                // ?????? pictureArea ??????????????????????????? picture ??? width ??? height ??????
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

                // ?????? mask ?????????????????? (0, 0)
                this.mask.x = 0;
                this.mask.y = 0;

                // ???????????????????????????
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
             * ???????????????????????????????????????????????????????????????????????????
             * @param type: string ???????????? x or y
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

                // ????????????
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
})
