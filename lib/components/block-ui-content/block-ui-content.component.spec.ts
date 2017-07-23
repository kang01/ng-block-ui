import { } from 'jasmine';
import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { NgModule, Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BlockUIModule } from '../../block-ui.module';
import { BlockUIContentComponent } from '../block-ui-content/block-ui-content.component';
import { BlockUI } from '../../decorators/block-ui.decorator';
import { BlockUIDefaultName } from '../../constants/block-ui-default-name.constant';

describe('block-ui-content component', () => {
  describe('block-ui-content component no template:', () => {
    @Component({
      selector: 'test-comp',
      template: `
        <block-ui-content
          [message]="defaultMessage"
          [delayStart]="delayStart"
          [delayStop]="delayStop"
        >
        </block-ui-content>
      `
    })
    class TestComp {
      @BlockUI() blockUI: any;
      defaultMessage: string;
      delayStart: number = 0;
      delayStop: number = 0;
    }

    let cf: ComponentFixture<any>;
    let testCmp: TestComp;
    let blkContComp: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BlockUIModule],
        declarations: [TestComp]
      })
        .compileComponents();

      cf = TestBed.createComponent(TestComp);
      cf.detectChanges();

      testCmp = cf.debugElement.componentInstance;
      blkContComp = cf.debugElement.query(By.directive(BlockUIContentComponent));
    });

    it('block-ui-wrapper is not active by default', () => {
      let blockWrapper = cf.debugElement.query(By.css('div.block-ui-wrapper'));
      expect(blockWrapper.classes.active).toBeFalsy();
    });

    it('block-ui-wrapper is active on blockUI.start()', () => {
      testCmp.blockUI.start();
      cf.detectChanges();

      let blockWrapper = cf.debugElement.query(By.css('div.block-ui-wrapper'));
      expect(blockWrapper.classes.active).toBeTruthy();
    });

    it('block-ui-wrapper is no longer active on blockUI.stop()', () => {
      testCmp.blockUI.start();
      cf.detectChanges();

      testCmp.blockUI.stop();
      cf.detectChanges();

      let blockWrapper = cf.debugElement.query(By.css('div.block-ui-wrapper'));
      expect(blockWrapper.classes.active).toBeFalsy();
    });

    it('block-ui-wrapper is no longer active on blockUI.reset()', () => {
      testCmp.blockUI.reset();
      cf.detectChanges();

      let blockWrapper = cf.debugElement.query(By.css('div.block-ui-wrapper'));
      expect(blockWrapper.classes.active).toBeFalsy();
    });

    it('displays messages passed to blockUI.start()', () => {
      let expectedMessage = 'Loading...';
      testCmp.blockUI.start(expectedMessage);
      cf.detectChanges();

      let { nativeElement } = cf.debugElement.query(By.css('div.message'));
      expect(nativeElement.innerText).toBe(expectedMessage);
    });

    it('displays default message if set and no message is passed', () => {
      let defaultMessage = 'Default';
      testCmp.defaultMessage = defaultMessage;
      cf.detectChanges();

      testCmp.blockUI.start();
      cf.detectChanges();

      let { nativeElement } = cf.debugElement.query(By.css('div.message'));
      expect(nativeElement.innerText).toBe(defaultMessage);
    });

    it('passed messages take priority over default', () => {
      let message = 'Loading...';

      testCmp.defaultMessage = 'Default';
      cf.detectChanges();

      testCmp.blockUI.start(message);
      cf.detectChanges();

      let { nativeElement } = cf.debugElement.query(By.css('div.message'));
      expect(nativeElement.innerText).toBe(message);
    });
  });

  describe('block-ui-content custom Component template', () => {

    @Component({
      selector: 'template-comp',
      template: `
        <div class="test-template">{{message}}</div>
      `
    })
    class TestTemplateComp {}

    @Component({
      selector: 'test-comp',
      template: `
        <block-ui-content [message]="defaultMessage" [template]="template"></block-ui-content>
      `
    })
    class TestComp {
      @BlockUI() blockUI: any;
      defaultMessage: string;
      template = TestTemplateComp;
    }

    @NgModule({
      imports: [ BlockUIModule ],
      declarations: [ TestTemplateComp, TestComp ],
      entryComponents: [ TestTemplateComp ]
    })
    class TestModule {}

    let cf: ComponentFixture<any>;
    let testCmp: TestComp;
    let blkContComp: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ BlockUIModule, TestModule ]
      })
        .compileComponents();

      cf = TestBed.createComponent(TestComp);
      cf.detectChanges();

      testCmp = cf.debugElement.componentInstance;
      blkContComp = cf.debugElement.query(By.directive(BlockUIContentComponent));
    });

    it('appends template to blockUIContent', () => {
      let template;

      template = cf.debugElement.query(By.css('.test-template'));
      expect(template).toBeDefined();
    });

    it('default spinner is hidden when template is passed', () => {
      testCmp.blockUI.start();
      cf.detectChanges();

      let spinner = cf.debugElement.query(By.css('.block-ui-spinner'));
      expect(spinner).toBe(null);
    });

    it('displays messages passed to blockUI.start()', () => {
      let expectedMessage = 'Loading...';
      testCmp.blockUI.start(expectedMessage);
      cf.detectChanges();

      let { nativeElement } = cf.debugElement.query(By.css('.test-template'));
      expect(nativeElement.innerText).toBe(expectedMessage);
    });

     it('displays default message if set and no message is passed', () => {
      let defaultMessage = 'Default';

      testCmp.defaultMessage = defaultMessage;
      cf.detectChanges();

      testCmp.blockUI.start();
      cf.detectChanges();

      let { nativeElement } = cf.debugElement.query(By.css('.test-template'));
      expect(nativeElement.innerText).toBe(defaultMessage);
    });
  });

  describe('block-ui-content custom TemplateRef template', () => {
    @Component({
      selector: 'test-comp',
      template: `
        <template class="ref-template" #templateTest>
          <div class="test-template">Test</div>
        </template>
        <block-ui-content [message]="defaultMessage" [template]="templateTest"></block-ui-content>
      `
    })
    class TestComp {
      @BlockUI() blockUI: any;
      defaultMessage: string;
      templateTest;
    }

    @NgModule({
      imports: [ BlockUIModule ],
      declarations: [ TestComp ]
    })
    class TestModule {}

    let cf: ComponentFixture<any>;
    let testCmp: TestComp;
    let blkContComp: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ BlockUIModule, TestModule ]
      })
        .compileComponents();

      cf = TestBed.createComponent(TestComp);
      cf.detectChanges();

      testCmp = cf.debugElement.componentInstance;
      blkContComp = cf.debugElement.query(By.directive(BlockUIContentComponent));
    });

    it('appends template to blockUIContent', () => {
      let template;

      template = cf.debugElement.query(By.css('.test-template'));
      expect(template).toBeDefined();
    });

    it('default spinner is hidden when template is passed', () => {
      testCmp.blockUI.start('Loading...');
      cf.detectChanges();

      let spinner = cf.debugElement.query(By.css('.block-ui-spinner'));
      expect(spinner).toBe(null);
    });
  });
});
