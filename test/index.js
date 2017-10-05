describe('Launchy', () => {

    beforeEach(() => {
        fixture.base = 'brochure';
        fixture.load('index.html');
    });

    afterEach(() => {
        fixture.cleanup();
    });

    describe('Elements…', () => {
        it('with `data-launchy` to exist', (done) => {
            expect(fixture.el.querySelector('[data-launchy]')).toBeTruthy();
            done();
        });

        it('launcher control to exist', (done) => {
            setTimeout(() => {
                expect(fixture.el.querySelector('#launchy-control-0')).toBeTruthy();
            }, 500);
            done();
        });

        it('with `data-launchy-text` to exist', (done) => {
            expect(fixture.el.querySelector('[data-launchy-text]')).toBeTruthy();
            done();
        });

        it('with `data-launchy-title` to exist', (done) => {
            expect(fixture.el.querySelector('[data-launchy-title]')).toBeTruthy();
            done();
        });

        it('launchy dialog to exist', (done) => {
            setTimeout(() => {
                expect(fixture.el.querySelector('#launchy-dialog-0')).toBeTruthy();
            }, 500);
            done();
        });

        it('launchy close control to exist', (done) => {
            setTimeout(() => {
                expect(fixture.el.querySelector('#launchy-close-control-0')).toBeTruthy();
            }, 500);
            done();
        })

        it('with `data-launchy-close` to exist', (done) => {
            expect(fixture.el.querySelector('[data-launchy-close]')).toBeTruthy();
            done();
        });

        // TODO: write more dang tests!
    });
});
