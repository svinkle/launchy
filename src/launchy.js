/**
 * Launchy! 🚀 — An Accessible Modal Window
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
 * Check out the GitHub repo for more information: https://github.com/svinkle/launchy
 *
 * @author Scott Vinkle <svinkle@gmail.com>
 * @version 0.9.2
 * @license MIT
 */

// https://github.com/WICG/inert
import 'wicg-inert';

// CSS classes
const classes = {
  modalLaunchLink: 'launchy__launch-link',
  modalCloseLink: 'launchy__close-link',
  modalWindow: 'launchy__window',
  modalContent: 'launchy__content',
  modalOverlay: 'launchy__overlay',
  modalTitle: 'launchy__title',
  modalWindowIsVisible: 'launchy__window--is-visible',
  modalOverlayIsVisible: 'launchy__overlay--is-visible'
};

// Data attributes
const data = {
  launchyText: 'data-launchy-text',
  launchyTitle: 'data-launchy-title',
  launchyButton: 'data-launchy-button',
  launchyCustom: {
    close: 'data-launchy-close',
    refocus: 'data-launchy-refocus'
  }
};

// Keys
const keysCodes = {
  Escape: 27
};

// Selectors
const selectors = {
  launchyElements: '[data-launchy]',
  launchyControl: 'launchy-control-',
  launchyDialog: 'launchy-dialog-',
  launchyCloseControl: 'launchy-close-control-',
  modalOverlay: 'modal-overlay-',
  modalBumper: 'modal-bumper-',
  modalTitle: 'modal-title-'
};

