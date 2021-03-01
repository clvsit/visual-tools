new Vue({
    el: "#app",
    data: {
        input: "在最初有历史记录的时候，数学内的主要原理是为了做税务和贸易等相关计算，为了解数字间的关系，为了测量土地，以及为了预测天文事件而形成的。这些需要可以简单地被概括为数学对数量、结构、空间及时间方面的研究。",
        output: {
            replace: "",
            info: []
        },
        history: [],
        alert: {
            isShow: false,
            type: "alert-success",
            message: ""
        },
        requestUrl: ""
    },
    created() {
        let _this = this;

        this.history = JSON.parse(localStorage.getItem("history")) || [];
        this.changePageSize();

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

            if (this.history.length >= 10) {
                for (let i = 0, len = this.history.length - 1; i < len; i++) {
                    this.history[i] = this.history[i + 1];
                }
                this.history[9] = this.input;
            } else {
                this.history.push(this.input);
            }
            localStorage.setItem("history", JSON.stringify(this.history));

            if (type === "get") {
                $.ajax({
                    type: "POST",
                    url: this.requestUrl + "/data/generator",
                    data: {
                        input: this.input
                    },
                    success: function (resp) {
                        if (resp.code === 1) {
                            _this.output = resp.data.output;
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
                        _this.changePageSize();
                        setTimeout(function () {
                            _this.alert.isShow = false;
                        }, 3000);
                    }
                });
            }
        },
        changePageSize() {
            this.$nextTick(() => {
                $("#app").height(document.getElementById("content").offsetHeight + 300);
            });
        },
    }
})

$(function(){

    var ul = $('#upload ul');

    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({

        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),

        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {

            var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
                ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

            // Append the file name and file size
            tpl.find('p').text(data.files[0].name)
                         .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

            // Add the HTML to the UL element
            data.context = tpl.appendTo(ul);

            // Initialize the knob plugin
            tpl.find('input').knob();

            // Listen for clicks on the cancel icon
            tpl.find('span').click(function(){

                if(tpl.hasClass('working')){
                    jqXHR.abort();
                }

                tpl.fadeOut(function(){
                    tpl.remove();
                });

            });

            // Automatically upload the file once it is added to the queue
            var jqXHR = data.submit();
        },

        progress: function(e, data){

            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);

            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('input').val(progress).change();

            if(progress == 100){
                data.context.removeClass('working');
            }
        },

        fail:function(e, data){
            // Something has gone wrong!
            data.context.addClass('error');
        }

    });


    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

});