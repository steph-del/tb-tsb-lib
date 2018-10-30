import { AppPage } from './app.po';
import { ElementFinder } from 'protractor';
import { ElementRef } from '@angular/core';

describe('workspace-project App', () => {
  let page: AppPage;
  let tsbComponent: ElementFinder;
  let taxoInput: ElementFinder;
  let repoInput: ElementFinder;

  beforeEach(() => {
    page = new AppPage();
    tsbComponent = page.getComponent();
    taxoInput = page.getTaxoInput();
    repoInput = page.getRepositoryInput();
  });

  it('should display welcome message', () => {
    page.navigateTo();

    // repoInput.sendKeys('baseflor');

    expect(repoInput.getText()).toBe('bdtfx');

  });
});
