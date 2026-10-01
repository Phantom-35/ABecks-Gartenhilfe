---
name: cleanup-unused-code
description: 'Use when auditing an HTML, CSS, or vanilla JavaScript website for unused, obsolete, duplicated, or fully overridden code. Focuses on CSS cascade cleanup, unused selectors, dead declarations, and safe removal with reference and browser checks.'
argument-hint: 'Describe the files or scope to audit for unused code.'
user-invocable: true
disable-model-invocation: false
---

# Clean Up Unused Code

## Goal

Find code that is no longer needed in the requested workspace and remove only changes supported by evidence. Pay special attention to CSS declarations that are fully overridden later, selectors that match no markup, obsolete responsive rules, and duplicated rules.

## Procedure

1. Establish the scope from the request. Inspect the repository structure, entry points, stylesheets, scripts, and project documentation before editing.
2. Check the working tree before making changes. Preserve unrelated user changes and do not reset or overwrite them.
3. Build a reference inventory:
   - Find every stylesheet and script linked by the HTML pages.
   - Find class names, IDs, data attributes, custom properties, animation names, and JavaScript selectors used by the markup or scripts.
   - Treat dynamic selectors assembled in JavaScript, form states, anchor targets, pseudo-classes, pseudo-elements, and generated content as possible usages.
4. Audit CSS locally and in cascade order. For each candidate, determine whether it is:
   - a selector that cannot match any current markup or runtime-created element;
   - a declaration whose value is always superseded by a later declaration with equal or greater applicability, specificity, and importance;
   - a duplicate declaration or rule with no distinct media-query, state, inheritance, fallback, or browser-compatibility purpose;
   - an obsolete media-query branch or component rule;
   - an unused custom property, font-face, keyframe, or asset reference.
5. Do not remove a declaration merely because another rule appears later. Preserve declarations that act as fallbacks, differ by media query, state, selector specificity, `!important`, inheritance, browser support, or runtime class changes. Check shorthand and longhand interactions explicitly.
6. Cross-check candidates against all HTML pages and JavaScript before editing. Search case-insensitively where appropriate and account for hyphenated names, IDs, and selectors inside strings.
7. Make the smallest focused edit. Remove only proven dead or fully redundant code; avoid reformatting, renaming, selector consolidation, or unrelated cleanup in the same change.
8. Validate immediately:
   - Review the diff and confirm every deletion has a concrete reason.
   - Run available HTML/CSS/JS validation or project checks.
   - Load representative pages, including a responsive viewport and interactive states, and check layout, navigation, forms, images, and the browser console.
   - Repeat the search for removed selectors, variables, keyframes, and font families to ensure no live references remain.
9. Report removed items, the evidence for each category, validation performed, and any candidates left untouched because their usage or cascade behavior was uncertain.

## CSS Decision Rules

- A later declaration replaces an earlier one only when it wins for the same element, state, media condition, layer, importance, and property after specificity and source order are considered.
- A selector used only by a page-specific template is not unused if that page is part of the site.
- Keep responsive overrides, hover/focus/active states, accessibility styles, animation states, and progressive-enhancement fallbacks.
- Treat custom properties as live when referenced through `var()`, including references in imported or dynamically loaded stylesheets.
- Treat `@font-face`, `@keyframes`, and asset URLs as live when referenced indirectly by computed properties or JavaScript.
- Prefer removing a redundant declaration over changing selector structure when both produce the same cleanup.

## Completion Checklist

- [ ] All in-scope HTML, CSS, and JavaScript references were searched.
- [ ] Each removed rule or declaration was proven unreachable or redundant.
- [ ] CSS specificity, source order, media queries, states, fallbacks, and inheritance were checked.
- [ ] No unrelated working-tree changes were modified.
- [ ] A focused validation or browser smoke check passed.
- [ ] The final report names remaining uncertainty and any skipped candidates.
