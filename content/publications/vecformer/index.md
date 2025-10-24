---
title: 'Point or Line? Using Line-based Representation for Panoptic Symbol Spotting in CAD Drawings'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - xgwei
  - Haomin Wang
  - Shenglong Ye
  - Ruifeng Luo
  - Yanting Zhang
  - Lixin Gu
  - Jifeng Dai
  - Yu Qiao
  - Wenhai Wang
  - Hongjie Zhang

# Author notes (optional)
author_notes:
  - 'Equal contribution'
  - 'Equal contribution'

date: "2025-05-29T12:33:11Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-05-29T12:33:11Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: In Neural Information Processing Systems 2025
publication_short: In NeurIPS 2025

abstract: We study the task of panoptic symbol spotting, which involves identifying both individual instances of countable things and the semantic regions of uncountable stuff in computer-aided design (CAD) drawings composed of vector graphical primitives. Existing methods typically rely on image rasterization, graph construction, or point-based representation, but these approaches often suffer from high computational costs, limited generality, and loss of geometric structural information. In this paper, we propose VecFormer, a novel method that addresses these challenges through line-based representation of primitives. This design preserves the geometric continuity of the original primitive, enabling more accurate shape representation while maintaining a computation-friendly structure, making it well-suited for vector graphic understanding tasks. To further enhance prediction reliability, we introduce a Branch Fusion Refinement module that effectively integrates instance and semantic predictions, resolving their inconsistencies for more coherent panoptic outputs. Extensive experiments demonstrate that our method establishes a new state-of-the-art, achieving 91.1 PQ, with Stuff-PQ improved by 9.6 and 21.2 points over the second-best results under settings with and without prior information, respectively, highlighting the strong potential of line-based representation as a foundation for vector graphic understanding.

# Summary. An optional shortened abstract.
summary: ''

tags:
  - Panoptic Symbol Spotting
  - Representation Learning
  - CAD Drawings

# Display this page in the Featured widget?
featured: true

# Standard identifiers for auto-linking
# hugoblox:
#   ids:
#     doi: 10.5555/123456

# Custom links
links:
  - type: homepage
    url: https://hmwang2002.github.io/release/vecformer
  - type: arxiv
    url: https://arxiv.org/abs/2505.23395
  - type: pdf
    url: https://arxiv.org/pdf/2505.23395
  - type: code
    url: https://github.com/WesKwong/VecFormer

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
  caption: 'Overview of VecFormer'
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
