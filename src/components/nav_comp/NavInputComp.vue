<template>
    <nav class="navbar navbar-default navbar-fixed-top">
        <ul class="nav navbar-nav">
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                   aria-expanded="false">文件<span class="caret"></span></a>
                <ul class="dropdown-menu">
                    <li><a href="#" data-target="#">打开</a></li>
                    <li role="separator" class="divider"></li>
                    <li><a href="#">导出成 JSON</a></li>
                    <li><a href="#">导出成 Excel</a></li>
                </ul>
            </li>
        </ul>
        <!-- <form class="navbar-form navbar-left" role="search">
            <div class="form-group mr-20">
                <label for="fileType" class="control-label sr-only"></label>
                <select v-model="file.type" id="fileType" class="form-control">
                    <option value="config">配置形式</option>
                    <option value="directory">目录形式</option>
                </select>
            </div>
            <div v-if="file.type==='config'" class="form-group mr-20">
                <label for="filename" class="hidden"></label>
                <input type="text" v-model="file.path" id="filename" placeholder="打开文件名称"
                       class="form-control" style="width: 600px;"/>
            </div>
            <div v-else class="form-group r-20">
                <label for="dirA" class="hidden"></label>
                <input type="text" v-model="file.pathA" id="dirA" placeholder="目录 A 地址"
                       class="form-control" style="width: 400px;"/>
                <label for="dirB" class="hidden"></label>
                <input type="text" v-model="file.pathB" id="dirB" placeholder="目录 B 地址"
                       class="form-control" style="width: 400px;"/>
            </div>
            <div @click="request('open')" class="btn btn-default mr-20">打开文件</div>
            <div class="file-status mr-100" :class="'file-status-' + file.status"></div>
        </form>
        <div class="navbar-form navbar-right">
            <i class="glyphicon glyphicon-plus mr-5"></i>
            <i @click="popup('helpModal')" class="glyphicon glyphicon-question-sign"></i>
        </div> -->
    </nav>
</template>

<script>
export default {
    name: "NavInputComp"
}
</script>