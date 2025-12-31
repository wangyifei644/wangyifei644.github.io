#!/usr/bin/env python3
import os
import shutil
import random

# 需要的图片数量
NEEDED_IMAGES = 112

# 路径
thumbs_dir = 'images/thumbs'
target_dir = 'images/2026'

# 确保目标目录存在
os.makedirs(target_dir, exist_ok=True)

# 获取所有缩略图文件
thumb_files = []
for i in range(105):  # 0-104
    thumb_path = os.path.join(thumbs_dir, f'{i}.jpg')
    if os.path.exists(thumb_path):
        thumb_files.append(thumb_path)

print(f'找到 {len(thumb_files)} 张缩略图')

# 如果需要的图片数量超过可用图片，则重复使用
if NEEDED_IMAGES > len(thumb_files):
    print(f'需要 {NEEDED_IMAGES} 张图片，但只有 {len(thumb_files)} 张可用，将重复使用')
    selected_files = random.sample(thumb_files, len(thumb_files))
    # 随机选择剩余的图片
    remaining = NEEDED_IMAGES - len(thumb_files)
    selected_files.extend(random.choices(thumb_files, k=remaining))
else:
    # 随机选择需要的数量
    selected_files = random.sample(thumb_files, NEEDED_IMAGES)

# 打乱顺序
random.shuffle(selected_files)

# 复制文件到目标目录
print(f'开始复制 {len(selected_files)} 张图片到 {target_dir}...')
for i, src_path in enumerate(selected_files):
    dst_path = os.path.join(target_dir, f'{i}.jpg')
    shutil.copy2(src_path, dst_path)
    if (i + 1) % 20 == 0:
        print(f'已复制 {i + 1}/{len(selected_files)} 张图片...')

print(f'完成！已将 {len(selected_files)} 张图片复制到 {target_dir}')

