#!/usr/bin/env python3
import os
import shutil
import random
from PIL import Image

# 需要的图片数量
NEEDED_IMAGES = 112

# 最早允许的年份（排除比这更早的照片）
MIN_YEAR = 2024

# 路径
images_dir = 'images'
thumbs_dir = 'images/thumbs'
target_dir = 'images/2026'

# 确保目标目录存在
os.makedirs(target_dir, exist_ok=True)

def get_exif_year(file_path):
    """获取照片的 EXIF 拍摄年份"""
    try:
        img = Image.open(file_path)
        exif = img._getexif()
        if exif:
            dt = exif.get(36867) or exif.get(306)
            if dt:
                return int(dt[:4])
    except:
        pass
    return None

# 筛选照片：排除已知早于 MIN_YEAR 的照片
thumb_files = []
excluded = []
for i in range(110):  # 0-109
    thumb_path = os.path.join(thumbs_dir, f'{i}.jpg')
    orig_path = os.path.join(images_dir, f'{i}.jpg')
    if not os.path.exists(thumb_path):
        continue
    # 从原图读取 EXIF 年份
    year = get_exif_year(orig_path) if os.path.exists(orig_path) else None
    if year is not None and year < MIN_YEAR:
        excluded.append((i, year))
        continue
    thumb_files.append(thumb_path)

print(f'找到 {len(thumb_files)} 张符合条件的照片（{MIN_YEAR}年及以后 + 无日期信息的）')
if excluded:
    print(f'排除了 {len(excluded)} 张旧照片: {[(f"{i}.jpg ({y}年)" ) for i, y in excluded]}')

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

