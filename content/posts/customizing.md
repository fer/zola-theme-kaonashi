+++
title = "Customizing Your Theme"
description = "Theme variables, shortcodes, and configuration options"
date = 2026-05-05

[taxonomies]
tags = ["theme", "guide"]

[extra]
splash = "https://placehold.co/1200x480/1a1a1a/e6e2d6?text=Customizing"
+++

Kaonashi is designed to be customized without touching SCSS. All theme variables can be overridden in your `zola.toml`.

## Theme variables

<div data-highlight="5-10"></div>

```toml
[extra.theme]
body_bg_dark = "#0f1214"
body_color_dark = "#e6e2d6"
color_border_dark = "#333"
body_font_family = "monospace, 'Courier New', Courier"
site_max_width = "900px"
border_thickness = "0.125rem"
```

### Code highlighting

Line highlighting uses a `<div data-highlight>` marker before any fenced code block:

```html
<div data-highlight="2,4-6"></div>
```

<div data-highlight="1,3"></div>

```python
def greet(name):
    print(f"Hello, {name}!")
    return True
```

## Using shortcodes

Kaonashi bundles shortcodes for YouTube embeds, images with captions, collapsible details, and more. Check the README for the full reference.
