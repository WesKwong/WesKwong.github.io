---
title: "InternVL3.5: Advancing Open-Source Multimodal Models in Versatility, Reasoning, and Efficiency"
# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Weiyun Wang
  - Zhangwei Gao
  - Lixin Gu
  - Hengjun Pu
  - Long Cui
  - xgwei
  - Zhaoyang Liu
  - Linglin Jing
  - Shenglong Ye
  - Jie Shao
  - Zhaokai Wang
  - Zhe Chen
  - Hongjie Zhang
  - Ganlin Yang
  - Haomin Wang
  - Qi Wei
  - Jinhui Yin
  - Wenhao Li
  - Erfei Cui
  - Guanzhou Chen
  - Zichen Ding
  - Changyao Tian
  - Zhenyu Wu
  - Jingjing Xie
  - Zehao Li
  - Bowen Yang
  - Yuchen Duan
  - Xuehui Wang
  - Zhi Hou
  - Haoran Hao
  - Tianyi Zhang
  - Songze Li
  - Xiangyu Zhao
  - Haodong Duan
  - Nianchen Deng
  - Bin Fu
  - Yinan He
  - Yi Wang
  - Conghui He
  - Botian Shi
  - Junjun He
  - Yingtong Xiong
  - Han Lv
  - Lijun Wu
  - Wenqi Shao
  - Kaipeng Zhang
  - Huipeng Deng
  - Biqing Qi
  - Jiaye Ge
  - Qipeng Guo
  - Wenwei Zhang
  - Songyang Zhang
  - Maosong Cao
  - Junyao Lin
  - Kexian Tang
  - Jianfei Gao
  - Haian Huang
  - Yuzhe Gu
  - Chengqi Lyu
  - Huanze Tang
  - Rui Wang
  - Haijun Lv
  - Wanli Ouyang
  - Limin Wang
  - Min Dou
  - Xizhou Zhu
  - Tong Lu
  - Dahua Lin
  - Jifeng Dai
  - Weijie Su
  - Bowen Zhou
  - Kai Chen
  - Yu Qiao
  - Wenhai Wang
  - Gen Luo

# Author notes (optional)
author_notes:
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'
  - 'Equal contribution'

date: "2025-08-25T17:59:25Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-08-25T17:59:25Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['article']

# Publication name and optional abbreviated publication name.
publication: In arXiv
publication_short: In arXiv

abstract: We introduce InternVL 3.5, a new family of open-source multimodal models that significantly advances versatility, reasoning capability, and inference efficiency along the InternVL series. A key innovation is the Cascade Reinforcement Learning (Cascade RL) framework, which enhances reasoning through a two-stage process, offline RL for stable convergence and online RL for refined alignment. This coarse-to-fine training strategy leads to substantial improvements on downstream reasoning tasks, e.g., MMMU and MathVista. To optimize efficiency, we propose a Visual Resolution Router (ViR) that dynamically adjusts the resolution of visual tokens without compromising performance. Coupled with ViR, our Decoupled Vision-Language Deployment (DvD) strategy separates the vision encoder and language model across different GPUs, effectively balancing computational load. These contributions collectively enable InternVL3.5 to achieve up to a +16.0\% gain in overall reasoning performance and a 4.05× inference speedup compared to its predecessor, i.e., InternVL3. In addition, InternVL3.5 supports novel capabilities such as GUI interaction and embodied agency. Notably, our largest model, i.e., InternVL3.5-241B-A28B, attains state-of-the-art results among open-source MLLMs across general multimodal, reasoning, text, and agentic tasks -- narrowing the performance gap with leading commercial models like GPT-5. All models and code are publicly released.

# Summary. An optional shortened abstract.
summary: ''

tags:
  - Multimodal Large Language Models
  - InternVL Series

# Display this page in the Featured widget?
featured: true

# Standard identifiers for auto-linking
# hugoblox:
#   ids:
#     doi: 10.5555/123456

# Custom links
links:
  - type: homepage
    url: https://internvl.readthedocs.io/en/latest/index.html
  - type: arxiv
    url: https://arxiv.org/abs/2504.10479
  - type: pdf
    url: https://arxiv.org/pdf/2504.10479
  - type: code
    url: https://github.com/OpenGVLab/InternVL

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
  caption: ''
  focal_point: ''
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---

<!-- > [!NOTE]
> Click the _Cite_ button above to demo the feature to enable visitors to import publication metadata into their reference management software.

> [!NOTE]
> Create your slides in Markdown - click the _Slides_ button to check out the example.

Add the publication's **full text** or **supplementary notes** here. You can use rich formatting such as including [code, math, and images](https://docs.hugoblox.com/content/writing-markdown-latex/). -->
