+++
title = "Getting Started with Zola"
description = "How to set up a static site with Zola and the Kaonashi theme"
date = 2026-05-03

[taxonomies]
tags = ["zola", "tutorial"]

[extra]
splash = "https://placehold.co/1200x480/1a1a1a/e6e2d6?text=Getting+Started"
+++

[Zola](https://www.getzola.org) is a fast static site generator written in Rust. This guide walks through setting up a site with the Kaonashi theme.

## Installation

```sh
git submodule add https://github.com/fer/zola-theme-kaonashi themes/zola-theme-kaonashi
```

Then add to your `zola.toml`:

```toml
theme = "zola-theme-kaonashi"
compile_sass = true
```

## Adding content

Create pages and sections under `content/`. See the [theme documentation](https://github.com/fer/zola-theme-kaonashi) for the recommended content structure.

## Building

```sh
zola build   # outputs to public/
zola serve   # local dev server with live reload
```
