import os
import json
import pickle
import jsonlines
from uuid import uuid4
from flask import Flask, render_template, request
from flask_cors import CORS
from sequence_handler import SequenceHandler
from data_generate import DataGenerator


app = Flask(__name__)
app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
CORS(app, resources=r'/*')


dataset_dict = {}

# with open("/nfs/users/chenxu/project/OpenNMT-tf/asr_correct/data/word_sim_dict.pkl", "rb") as file:
#     data_generator = DataGenerator(pickle.load(file))


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/view')
def page_view():
    return render_template("sequence_labeling/view.html")


@app.route('/modify')
def page_modify():
    return render_template("sequence_labeling/modify.html")


@app.route('/compare')
def page_compare():
    return render_template("sequence_labeling/compare.html")


@app.route('/generate')
def generate():
    return render_template("data_generate/correct.html")


@app.route("/classify/view")
def classify_view():
    return render_template("classify/view.html")


@app.route("/picture/mask")
def picture_mask():
    return render_template("picture/picture_mask.html")


@app.route("/other/euler_script_generate")
def euler_script_generate():
    return render_template("other/euler_script_generate.html")


@app.route('/open')
def open_dataset() -> dict:
    """
    打开脚本文件
    :return: dict response 内容
    """
    if request.method == "GET":
        file_path = request.args.get("path", "")

        if not os.path.exists(file_path):
            return {"code": 0, "msg": "打开文件失败！", "data": {"msg": "当前路径不存在文件，请检查文件路径！"}}

        try:
            print(file_path)
            with open(file_path, "r", encoding="utf-8") as file:
                dataset = [line for line in jsonlines.Reader(file)]
                data_handler = SequenceHandler()
                data_handler.set_dataset(dataset)
                data_handler.file_path = file_path

            uid = str(uuid4())
            dataset_dict[uid] = data_handler

            feedback = {
                "code": 1,
                "msg": "打开文件成功！",
                "data": {
                    "length": len(dataset),
                    "uid": uid
                }
            }
        except Exception as error:
            feedback = {
                "code": 0,
                "msg": "打开文件失败！",
                "data": {
                    "msg": str(error)
                }
            }
    else:
        feedback = {"code": 0, "msg": "请求方法有误！", "data": {}}
    return feedback


@app.route('/get_one')
def get_data():
    if request.method == "GET":
        start = int(request.args.get("start", 0))
        uid = request.args.get("uid", "")
        method = request.args.get("method", "")

        if uid == "":
            return {"code": 0, "msg": "获取数据列表失败！", "data": {"msg": "uid 没有传递或无效！"}}
        elif method not in {"view", "modify", "compare"}:
            return {"code": 0, "msg": "获取数据列表失败！", "data": {"msg": "method 参数值有误，应为 view、modify、compare 其中之一"}}

        data_handler = dataset_dict.get(uid, [])
        method_dict = {
            "view": data_handler.handle_view,
            "modify": data_handler.handle_modify,
            "compare": data_handler.handle_compare
        }

        feedback = {
            "code": 1,
            "msg": "获取数据成功！",
            "data": {
                "data": method_dict[method](data_handler.get_by_index(start))
            }
        }
    else:
        feedback = {"code": 0, "msg": "请求方法有误！", "data": {}}
    return feedback


@app.route('/get_page')
def get_dataset_by_range():
    if request.method == "GET":
        start, limit = int(request.args.get("start", 0)), int(request.args.get("limit", 10))
        uid = request.args.get("uid", "")
        method = request.args.get("method", "")

        if uid == "":
            return {"code": 0, "msg": "获取数据列表失败！", "data": {"msg": "uid 没有传递或无效！"}}
        elif method not in {"view", "modify", "compare"}:
            return {"code": 0, "msg": "获取数据列表失败！", "data": {"msg": "method 参数值有误，应为 view、modify、compare 其中之一"}}

        data_handler = dataset_dict.get(uid, [])
        method_dict = {
            "view": data_handler.handle_view,
            "modify": data_handler.handle_modify,
            "compare": data_handler.handle_compare
        }

        feedback = {
            "code": 1,
            "msg": "获取数据成功！",
            "data": {
                "list": method_dict[method](data_handler.get_by_range(start, start + limit))
            }
        }
    else:
        feedback = {"code": 0, "msg": "请求方法有误！", "data": {}}
    return feedback


