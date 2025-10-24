---
title: 'ArchCAD-400K: An Open Large-Scale Architectural CAD Dataset and New Baseline for Panoptic Symbol Spotting'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Ruifeng Luo
  - Zhengjie Liu
  - Tianxiao Cheng
  - Jie Wang
  - Tongjie Wang
  - xgwei
  - Haomin Wang
  - Yanpeng Li
  - Fu Chai
  - Fei Cheng
  - Shenglong Ye
  - Wenhai Wang
  - Yanting Zhang
  - Yu Qiao
  - Hongjie Zhang
  - Xianzhong Zhao

# Author notes (optional)
author_notes:
  - 'Equal contribution'
  - 'Equal contribution'

date: "2025-03-28T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-03-28T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: In Neural Information Processing Systems 2025
publication_short: In NeurIPS 2025

abstract: Recognizing symbols in architectural CAD drawings is critical for various advanced engineering applications. In this paper, we propose a novel CAD data annotation engine that leverages intrinsic attributes from systematically archived CAD drawings to automatically generate high-quality annotations, thus significantly reducing manual labeling efforts. Utilizing this engine, we construct ArchCAD-400K, a large-scale CAD dataset consisting of 413,062 chunks from 5538 highly standardized drawings, making it over 26 times larger than the largest existing CAD dataset. ArchCAD-400K boasts an extended drawing diversity and broader categories, offering line-grained annotations. Furthermore, we present a new baseline model for panoptic symbol spotting, termed Dual-Pathway Symbol Spotter (DPSS). It incorporates an adaptive fusion module to enhance primitive features with complementary image features, achieving state-of-the-art performance and enhanced robustness. Extensive experiments validate the effectiveness of DPSS, demonstrating the value of ArchCAD-400K and its potential to drive innovation in architectural design and construction.

# Summary. An optional shortened abstract.
summary: ''

tags:
  - Panoptic Symbol Spotting
  - CAD Drawings
  - Datasets

# Display this page in the Featured widget?
featured: true

# Standard identifiers for auto-linking
# hugoblox:
#   ids:
#     doi: 10.5555/123456

# Custom links
links:
  - type: homepage
    url: https://archiai-lab.github.io/ArchCAD.github.io
  - type: arxiv
    url: https://arxiv.org/abs/2503.22346
  - type: pdf
    url: https://arxiv.org/pdf/2503.22346
  - type: code
    url: https://github.com/ArchiAI-LAB/ArchCAD-400K

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
  caption: 'Overview of DPSS'
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
