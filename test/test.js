const expect = chai.expect;

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

        it('modal window `aria-modal` value to be "true"', () => {
            expect(document.querySelector('#launchy-dialog-0').getAttribute('aria-modal')).to.equal('true');
        });
    });

    describe('Open modal…', () => {

        beforeEach(() => {
            document.querySelector('#launchy-control-0').focus();
            document.querySelector('#launchy-control-0').click();
        });

        it('modal window to be shown', () => {
            expect(document.querySelector('#launchy-dialog-0').classList.contains('launchy__window--is-visible')).to.equal(true);
        });

        it('modal window to have focus', () => {
            expect(document.querySelector('#launchy-dialog-0')).to.equal(document.activeElement);
        });

    });

    describe('Closed modal…', () => {

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
    });

    // Todo: check for inert state on things…
});
