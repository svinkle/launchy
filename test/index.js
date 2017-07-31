// TODO: get this working…

describe('Launchy', () => {

    beforeEach(() => {
        fixture.setBase('base/brochure');
        this.result = fixture.load('index.html');
    });

    afterEach(() => {
        fixture.cleanup();
    });

    describe('launcher element', () => {
        it('control to exist', (done) => {
            expect(document.querySelector('[data-launchy]')).toBeTruthy();
            done();
        });
    });
});
