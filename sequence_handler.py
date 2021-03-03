import os
import uuid
import pandas as pd
import jsonlines
from collections import defaultdict
from seqeval import metrics


class SequenceHandler:

    def __init__(self):
        self.dataset = []
        self.file_path = ""
        self.color_list = ["black", "red", "orange", "yellow", "green", "blue", "purple"]

    def set_dataset(self, dataset: list):
        self.dataset = dataset

    def get_by_index(self, index: int):
        return self.dataset[index]

    def get_by_range(self, start: int, end: int):
        return self.dataset[start: end]

    def update_data(self, index: int, entity_list: list):
        for group_item in entity_list:
            for item in group_item:
                item["start"] = int(item["start"])
                item["end"] = int(item["end"])

        self.dataset[index]["entity_list"] = entity_list[0] if entity_list else []

    def save(self):
        with jsonlines.open(self.file_path, "w") as writer:
            for data in self.dataset:
                writer.write(data)

    @staticmethod
    def get_metrics(pred_list: list, label_list: list) -> dict:
        """
        获取序列标注的各项评估指标
        :param pred_list:  list 模型预测的标签序列
        :param label_list: list 人为标注的标签序列
        :return: dict 包含各类评估指标的字典
        """
        if len(pred_list) == 0:
            return {
                "accuracy": 0, "precision": 0, "recall": 0, "f1": 0
            }

        return {
            "accuracy": "{:.5f}".format(metrics.accuracy_score(label_list, pred_list)),
            "precision": "{:.5f}".format(metrics.precision_score(label_list, pred_list)),
            "recall": "{:.5f}".format(metrics.recall_score(label_list, pred_list)),
            "f1": "{:.5f}".format(metrics.f1_score(label_list, pred_list))
        }

    def handle_view(self, dataset: list) -> dict:
        """
        序列标注查看页面的数据处理代码
        :param dataset: list 待展示的数据列表
        :return: dict 序列标注查看页面所需的数据格式
        """
        belong_data_dict = defaultdict(list)
        eval_pred_list, eval_label_list = [], []

        for data in dataset:
            char_list = list(data.get("text", ""))
            pred_list = list(data.get("pred_list", []))
            label_list = list(data.get("label_list", []))
            belong_info = data.get("belong", "默认分组")
            entity_list = data.get("entity_list", [])

            # 设置每个位置的字符与标记信息
            type_dict, type_index = {"default": 0}, 1
            index_list = []

            if len(label_list) == 0:
                label_list = ["_"] * len(pred_list)
            else:
                eval_pred_list.append(pred_list)
                eval_label_list.append(label_list)

            for i, pred in enumerate(pred_list):
                pred_type, label_type = "default", "default"
                label = label_list[i]

                if pred != "O":
                    if "-" in pred:
                        pred_split = pred.split("-")
                        pred, pred_type = pred_split[0], pred_split[-1]
                    else:
                        pred_type = "red"

                    if pred_type not in type_dict:
                        type_dict[pred_type] = type_index
                        type_index += 1

                if label != "O":
                    if "-" in label:
                        label_split = label.split("-")
                        label, label_type = label_split[0], label_split[-1]
                    else:
                        label_type = "red"

                    if label_type not in type_dict:
                        type_dict[label_type] = type_index
                        type_index += 1

                index_list.append({
                    "pos": i,
                    "char": char_list[i],
                    "pred": pred,
                    "label": label,
                    "predColor": self.color_list[type_dict[pred_type]],
                    "labelColor": self.color_list[type_dict[label_type]]
                })

            # 设置抽取实体信息
            entity_type_dict = defaultdict(list)
            new_entity_list = []

            for entity_group in entity_list:
                if type(entity_group) == dict:
                    entity_type_dict[entity_group.get("type", "default")].append([entity_group])
                else:
                    entity_type_dict[entity_group[0].get("type", "default")].append(entity_group)

            for entity_type, entity_list in entity_type_dict.items():
                new_entity_list.append({
                    "name": entity_type,
                    "list": entity_list
                })

            data_result_item = {
                # "type": show_type,
                "entityList": new_entity_list,
                "indexList": index_list
            }
            belong_data_dict[belong_info].append(data_result_item)

        data_list = [{
            "name": belong_info,
            "data": data_list
        } for belong_info, data_list in belong_data_dict.items()]

        return {
            "data": data_list,
            "eval": self.get_metrics(eval_pred_list, eval_label_list)
        }

    def handle_modify(self, data: dict):
        char_list = list(data.get("text", ""))
        label_list = data.get("label_list", [])
        entity_list = data.get("entity_list", [])
        show_type = 0

        # 设置每个位置的字符与标记信息
        type_dict, type_index = {"default": 0}, 1
        index_list = []

        for i, label in enumerate(label_list):
            label_type = "default"

            if label != "O":
                if "-" in label:
                    label_split = label.split("-")
                    label, label_type = label_split[0], label_split[-1]
                else:
                    label_type = "red"

                if label_type not in type_dict:
                    type_dict[label_type] = type_index
                    type_index += 1

            index_list.append({
                "pos": i,
                "char": char_list[i],
                "label": label,
                "color": self.color_list[type_dict[label_type]]
            })

        return {
            "type": show_type,
            "entityList": [entity_list],
            "indexList": index_list
        }

    @staticmethod
    def handle_compare(dataset: list):
        result_list = []

        for data in dataset:
            char_list = list(data.get("source", ""))
            first_dict = data.get("first", {})
            second_dict = data.get("second", {})
            index_list = []

            for i, char in enumerate(char_list):
                index_list.append({
                    "text": i,
                    "char": char,
                    "first": {
                        "label": first_dict["label"][i],
                        "color": "black"
                    },
                    "second": {
                        "label": second_dict["label"][i],
                        "color": "black"
                    }
                })

            for single_item in first_dict["single"]:
                start, end, label_type = single_item[1], single_item[2], single_item[3]

                for i in range(start, end + 1):
                    index_list[i]["first"]["color"] = "red"

            for para_group in first_dict["para"]:
                for para_item in para_group:
                    start, end, label_type = para_item[1], para_item[2], para_item[3]

                    for i in range(start, end + 1):
                        index_list[i]["first"]["color"] = "blue"

            for single_item in second_dict["single"]:
                start, end, label_type = single_item[1], single_item[2], single_item[3]

                for i in range(start, end + 1):
                    index_list[i]["second"]["color"] = "red"

            for para_group in second_dict["para"]:
                for para_item in para_group:
                    start, end, label_type = para_item[1], para_item[2], para_item[3]

                    for i in range(start, end + 1):
                        index_list[i]["second"]["color"] = "blue"

            result_list.append({
                "view": index_list,
                "first": {
                    "single": first_dict.get("single_only", []),
                    "para": first_dict.get("para_only", [])
                },
                "second": {
                    "single": second_dict.get("single_only", []),
                    "para": second_dict.get("para_only", [])
                }
            })
        return result_list

    def output_vote_result(self, left_list: list, mid_list: list, right_list: list):
        file_name = str(uuid.uuid4()).replace("-", "")
        file_dir = "static/vote/" + file_name
        left_data_list = [self.dataset[left_index] for left_index in left_list]
        mid_data_list = [self.dataset[mid_index] for mid_index in mid_list]
        right_data_list = [self.dataset[right_index] for right_index in right_list]

        os.system("mkdir {}".format(file_dir))

        pd.DataFrame(data=left_data_list).to_csv(os.path.join(file_dir, "First Good.csv"))
        pd.DataFrame(data=mid_data_list).to_csv(os.path.join(file_dir, "Same.csv"))
        pd.DataFrame(data=right_data_list).to_csv(os.path.join(file_dir, "Second Good.csv"))

        os.system("zip -q -r static/vote/{}.zip {}".format(file_name, file_dir))
        return "static/vote/vote_result.tar.gz"
