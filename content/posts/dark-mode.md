+++
title = "Dark Mode & Shortcodes Demo"
description = "Showcasing theme features and bundled shortcodes"
date = 2026-05-07

[taxonomies]
tags = ["demo", "shortcodes"]

[extra]
splash = "https://placehold.co/1200x480/1a1a1a/e6e2d6?text=Dark+Mode"
+++

This post demonstrates Kaonashi's bundled shortcodes and features.

## Image with caption

{{ image(src="https://placehold.co/800x400/333/e6e2d6?text=Sample+Image", alt="Sample image", caption="A placeholder image with caption") }}

## Collapsible details

{% details(summary="Click to reveal") %}
Hidden content revealed on click. Supports **markdown** and code blocks:

```json
{ "key": "value" }
```
{% end %}

## FAQ shortcode

{% faq(question="What is Zola?") %}
Zola is a fast static site generator written in Rust, with hot-reload, Sass compilation, and a built-in search index.
{% end %}

{% faq(question="What is Kaonashi?") %}
Kaonashi is a minimalist Zola theme with a terminal-inspired aesthetic, dark/light mode, and responsive card grids.
{% end %}
