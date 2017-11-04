const expect = chai.expect;

// https://gist.github.com/callmephilip/3519403
const fireKey = (el, key) => {
    let eventObj = null;

    if (document.createEventObject) {
        eventObj = document.createEventObject();
        eventObj.keyCode = key;
        el.fireEvent('onkeydown', eventObj);
        eventObj.keyCode = key;
    } else if (document.createEvent) {
        eventObj = document.createEvent('Events');
        eventObj.initEvent('keydown', true, true);
        eventObj.which = key;
        eventObj.keyCode = key;
        el.dispatchEvent(eventObj);
    }
};

describe('Launchy', () => {

    describe('Elements…', () => {

        describe('Static:', () => {
            it('[data-launchy] element to exist', () => {
                expect(document.querySelector('[data-launchy]')).to.be.truthy();
            });

            it('[data-launchy-text] to exist', () => {
                expect(document.querySelector('[data-launchy-text]')).to.be.truthy();
            });

            it('[data-launchy-title] to exist', () => {
                expect(document.querySelector('[data-launchy-title]')).to.be.truthy();
            });

            it('[data-launchy-close] to exist', () => {
                expect(document.querySelector('[data-launchy-close]')).to.be.truthy();
            });
        });

        describe('Dynamic:', () => {
            it('launcher control to exist', () => {
                expect(document.querySelector('#launchy-control-0')).to.be.truthy();
            });

            it('launchy dialog to exist', () => {
                expect(document.querySelector('#launchy-dialog-0')).to.be.truthy();
            });

            it('launchy close control to exist', () => {
                expect(document.querySelector('#launchy-close-control-0')).to.be.truthy();
            });

            it('launchy overlay to exist', () => {
                expect(document.querySelector('#modal-overlay-0')).to.be.truthy();
            });

            it('launchy bumper to exist', () => {
                expect(document.querySelector('#modal-bumper-0')).to.be.truthy();
            });
        });
    });

    describe('Properties…', () => {

        it('modal window to have `aria-modal` attribute', () => {
            expect(document.querySelector('#launchy-dialog-0').getAttribute('aria-modal')).to.be.truthy();
        });

        it('modal window `aria-modal` value to be true', () => {
            expect(document.querySelector('#launchy-dialog-0').getAttribute('aria-modal')).to.equal('true');
        });
    });

    describe('Show modal…', () => {

        beforeEach(() => {
            document.querySelector('#launchy-control-0').focus();
            document.querySelector('#launchy-control-0').click();
        });

        afterEach(() => {
            document.querySelector('#launchy-close-control-0').focus();
            document.querySelector('#launchy-close-control-0').click();
        });

        it('modal window to be shown', () => {
            expect(document.querySelector('#launchy-dialog-0').classList.contains('launchy__window--is-visible')).to.equal(true);
        });

        it('modal window to have focus', () => {
            expect(document.querySelector('#launchy-dialog-0')).to.equal(document.activeElement);
        });

        it('modal launcher to be inert', () => {
            expect(document.querySelector('#launchy-control-0').getAttribute('inert')).to.equal('');
            expect(document.querySelector('#launchy-control-0').getAttribute('tabindex')).to.equal('-1');
            expect(document.querySelector('#launchy-control-0').getAttribute('aria-hidden')).to.equal('true');
        });

        it('modal controls to _not_ be inert', () => {
            const modal = document.querySelector('#launchy-dialog-0');
            const controls = modal.querySelectorAll('a[href]');

            for (const control of Array.from(controls)) {
                expect(control.getAttribute('inert')).to.be.falsy();
                expect(control.getAttribute('tabindex')).to.be.falsy();
                expect(control.getAttribute('aria-hidden')).to.be.falsy();
            }
        });
    });

    describe('Hide modal…', () => {

        beforeEach(() => {
            document.querySelector('#launchy-control-0').focus();
            document.querySelector('#launchy-control-0').click();
            document.querySelector('#launchy-close-control-0').focus();
            document.querySelector('#launchy-close-control-0').click();
        });

        it('modal window to be hidden', () => {
            expect(document.querySelector('#launchy-dialog-0').classList.contains('launchy__window--is-visible')).to.equal(false);
        });

        it('launcher element to have focus', () => {
            expect(document.querySelector('#launchy-control-0')).to.equal(document.activeElement);
        });

        it('modal launcher to _not_ be inert', () => {
            expect(document.querySelector('#launchy-control-0').getAttribute('inert')).to.be.falsy();
            expect(document.querySelector('#launchy-control-0').getAttribute('tabindex')).to.be.falsy();
            expect(document.querySelector('#launchy-control-0').getAttribute('aria-hidden')).to.be.falsy();
        });
    });

    // Todo:
    // check firstFocusable
    // check lastFocusable
    // use fireKey() to test `Tab` key press
});
