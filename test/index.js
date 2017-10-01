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

        // TODO: write more dang tests!
    });
});
