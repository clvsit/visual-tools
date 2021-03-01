new Vue({
    el: "#app",
    data: {
        panelType: 1,
        panel: {
            width: 600,
            height: 400,
            marginLeft: 0,
            marginTop: 0
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
        linkTo(url) {
            window.open(url, "_blank");
        }
    }
})