@app.route('/update', methods=['POST'])
def update():
    if request.method == "POST":
        uid = request.form.get("uid", "")
        index = int(request.form.get("index", 0))
        entity_list = json.loads(request.form.get("entityList", []))

        if uid == "":
            return {"code": 0, "msg": "获取数据列表失败！", "data": {"msg": "uid 没有传递或无效！"}}

        data_handler = dataset_dict.get(uid, [])

        try:
            data_handler.update_data(index, entity_list)
            feedback = {"code": 1, "msg": "更新数据成功！", "data": {}}
        except Exception as error:
            feedback = {"code": 0, "msg": "更新数据失败！", "data": {"msg": str(error)}}
    else:
        feedback = {"code": 0, "msg": "请求方法有误！", "data": {}}
    return feedback


@app.route('/save')
def save():
    if request.method == "GET":
        uid = request.args.get("uid", "")

        if uid == "":
            return {"code": 0, "msg": "获取数据列表失败！", "data": {"msg": "uid 没有传递或无效！"}}

        data_handler = dataset_dict.get(uid, [])

        try:
            data_handler.save()
            feedback = {"code": 1, "msg": "保存数据成功！", "data": {}}
        except Exception as error:
            feedback = {"code": 0, "msg": "保存数据失败", "data": {"msg": str(error)}}
    else:
        feedback = {"code": 0, "msg": "请求方法有误！", "data": {}}
    return feedback


@app.route('/vote/output', methods=['POST'])
def output():
    if request.method == "POST":
        uid = request.form.get("uid", "")
        left_index_list = json.loads(request.form.get("leftIndexList", []))
        mid_index_list = json.loads(request.form.get("midIndexList", []))
        right_index_list = json.loads(request.form.get("rightIndexList", []))

        if uid == "":
            return {"code": 0, "msg": "投票结果导出失败！", "data": {"msg": "uid 没有传递或无效！"}}

        data_handler = dataset_dict.get(uid, [])

        try:
            tar_file_path = data_handler.output_vote_result(left_index_list, mid_index_list, right_index_list)
            feedback = {"code": 1, "msg": "投票结果导出成功！", "data": {"file": tar_file_path}}
        except Exception as error:
            feedback = {"code": 0, "msg": "投票结果导出失败！", "data": {"msg": str(error)}}
    else:
        feedback = {"code": 0, "msg": "请求方法有误！", "data": {}}
    return feedback


@app.route('/data/generator', methods=["POST"])
def data_generate():
    if request.method == "POST":
        text = request.form.get("input", "")

        output_list = data_generator.generate_negative_dataset([text])
        feedback = {
            "code": 1,
            "msg": "生成数据成功！",
            "data": {
                "output": output_list[0]
            }
        }
    else:
        feedback = {"code": 0, "msg": "请求方法有误！", "data": {}}
    return feedback


@app.route("/other/code/output", methods=["POST"])
def output_code():
    if request.method == "POST":
        file_name = request.form.get("fileName", "")
        code = request.form.get("code", "")
        file_path = "static/source/code/" + file_name

        try:
            print("/nfs/users/chenxu/project/visual_tools/" + file_path)
            with open("/nfs/users/chenxu/project/visual_tools/" + file_path, "w", encoding="utf-8") as file:
                file.write(code)
            feedback = {"code": 1, "msg": "导出代码成功！", "data": {"file": file_path}}
        except Exception as error:
            feedback = {"code": 0, "msg": "导出代码失败！", "data": {"msg": str(error)}}
    else:
        feedback = {"code": 0, "msg": "请求方法有误！", "data": {}}
    return feedback


if __name__ == '__main__':
    app.run(debug=True)
