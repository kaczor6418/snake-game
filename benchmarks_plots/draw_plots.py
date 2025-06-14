import csv
import math
import numpy as np
import json
from matplotlib import pyplot as plt
from operator import itemgetter

plt.style.use('fivethirtyeight')
bar_width = 0.25
envs_sizes = [5, 7, 9, 10, 12]
epochs_counts = [100, 1000, 10000, 20000, 40000, 60000, 80000, 100000, 120000]
raw_data = json.load(open('../benchmarks/snake-game-q-learning-vs-ddq-learning-cpu-webl-webgpu.json'))
q_learning = list(filter(lambda record: (record['backend'] == 'cpu'), raw_data))
ddq_learning_webgl = list(filter(lambda record: (record['backend'] == 'webgl'), raw_data))
ddq_learning_webgpu = list(filter(lambda record: (record['backend'] == 'webgpu'), raw_data))


def group_by_epochs(records):
    result = {
        100: [],
        1000: [],
        10000: [],
        20000: [],
        40000: [],
        60000: [],
        80000: [],
        100000: [],
        120000: [],
    }
    for record in records:
        result[record['epochs']].append(record)
    return result


def group_by_env_size(records):
    result = {
        5: [],
        7: [],
        9: [],
        10: [],
        12: [],
    }
    for record in records:
        result[record['rows']].append(record)
    return result


def create_bar_chart_for_learn_epochs(cpu_data, webgl_data, webgpu_data, epochs, title, x_label):
    env_indexes = np.arange(len(envs_sizes))
    cpu_learn_times = list(map(lambda record: record['learnTime'], cpu_data))
    webgl_learn_times = list(map(lambda record: record['learnTime'], webgl_data))
    webgpu_learn_times = list(map(lambda record: record['learnTime'], webgpu_data))
    y_max = max(webgl_learn_times)
    # y_step = math.ceil(y_max / 50)
    # y_labels = list(range(0, y_max, y_step))
    plt.figure(figsize=(17, 11))
    plt.bar(env_indexes - bar_width, cpu_learn_times, width=bar_width, label='Q-Learning (CPU)', color='#990000')
    plt.bar(env_indexes, webgl_learn_times, width=bar_width, label='DDQ-Learning (WebGL)', color='#009900')
    plt.bar(env_indexes + bar_width, webgpu_learn_times, width=bar_width, label='DDQ-Learning (WebGPU)',
            color='#000099')
    plt.xticks(ticks=env_indexes, labels=envs_sizes)
    plt.xlabel(x_label)
    # plt.yticks(ticks=y_labels, labels=y_labels)
    # plt.ylim([0, y_max])
    # plt.ticklabel_format(style='sci', axis='y', scilimits=(0, y_max))
    plt.yscale('log')
    plt.ylabel('Czas nauki [ms]')
    plt.legend(loc='upper left')
    plt.tight_layout()
    plt.savefig(f'images/learn/bar-chart-{epochs}.png', bbox_inches='tight')


def create_line_chart_for_learn_env_size(cpu_data, webgl_data, webgpu_data, env_size, title, x_label):
    x_indexes = np.arange(len(epochs_counts))
    cpu_learn_times = list(map(lambda record: record['learnTime'], cpu_data))
    webgl_learn_times = list(map(lambda record: record['learnTime'], webgl_data))
    webgpu_learn_times = list(map(lambda record: record['learnTime'], webgpu_data))
    y_max = max(webgl_learn_times)
    # y_step = math.ceil(y_max / 50)
    # y_labels = list(range(0, y_max, y_step))
    plt.figure(figsize=(17, 11))
    plt.plot(x_indexes, cpu_learn_times, label='Q-Learning (CPU)', color='#990000', marker='o')
    plt.plot(x_indexes, webgl_learn_times, label='DDQ-Learning (WebGL)', color='#009900', marker='o')
    plt.plot(x_indexes, webgpu_learn_times, label='DDQ-Learning (WebGPU)', color='#000099', marker='o')
    plt.xticks(ticks=x_indexes, labels=epochs_counts)
    plt.xlabel(x_label)
    # plt.yticks(ticks=y_labels, labels=y_labels)
    # plt.ylim([0, y_max])
    # plt.ticklabel_format(scale='log', axis='y', scilimits=(0, y_max))
    plt.yscale('log')
    plt.ylabel('Czas nauki [ms]')
    plt.legend(loc='upper left')
    plt.tight_layout()
    plt.savefig(f'images/learn/line-chart-{env_size}.png', bbox_inches='tight')


