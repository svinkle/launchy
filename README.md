[![Build Status](https://travis-ci.org/svinkle/launchy.svg?branch=master)](https://travis-ci.org/svinkle/launchy)

# Launchy 🚀

> An accessible modal window!

## Features include:
- Easy to use and implement!
- On launch, keyboard focus shifts to the modal window container
- The modal window is described via _optional_ modal heading
- Traps the keyboard focus within the modal when active/visible
- Closes the window on `esc` key press
- Closes the window on overlay mouse `click`
- Sets keyboard focus back to the launcher element on window close
- Transparent border for Windows High Contrast themes

For more details on the accessibility of modal windows:
- WCAG 2.4.3: https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-order.html#navigation-mechanisms-focus-order-examples-head
- WAI-ARIA Authoring Practices 1.1: https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal

## Demo

- Check out the [demo](https://svinkle.github.io/launchy/)! 👈
- Try your own HTML with the [CodePen](https://codepen.io/svinkle/pen/pjVepz/) demo!

## Usage

_Launchy_ is very easy to install and use:

### HTML
Wherever you want to have a _Launchy_ control + window appear in your HTML content, simply **wrap** your content with a `<div>` and add the `data-launchy` attribute.

Example:

```html
<div data-launchy data-launchy-text="Launch window!" data-launchy-title="My modal window">
    <p>This content will appear in the modal window.</p>
</div>
```

- **Required**: `data-launchy` -- Attribute is required but the value can be anything
- **Required**: `data-launchy-text` -- This is the text that will be output to the launcher control
- Optional: `data-launchy-title` -- The text which appears in the heading of the modal window, recommended for greater a11y context 👍

### CSS

_Launchy_ has many CSS classes available on its generated elements for custom styles. Check out the [style.scss](https://github.com/svinkle/launchy/blob/9ddef002dcbd557e94309bf1cc99abe01432b8bc/brochure/css/sass/styles.scss) file for class names and an example on how you might want to style your modal windows!

### JavaScript
For any site, grab the `/dist/launchy.js` file and include it at the bottom of your HTML page/template:

```html
<script src="js/launchy.js"></script>
```

_Launchy_ will run automatically and generate all the modal windows for you!

### `npm` Package
_Launchy_ is also available as an npm package!

#### Install
```sh
npm i launchy-modal-window
```

#### Usage
Include the `launchy.js` directly in your app or site template.

```html
<script src="node_modules/launchy-modal-window/launchy.js"></script>
```

## Contributions
See the [CONTRIBUTING](https://github.com/svinkle/launchy/blob/9ddef002dcbd557e94309bf1cc99abe01432b8bc/CONTRIBUTING.md) file.

## License
See the [LICENSE](https://github.com/svinkle/launchy/blob/9ddef002dcbd557e94309bf1cc99abe01432b8bc/LICENSE.md) file.
