import math


def calculate_yellowness(s_count, total_words):

    if total_words == 0:
        return 0

    yellowness = (s_count / total_words) * (total_words ** 0.5) * 100
    if yellowness > 100:
        yellowness = 100
    return round(yellowness, 2)


