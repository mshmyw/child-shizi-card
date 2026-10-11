#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把多文件版本打包成一个自包含的单文件 index.html（方便单独发给别人 / 丢进聊天窗口）。

拆开是为了好维护，单文件是为了好传播 —— 两个都要，所以用这个脚本切换。

用法：
    python3 tools/build_single_file.py            # 输出 build/hanzi-single.html
    python3 tools/build_single_file.py out.html   # 指定输出文件名
"""

import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join('build', 'hanzi-single.html')
    if not os.path.isabs(out):
        out = os.path.join(ROOT, out)

    html = read('index.html')
    css = read('styles.css')
    cards = read('data/cards.js')
    app = read('app.js')

    # 1) 外链 CSS -> 内联
    html, n1 = re.subn(r'<link rel="stylesheet" href="styles\.css" />',
                       '<style>\n' + css.rstrip() + '\n</style>', html, count=1)

    # 2) 两个外链 JS -> 内联（顺序不能变：先数据后逻辑）
    inline = ('<script>\n' + cards.rstrip() + '\n</script>\n'
              '<script>\n' + app.rstrip() + '\n</script>')
    # 用替换函数而不是替换串：re.sub 的替换串里 $& / $1 有特殊含义，
    # 一旦卡片数据里出现这些字符就会静默生成坏文件
    html, n2 = re.subn(r'<script src="data/cards\.js"></script>\s*\n<script src="app\.js"></script>',
                       lambda m: inline, html, count=1)

    # 3) 单文件里不需要（也没有意义）Service Worker 和 manifest
    html = html.replace('<link rel="manifest" href="manifest.json" />\n', '')
    html = re.sub(r'\s*<link rel="icon"[^>]*>\n', '\n', html)
    html = html.replace('  registerSW();\n', '')

    # 内联进去的内容里若有 </script> 会提前闭合标签，直接拦下来
    for name, payload in (('data/cards.js', cards), ('app.js', app)):
        if re.search(r'</script', payload, re.I):
            print(f'❌ {name} 里含有 </script，无法安全内联')
            return 1

    if n1 != 1 or n2 != 1:
        print(f'⚠️  替换数量不对：css={n1} js={n2}（请检查 index.html 是否被改过）')
        return 1

    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)

    kb = os.path.getsize(out) / 1024
    print(f'✅ 已生成单文件：{os.path.relpath(out, ROOT)}  ({kb:.0f} KB, {html.count(chr(10))+1} 行)')
    print('   双击即可打开；不含 Service Worker，所以离线缓存不生效（其它功能都在）。')
    return 0


if __name__ == '__main__':
    sys.exit(main())
