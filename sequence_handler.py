import os
import uuid
import pandas as pd
import jsonlines
from collections import defaultdict


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

    def handle(self, dataset: list):
        belong_data_dict = defaultdict(list)

        for data in dataset:
            char_list = list(data.get("text", ""))
            label_list = list(data.get("label_list", []))
            belong_info = data.get("belong", "默认分组")
            entity_list = data.get("entity_list", [])
            show_type = 0

            # 设置每个位置的字符与标记信息
            type_dict, type_index = {"default": 0}, 1
            index_list = []

            for i, label in enumerate(label_list):
                label_type = "default"

                if label != "O":
                    if "-" in label:
                        label_type = label.split("-")[-1]
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

            # 设置抽取实体信息
            entity_type_dict = defaultdict(list)
            new_entity_list = []

            for entity_group in entity_list:
                entity_type_dict[entity_group[0].get("type", "default")].append(entity_group)

            for entity_type, entity_list in entity_type_dict.items():
                new_entity_list.append({
                    "name": entity_type,
                    "list": entity_list
                })

            data_result_item = {
                "type": show_type,
                "entityList": new_entity_list,
                "indexList": index_list
            }
            belong_data_dict[belong_info].append(data_result_item)

        return [{
            "name": belong_info,
            "data": data_list
        } for belong_info, data_list in belong_data_dict.items()]

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