// Strings
const strings = {
  modalClose: 'Close modal window!',
  modalCloseHTML: '<span aria-hidden="true">&times;</span>',
  modalError: 'Launchy container must have a `data-launchy-text` attribute!',
  modalErrorEmpty:
    'Launchy container `data-launchy-text` attribute cannot be empty!',
  modalWarning:
    'Launchy container should have a `data-launchy-title` attribute, or be sure to supply your own heading! (Prefereably an `<h2>`.)',
  refocusElemNotFound: 'Refocus element not found!'
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
    this.useButton = params.button ? true : false;
    this.modalIsVisible = false;
    this.activeElement = null;
    this.shiftKeyIsPressed = false;
    this.allFocusable = null;
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.domFocusable = null;

    // Setup all the things
    // this.prepareFocusable();
    this.createElements(params);
    this.insertElements(params);
    this.setupEventListeners();

    // Increment identifier
    launchyId++;
  }

  /**
   * Create all the required elements for Launchy to function.
   *
   * @param {Object} params Instance parameters
   * @return {null}
   */
  createElements(params) {

    // Launch control
    this.launchControl = document.createElement(
      this.useButton ? 'button' : 'a'
    );
    this.launchControl.id = `${selectors.launchyControl}${this.launchyId}`;
    this.useButton
      ? this.launchControl.type = 'button'
      : this.launchControl.href = `#${selectors.launchyDialog}${
        this.launchyId
      }`;
    this.launchControl.classList.add(classes.modalLaunchLink);
    this.launchControl.setAttribute('aria-haspopup', 'dialog');
    this.launchControl.textContent = params.text;

    // Close control
    this.closeControl = document.createElement(this.useButton ? 'button' : 'a');
    this.closeControl.id = `${selectors.launchyCloseControl}${this.launchyId}`;
    this.useButton
      ? this.closeControl.type = 'button'
      : this.closeControl.href = `#${selectors.launchyControl}${
        this.launchyId
      }`;
    this.closeControl.classList.add(classes.modalCloseLink);
    this.closeControl.setAttribute('aria-label', strings.modalClose);
    this.closeControl.innerHTML = strings.modalCloseHTML;

    // Modal window
    this.modalWindow = document.createElement('div');
    this.modalWindow.id = `${selectors.launchyDialog}${this.launchyId}`;
    this.modalWindow.classList.add(classes.modalWindow);
    this.modalWindow.setAttribute('tabindex', -1);
    this.modalWindow.setAttribute('role', 'dialog');
    this.modalWindow.setAttribute('aria-modal', true);

    if (this.hasTitle) {
      this.modalWindow.setAttribute(
        'aria-labelledby',
        `${selectors.modalTitle}${this.launchyId}`
      );
    }

    // Modal overlay
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.id = `${selectors.modalOverlay}${this.launchyId}`;
    this.modalOverlay.classList.add(classes.modalOverlay);
    this.modalOverlay.setAttribute('tabindex', -1);

    // Modal bumper
    this.modalBumper = document.createElement('div');
    this.modalBumper.id = `${selectors.modalBumper}${this.launchyId}`;
    this.modalBumper.setAttribute('tabindex', -1);

    // Modal content
    this.modalContent = document.createElement('div');
    this.modalContent.classList.add(classes.modalContent);

    // Modal title
    if (this.hasTitle) {
      this.modalTitle = document.createElement('h2');
      this.modalTitle.id = `${selectors.modalTitle}${this.launchyId}`;
      this.modalTitle.classList.add(classes.modalTitle);
      this.modalTitle.textContent = params.title;
    }
  }

  /**
   * Insert Launchy elements into the DOM.
   *
   * @param {Object} params instance parameters
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

    // Bumper
    document.body.insertBefore(this.modalBumper, document.body.firstChild);
  }

  /**
   * Create event listeners for Launchy functionality.
   *
   * @return {null}
   */
  setupEventListeners() {

    // Gather any custom close or refocus controls
    const closeControls = this.modalContent.querySelectorAll(
      `[${data.launchyCustom.close}]`
    );
    const refocusControls = this.modalContent.querySelectorAll(
      `[${data.launchyCustom.refocus}]`
    );

    // Show the modal window on the launcher element `click` event
    this.launchControl.addEventListener(
      'click',
      this.showModal.bind(this),
      false
    );

    // Hide the modal window on close button or overlay `click` event
    this.closeControl.addEventListener(
      'click',
      this.hideModal.bind(this),
      false
    );
    this.modalOverlay.addEventListener(
      'click',
      this.hideModal.bind(this),
      false
    );

    // Trap the keyboard focus within modal window on the document
    // `focus` event. Notice the use of the `useCapture` flag set to `true`; this
    // indicates the event will be dispatched to the listener before any event
    // target in the DOM:
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    document.addEventListener('focus', this.trapFocus.bind(this), true);

    // Check for `esc` key press on the document `keydown` event
    document.addEventListener('keydown', this.checkEsc.bind(this), false);

    // Check for `shift` key press on the document `keydown` event
    document.addEventListener('keydown', this.checkShift.bind(this), false);

    // Add event listener for all custom close controls
    for (const closeControl of Array.from(closeControls)) {
      closeControl.addEventListener('click', this.hideModal.bind(this), false);
    }

    // Add event listener for all custom refocus controls
    for (const refocusControl of Array.from(refocusControls)) {
      refocusControl.addEventListener(
        'click',
        this.hideModalRefocus.bind(this),
        false
      );
    }
  }

  /**
   * Show the modal window.
   *
   * @param {Object} e The event object
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

    // Add the `active` classes
    this.modalWindow.classList.add(classes.modalWindowIsVisible);
    this.modalOverlay.classList.add(classes.modalOverlayIsVisible);

    // Set focusable elements as "inert"
    this.inertElements(true);

    // Set "bumpers" to be focusable
    this.modalOverlay.setAttribute('tabindex', 0);
    this.modalBumper.setAttribute('tabindex', 0);

    // Shift keyboard focus to the modal window container
    this.modalWindow.focus();
  }

  /**
   * Hide the modal window.
   *
   * @param {Object} e The event object
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

    // Remove the `active` classes
    this.modalWindow.classList.remove(classes.modalWindowIsVisible);
    this.modalOverlay.classList.remove(classes.modalOverlayIsVisible);

    // Remove "inert" state for focusable elements
    this.inertElements(false);

    // Set "bumpers" to be not focusable
    this.modalOverlay.setAttribute('tabindex', -1);
    this.modalBumper.setAttribute('tabindex', -1);

    // Set focus to the previous active element
    this.activeElement.focus();
  }

  /**
   * Trap keyboard focus within the modal window.
   *
   * @param {Object} e The event object
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
      this.shiftKeyIsPressed
        ? this.lastFocusable.focus()
        : this.firstFocusable.focus();
    }
  }

  /**
   * Check if the `esc` key has been pressed.
   *
   * @param {Object} e The event object
   * @return {null}
   */
  checkEsc(e) {
    if (this.modalIsVisible) {

      // Hide the modal window on `esc` key press
      if (e.keyCode === keysCodes.Escape) {
        this.hideModal(e);
      }
    }
  }

  /**
   * Check if the `shift` key is being being pressed.
   *
   * @param {Object} e The event object
   * @return {null}
   */
  checkShift(e) {
    if (this.modalIsVisible) {

      // Cache the `shift` key state
      this.shiftKeyIsPressed = e.shiftKey;
    }
  }

  /**
   * Send focus to the specified element `id` on custom refocus element click
   *
   * @param {Object} e The event object
   * @return {null}
   */
  hideModalRefocus(e) {
    const refocusId = e.target.getAttribute(data.launchyCustom.refocus);
    const refocusElem = document.querySelector(`#${refocusId}`);

    // Throw an error if the refocus element is not found
    if (refocusElem == null) {
      throw Error(`${strings.refocusElemNotFound}: #${refocusId}`);
      return;
    }

    // Hide the modal
    this.hideModal(e);

    // Send focus to the specified element
    refocusElem.focus();
  }

  /**
   * Set all existing focusable elements as "inert" -- hide from screen
   * readers in order to keep focus trapped within modal when using other
   * forms of keyboard navigation (other than tab).
   *
   * @param {Boolean} isInert Flag to set elements "inert" state
   * @return {null}
   */
  inertElements(isInert) {

    // Select all focusable elements
    const focusable = document.querySelectorAll(this.focusable);

    for (const elem of Array.from(focusable)) {

      // Do not apply `inert` to the overlay, bumper, or any elements
      // within the modal itself
      if (
        this.modalOverlay !== elem &&
        this.modalBumper !== elem &&
        !this.modalWindow.contains(elem)
      ) {
        elem.inert = isInert;
      }
    }
  }
}

const init = () => {

  // Create instances per `data-launchy` elements found in the DOM
  const launchyElements = document.querySelectorAll(selectors.launchyElements);

  let launchyText = null,
    launchyTitle = null,
    launchyButton = null;

  for (const launchyElement of Array.from(launchyElements)) {
    launchyText = launchyElement.getAttribute(data.launchyText),
    launchyTitle = launchyElement.getAttribute(data.launchyTitle),
    launchyButton = launchyElement.hasAttribute(data.launchyButton);

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
      title: launchyTitle,
      button: launchyButton
    };

    // Create a new instance for each found in the DOM
    new Launchy(params);
  }
};

document.addEventListener('DOMContentLoaded', init, false);

export {Launchy};
