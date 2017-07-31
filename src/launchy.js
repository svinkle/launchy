/**
 * Launchy: An Accessible Modal Window
 *
 * Features include:
 * - On launch, shift focus to the modal window container
 * - The modal window is described by the modal heading
 * - Trap keyboard focus within the modal when active/visible
 * - Close the window on `esc` key press
 * - Close the window on overlay `click`
 * - Set keyboard focus back to the launcher element on window close
 * - Transparent border for Windows High Contrast themes
 *
 * For more details:
 * - WCAG 2.4.3: https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-order.html#navigation-mechanisms-focus-order-examples-head
 * - WAI-ARIA Authoring Practices 1.1: https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
 *
 * @author Scott Vinkle <svinkle@gmail.com>
 * @version 0.6.5
 * @license MIT
 */

// HTML elements
const htmlElements = {
    launchModal: 'a',
    closeModal: 'a',
    modalWindow: 'div',
    modalContent: 'div',
    modalOverlay: 'div',
    modalTitle: 'h2'
};

// CSS classes
const classes = {
    modalLaunchLink: 'modal__launch-link',
    modalCloseLink: 'modal__close-link',
    modalWindow: 'modal__window',
    modalContent: 'modal__content',
    modalOverlay: 'modal__overlay',
    modalTitle: 'modal__title',
    modalWindowIsVisible: 'modal__window--is-visible',
    modalOverlayIsVisible: 'modal__overlay--is-visible'
};

// Data attributes
const data = {
    launchyText: 'data-launchy-text',
    launchyTitle: 'data-launchy-title'
};

// Keys
const keysCodes = {
    'Escape': 27
};

// Selectors
const selectors = {
    launchyElements: '[data-launchy]',
    launchyControl: 'launchy-control-',
    launchyDialog: 'launchy-dialog-',
    launchyCloseControl: 'launchy-close-control-',
    modalOverlay: 'modal-overlay-',
    modalTitle: 'modal-title-'
};

// Strings
const strings = {
    modalClose: 'Close modal window!',
    modalError: 'Launchy container must have a `data-launchy-text` attribute!',
    modalErrorEmpty: 'Launchy container `data-launchy-text` attribute cannot be empty!',
    modalWarning: 'Launchy container should have a `data-launchy-title` attribute, or be sure to supply your own heading! (Prefereably an `<h2>`.)'
};

// Unique identifier
let launchyId = 0;

class Launchy {
    constructor(params) {

        // https://www.npmjs.com/package/focusable
        this.focusable = require('focusable');

        // Unique identifier for each instance
        this.launchyId = launchyId;

        // Flags and other objects to be used later
        this.hasTitle = params.title ? true : false;
        this.modalIsVisible = false;
        this.activeElement = null;
        this.shiftKeyIsPressed = false;
        this.allFocusable = null;
        this.firstFocusable = null;
        this.lastFocusable = null;

        // Setup all the things
        this.createElements(params);
        this.insertElements(params);
        this.setupEventListeners();

        // Increment identifier
        launchyId++;
    }

    /**
     * Create all the required elements for Launchy to function.
     *
     * @function createElements
     * @param params {Object} instance parameters.
     * @return {null}
     */
    createElements(params) {

        // Launch control
        this.launchControl = document.createElement(htmlElements.launchModal);
        this.launchControl.id = `${selectors.launchyControl}${this.launchyId}`;
        this.launchControl.href = `#${selectors.launchyDialog}${this.launchyId}`;
        this.launchControl.classList.add(classes.modalLaunchLink);
        this.launchControl.textContent = params.text;

        // Close control
        this.closeControl = document.createElement(htmlElements.closeModal);
        this.closeControl.id = `${selectors.launchyCloseControl}${this.launchyId}`;
        this.closeControl.href = `#${selectors.launchyControl}${this.launchyId}`;
        this.closeControl.classList.add(classes.modalCloseLink);
        this.closeControl.setAttribute('aria-label', strings.modalClose);
        this.closeControl.innerHTML = '<span aria-hidden="true">&times;</span>';

        // Modal window
        this.modalWindow = document.createElement(htmlElements.modalWindow);
        this.modalWindow.id = `${selectors.launchyDialog}${this.launchyId}`;
        this.modalWindow.classList.add(classes.modalWindow);
        this.modalWindow.setAttribute('tabindex', -1);
        this.modalWindow.setAttribute('role', 'dialog');
        this.modalWindow.setAttribute('aria-hidden', true);

        if (this.hasTitle) {
            this.modalWindow.setAttribute('aria-labelledby', `${selectors.modalTitle}${this.launchyId}`);
        }

        // Modal overlay
        this.modalOverlay = document.createElement(htmlElements.modalOverlay);
        this.modalOverlay.id = `${selectors.modalOverlay}${this.launchyId}`;
        this.modalOverlay.classList.add(classes.modalOverlay);
        this.modalOverlay.setAttribute('tabindex', 0);

        // Modal content
        this.modalContent = document.createElement(htmlElements.modalContent);
        this.modalContent.classList.add(classes.modalContent);

        // Modal title
        if (this.hasTitle) {
            this.modalTitle = document.createElement(htmlElements.modalTitle);
            this.modalTitle.id = `${selectors.modalTitle}${this.launchyId}`;
            this.modalTitle.classList.add(classes.modalTitle);
            this.modalTitle.textContent = params.title;
        }
    }

