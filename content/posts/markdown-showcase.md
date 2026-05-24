+++
title = "Markdown Showcase"
description = "A living reference of every markdown element styled by the Kaonashi theme"
date = 2026-05-15

[taxonomies]
tags = ["theme", "markdown", "showcase"]

[extra]
pinned = true
+++

A reference for every markup element supported by Zola and styled by Kaonashi.

---

## Text Formatting

**bold**, *italic*, ***bold and italic***, ~~strikethrough~~, `inline code`, <mark>highlight</mark>, H<sub>2</sub>O, E = mc<sup>2</sup>, <kbd>Ctrl</kbd> + <kbd>C</kbd>.

## Headings

### This is an h3 heading

#### This is an h4 heading

## Links

[Zola documentation](https://www.getzola.org/documentation/) and <https://example.com>.

## Images

{{ image(src="/images/logo.png", alt="Site logo", caption="The Kaonashi site logo") }}

## Lists

1. First ordered
2. Second ordered
   1. Nested

* Unordered item
  * Nested item

* [x] Completed task
* [ ] Pending task

## Code

```sh
git submodule add https://github.com/fer/zola-theme-kaonashi themes/zola-theme-kaonashi
zola serve
```

```toml
theme = "zola-theme-kaonashi"
compile_sass = true
```

## Tables

| Left | Center | Right |
|:-----|:------:|------:|
| One  | Two    | Three |
| Alpha | Beta  | Gamma |

## Blockquotes

> A blockquote with **bold**, *italic*, and `inline code`.
>
> > Nested blockquote.

## Horizontal rules

---

## Footnotes

Inline footnote reference.[^1]

[^1]: The footnote content with a backlink.

## Code line highlighting

<div data-highlight="1,3-4"></div>

```python
def hello():
    print("Hello, Kaonashi!")
    return True
```

## Shortcodes

Some text before block shortcodes.
{% faq(question="What is Zola?") %}
A fast static site generator written in Rust.
{% end %}

{% faq(question="What is Kaonashi?") %}
A minimal Zola theme with a terminal-inspired aesthetic.
{% end %}

{% details(summary="Click to reveal") %}
Hidden content revealed on click. Supports **markdown**.
{% end %}
