import jieba
import tqdm
import random


class DataGenerator:

    def __init__(self, word_sim_dict: dict):
        self.word_sim_dict = word_sim_dict

    def generate_negative_dataset(self, data_list: list, max_seq_len: int = 512, max_build_times: int = 3, top_k: int = 5, max_iter_times: int = 5):
        result_list = []

        for data in tqdm.tqdm(data_list):
            build_times = min(max_build_times, round(max_build_times * len(data) / max_seq_len))
            choice_word_set = set()
            word_list = jieba.lcut(data)
            label_list = [["0"] * len(word) for word in word_list]
            record_dict = {
                "choice_word": [],
                "replace_word": []
            }
            max_iter_times = max(max_build_times, max_iter_times)
            iter_count = 0

            while len(choice_word_set) < build_times and iter_count < max_iter_times:
                iter_count += 1
                word_index = random.randint(0, len(word_list) - 1)
                word = word_list[word_index]

                if word in {"。", "？", "！", ",", "，", ".", ":", "：", ")", "(", "）", "（", "；",
                            ";"} or word in choice_word_set:
                    continue

                # 挑选候选词，并进行替换
                try:
                    word_candidate = random.choice(self.word_sim_dict[word][:5])[0]
                except TypeError as error:
                    # 若选中的 word 在 dimsim 中报错，则直接跳过当前操作
                    continue
                except IndexError as error:
                    continue
                except Exception as error:
                    continue

                word_list[word_index] = word_candidate
                label_list[word_index] = ["1"] * len(word_candidate)
                choice_word_set.add(word_candidate)
                record_dict["choice_word"].append(word)
                record_dict["replace_word"].append(word_candidate)

            index_list = []
            label_list = " ".join([" ".join(label) for label in label_list]).split(" ")
            source_str, replace_str = data, "".join(word_list)

            for i, label in enumerate(label_list):
                index_list.append({
                    "index": i,
                    "label": label_list[i],
                    "src_char": source_str[i],
                    "tgt_char": replace_str[i],
                    "labelColor": "black" if label != "1" else "red"
                })

            result_list.append({
                "source": source_str,
                "replace": replace_str,
                "info": index_list,
                "record": record_dict
            })

        return result_list
