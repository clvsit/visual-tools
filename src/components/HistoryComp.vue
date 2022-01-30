<template>
  <div class="input-container">
    <h3>历史记录</h3>
    <hr />
    <div class="list-group">
      <div class="list-group-item no-border no-padding-horizontal">
        <label class="control-label">视频地址：</label>
        <input v-model="history.url" type="text" class="form-control" />
      </div>
      <div class="list-group-item no-border no-padding-horizontal">
        <label class="control-label">记录名称：</label>
        <input
          v-model="history.name"
          type="text"
          class="form-control wd-150 display-inline"
        />
        <div @click="addHistory" class="btn btn-default text-right">添加</div>
      </div>
    </div>
    <hr />
    <div class="list-group history-list">
      <div
        class="list-group-item"
        :class="{ 'info-item-contained': item.isSelected }"
        v-for="(item, index) in history.list"
      >
        <i
          @click="deleteHistory(index)"
          class="history-delete-btn glyphicon glyphicon-remove"
        ></i>
        <div class="history-item">
          <div class="history-item-title">
            <b>记录名称：</b><span v-text="item.name"></span>
          </div>
          <div class="history-item-title">
            <b>添加日期：</b><span v-text="item.date"></span>
          </div>
          <div class="history-item-title">
            <b>视频地址：</b><a :href="item.url" target="_blank">传送门</a>
          </div>
        </div>
        <div class="history-item flex-space-between">
          <div @click="video.first.path = item.url" class="btn btn-default">
            添加到 1 号视频
          </div>
          <div @click="video.second.path = item.url" class="btn btn-default">
            添加到 2 号视频
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.history-list {
    height: 500px;
    overflow: auto;

    ::-webkit-scrollbar {
    width: 4px;
}
}

.history-list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.history-list::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}

.history-list .list-group-item {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}

.history-list .history-delete-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #555;
    transition: all 0.25s ease-in-out;
}

.history-list .history-delete-btn:hover {
    color: #000;
    transform: rotate(90deg);
}

.history-list .history-item {
    padding: 5px 0;
}

.history-list .history-item .history-item-title {
    height: 25px;
    line-height: 25px;
}
</style>

<script>

export default {
    name: "historyComp",
    data() {
        return {
            history: {
                list: [],
                input: {
                    name: "",
                    url: "请在此输入要添加到历史记录的视频 CDN 地址"
                }
            }
        }
    },
    methods: {
        /**
         * 获取指定 name 的历史记录
         * @param {string} name 存储在 localstorage 的 key
         */
        getHistoryList(name) {
            const historyListJson = localStorage.getItem(name);
            
            this.history.list = JSON.parse(historyListJson);
        },
        /**
         * 设置历史记录列表
         */
        setHistoryList(name) {
            localStorage.setItem(name, JSON.stringify(this.history.list));
        },
        /**
         * 添加历史记录
         */
        addHistory() {
            if (this.history.list.length === 10) {
                this.history.list.shift();
            }

            this.history.list.push({
                name: this.history.input.name,
                url: this.history.input.url,
                date: new Date().toLocaleDateString()
            });
            this.setHistoryList();
        },
        /**
         * 删除指定历史巨鹿
         * @param {int} index 
         */
        deleteHistory(index) {
            for (let idx = index, len = this.history.list.length; idx < len; idx++) {
                this.history.list[idx] = this.history.list[idx + 1];
            }
            this.history.list.pop();
            this.setHistoryList();
        }
    }
}
</script>
