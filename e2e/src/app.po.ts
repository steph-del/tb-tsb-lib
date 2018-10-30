import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/testApp');
  }

  getContainer() {
    return element(by.className('tsb-container')).getWebElement();
  }

  getComponent() {
    return element(by.tagName('tb-tsb-search-box'));
  }

  getRepositoryInput() {
    return element(by.id('repositoryInput'));
  }

  getTaxoInput() {
    return element(by.id('taxoInput'));
  }
}