def create_bar_chart_for_food_epochs(cpu_data, webgl_data, webgpu_data, epochs, title, x_label):
    env_indexes = np.arange(len(envs_sizes))
    cpu_eaten_food = list(map(lambda record: record['eatenFood'], cpu_data))
    webgl_eaten_food = list(map(lambda record: record['eatenFood'], webgl_data))
    webgpu_eaten_food = list(map(lambda record: record['eatenFood'], webgpu_data))
    all_food_max = list(map(lambda record: record['foodCount'], cpu_data))
    y_max = max(all_food_max) + 1
    y_labels = list(range(0, y_max))
    plt.figure(figsize=(17, 11))
    plt.bar(env_indexes - bar_width, cpu_eaten_food, width=bar_width, label='Q-Learning (CPU)', color='#990000')
    plt.bar(env_indexes, webgl_eaten_food, width=bar_width, label='DDQ-Learning (WebGL)', color='#009900')
    plt.bar(env_indexes + bar_width, webgpu_eaten_food, width=bar_width, label='DDQ-Learning (WebGPU)',
            color='#000099')
    for idx in range(0, len(all_food_max)):
        if idx == 0:
            plt.hlines(y=all_food_max[idx], linestyles='--', xmin=idx - 1.5 * bar_width, xmax=idx + 1.5 * bar_width, label='Maksymalna ilość jedzonek dla środowiska')
        plt.hlines(y=all_food_max[idx], linestyles='--', xmin=idx - 1.5 * bar_width, xmax=idx + 1.5 * bar_width)
    plt.xticks(ticks=env_indexes, labels=envs_sizes)
    plt.yticks(ticks=y_labels, labels=y_labels)
    plt.xlabel(x_label)
    plt.ylabel('Zjedzone obiekty')
    plt.legend(loc='upper left')
    plt.ylim([0, y_max])
    plt.tight_layout()
    plt.savefig(f'images/food/bar-chart-{epochs}.png', bbox_inches='tight')


def create_line_chart_for_food_env_size(cpu_data, webgl_data, webgpu_data, env_size, title, x_label):
    x_indexes = np.arange(len(epochs_counts))
    cpu_eaten_food = list(map(lambda record: record['eatenFood'], cpu_data))
    webgl_eaten_food = list(map(lambda record: record['eatenFood'], webgl_data))
    webgpu_eaten_food = list(map(lambda record: record['eatenFood'], webgpu_data))
    y_max = cpu_data[0]['foodCount'] + 1
    y_labels = list(range(0, y_max))
    plt.figure(figsize=(17, 11))
    plt.plot(x_indexes, cpu_eaten_food, label='Q-Learning (CPU)', color='#990000', marker='o')
    plt.plot(x_indexes, webgl_eaten_food, label='DDQ-Learning (WebGL)', color='#009900', marker='o')
    plt.plot(x_indexes, webgpu_eaten_food, label='DDQ-Learning (WebGPU)', color='#000099', marker='o')
    plt.xticks(ticks=x_indexes, labels=epochs_counts)
    plt.yticks(ticks=y_labels, labels=y_labels)
    plt.xlabel(x_label)
    plt.ylabel('Zjedzone obiekty')
    plt.legend(loc='upper left')
    plt.ylim([0, y_max])
    plt.tight_layout()
    plt.savefig(f'images/food/line-chart-{env_size}.png', bbox_inches='tight')


def create_time_env_size_bar_charts_for_different_amount_of_epochs(cpu_data, webgl_data, webgpu_data):
    grouped_cpu_data = group_by_epochs(cpu_data)
    grouped_webgl_data = group_by_epochs(webgl_data)
    grouped_webgpu_data = group_by_epochs(webgpu_data)
    for epochs_count in epochs_counts:
        create_bar_chart_for_learn_epochs(grouped_cpu_data[epochs_count], grouped_webgl_data[epochs_count],
                                          grouped_webgpu_data[epochs_count],
                                          epochs_count,
                                          f'Ilość potrzebnego czasu do nauki w zależności od rozmiaru środowiska dla {epochs_count} epok',
                                          'Rozmiar środowiska')
        plt.clf()
        create_bar_chart_for_food_epochs(grouped_cpu_data[epochs_count], grouped_webgl_data[epochs_count],
                                         grouped_webgpu_data[epochs_count],
                                         epochs_count,
                                         f'Ilość zjedzonych obiektów w zależności od rozmiaru środowiska dla {epochs_count} epok',
                                         'Rozmiar środowiska')
        plt.clf()


def create_time_env_size_line_charts_for_different_amount_of_epochs(cpu_data, webgl_data, webgpu_data):
    grouped_cpu_data = group_by_env_size(cpu_data)
    grouped_webgl_data = group_by_env_size(webgl_data)
    grouped_webgpu_data = group_by_env_size(webgpu_data)
    for env_size in envs_sizes:
        create_line_chart_for_learn_env_size(grouped_cpu_data[env_size], grouped_webgl_data[env_size],
                                             grouped_webgpu_data[env_size],
                                             env_size,
                                             f'Ilość potrzebnego czasu do nauki w zależności od ilości epok dla planszy {env_size}x{env_size}',
                                             'Ilość epok')
        plt.clf()
        create_line_chart_for_food_env_size(grouped_cpu_data[env_size], grouped_webgl_data[env_size],
                                            grouped_webgpu_data[env_size],
                                            env_size,
                                            f'Ilość zjedzonych obiektów w zależności od ilości epok dla planszy {env_size}x{env_size}',
                                            'Ilość epok')
        plt.clf()


create_time_env_size_bar_charts_for_different_amount_of_epochs(q_learning, ddq_learning_webgl, ddq_learning_webgpu)
create_time_env_size_line_charts_for_different_amount_of_epochs(q_learning, ddq_learning_webgl, ddq_learning_webgpu)
