+++
title = "FAQ"
+++

{% faq(question="How do I install this theme?") %}
Add the theme as a git submodule and set `theme = "zola-theme-kaonashi"` in your `zola.toml`. See the [README](https://github.com/fer/zola-theme-kaonashi) for full instructions.
{% end %}

{% faq(question="Can I customize the colors?") %}
Yes. All theme colors are configurable via `[extra.theme]` in your `zola.toml`. You can set dark and light mode colors independently.
{% end %}

{% faq(question="Does it support tags?") %}
Yes. Enable the tags taxonomy in your `zola.toml` and use `[taxonomies]tags = [...]` in your page frontmatter.
{% end %}

{% faq(question="Is there a search feature?") %}
Yes. Set `build_search_index = true` in your `zola.toml` to enable client-side full-text search via elasticlunr.
{% end %}