    /**
     * Insert Launchy elements into the DOM.
     *
     * @function insertElements
     * @param params {Object} instance parameters.
     * @return {null}
     */
    insertElements(params) {

        // Launch control
        params.target.parentNode.insertBefore(this.launchControl, params.target);

        // Modal window
        params.target.parentNode.insertBefore(this.modalWindow, params.target);

        // Modal content container
        this.modalWindow.appendChild(this.modalContent);

        // Close control
        this.modalContent.appendChild(this.closeControl);

        // Modal title
        if (this.hasTitle) {
            this.modalContent.appendChild(this.modalTitle);
        }

        // Move the content within the modal container
        this.modalContent.appendChild(params.target);

        // Overlay
        document.body.appendChild(this.modalOverlay);
    }

    /**
     * Create event listeners for Launchy functionality.
     *
     * @function setupEventListeners
     * @return {null}
     */
    setupEventListeners() {

        // Show the modal window on the launcher element `click` event
        this.launchControl.addEventListener('click', this.showModal.bind(this), false);

        // Hide the modal window on close button or overlay `click` event
        this.closeControl.addEventListener('click', this.hideModal.bind(this), false);
        this.modalOverlay.addEventListener('click', this.hideModal.bind(this), false);

        // Trap the keyboard focus within modal window on the document
        // `focus` event. Notice the use of the `useCapture` flag set to `true`; this
        // indicates the event will be dispatched to the listener before any event
        // target in the DOM:
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        document.addEventListener('focus', this.trapFocus.bind(this), true);

        // Check for `esc` key press on the document `keydown` event
        document.addEventListener('keydown', this.checkEsc.bind(this), false);
    }

    /**
     * Show the modal window.
     *
     * @function showModal
     * @param e {Object} The event object.
     * @return {null}
     */
    showModal(e) {
        e.preventDefault();

        // Cache the last active element
        this.activeElement = document.activeElement;

        // Set visible flag as `true`
        this.modalIsVisible = true;

        // Set the focusable objects, first and last, within the modal window
        this.allFocusable = this.modalWindow.querySelectorAll(this.focusable);
        this.firstFocusable = this.allFocusable[0];
        this.lastFocusable = this.allFocusable[this.allFocusable.length - 1];

        // Add the `active` classes and set `aria-hidden` to `false`
        this.modalWindow.classList.add(classes.modalWindowIsVisible);
        this.modalOverlay.classList.add(classes.modalOverlayIsVisible);
        this.modalWindow.setAttribute('aria-hidden', false);

        // Shift keyboard focus to the modal window container
        this.modalWindow.focus();
    };

    /**
     * Hide the modal window.
     *
     * @function hideModal
     * @param e {Object} The event object.
     * @return {null}
     */
    hideModal(e) {
        e.preventDefault();

        // Set visible flag to `false`
        this.modalIsVisible = false;

        // Reset the focusable objects
        this.allFocusable = null;
        this.firstFocusable = null;
        this.lastFocusable = null;

        // Remove the `active` classes and set `aria-hidden` to `true`
        this.modalWindow.classList.remove(classes.modalWindowIsVisible);
        this.modalOverlay.classList.remove(classes.modalOverlayIsVisible);
        this.modalWindow.setAttribute('aria-hidden', true);

        // Set focus to the previous active element
        this.activeElement.focus();
    };

    /**
     * Trap keyboard focus within the modal window.
     *
     * @function trapFocus
     * @param e {Object} The event object.
     * @return {null}
     */
    trapFocus(e) {

        // If the modal is currently visible _and_ the currently focused element
        // is _not_ within the modal window…
        if (this.modalIsVisible && !this.modalWindow.contains(e.target)) {

            // Stop the event from bubbling any further up into the DOM:
            // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
            e.stopPropagation();

            // If the user is moving forward, focus on the first element,
            // otherwise, the `shift` key is pressed; focus on the last element
            this.shiftKeyIsPressed ? this.lastFocusable.focus() : this.firstFocusable.focus();
        }
    };

    /**
     * Check if the `esc` key has been pressed.
     *
     * @function checkEsc
     * @param e {Object} The event object.
     * @return {null}
     */
    checkEsc(e) {
        if (this.modalIsVisible) {

            // Cache the `shift` key state
            this.shiftKeyIsPressed = e.shiftKey;

            // Hide the modal window on `esc` key press
            if (e.keyCode === keysCodes.Escape) {
                this.hideModal(e);
            }
        }
    };
}

const init = () => {

    // Create instances per `data-launchy` elements found in the DOM
    const launchyElements = document.querySelectorAll(selectors.launchyElements);

    let launchyText = null,
        launchyTitle = null;

    for (const launchyElement of Array.from(launchyElements)) {
        launchyText = launchyElement.getAttribute(data.launchyText),
        launchyTitle = launchyElement.getAttribute(data.launchyTitle);

        // Throw an error if there's no launcher control text attribute
        if (!launchyText) {
            throw Error(strings.modalError);
            break;
        }

        // Throw an error if the launcher control text is empty
        if (launchyText.trim() === '') {
            throw Error(strings.modalErrorEmpty);
            break;
        }

        // Throw a warning if there's no heading title text
        if (!launchyTitle) {
            console.warn(strings.modalWarning);
        }

        // Params object to send to Launchy constructor
        const params = {
            target: launchyElement,
            text: launchyText,
            title: launchyTitle
        };

        // Create a new instance for each found in the DOM
        new Launchy(params);
    }
};

document.addEventListener('DOMContentLoaded', init, false);

export {Launchy};
