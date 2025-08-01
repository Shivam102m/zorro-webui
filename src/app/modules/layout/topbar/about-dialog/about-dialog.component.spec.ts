import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { createComponentFactory, Spectator, mockProvider } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { helptextAbout } from 'app/helptext/about';
import { IxIconComponent } from 'app/modules/ix-icon/ix-icon.component';
import { AboutDialogComponent } from 'app/modules/layout/topbar/about-dialog/about-dialog.component';
import { TruenasLogoComponent } from 'app/modules/layout/topbar/truenas-logo/truenas-logo.component';
import { ApiService } from 'app/modules/websocket/api.service';
import { SystemInfoState } from 'app/store/system-info/system-info.reducer';
import { selectSystemInfoState } from 'app/store/system-info/system-info.selectors';

describe('AboutDialogComponent', () => {
  let spectator: Spectator<AboutDialogComponent>;
  let loader: HarnessLoader;

  const createComponent = createComponentFactory({
    component: AboutDialogComponent,
    imports: [],
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: selectSystemInfoState,
            value: {
              systemInfo: {
                version: 'SCALE-24.04',
                system_product: 'M40',
              },
              isIxHardware: true,
            } as SystemInfoState,
          },
        ],
      }),
      mockProvider(ApiService),
      mockProvider(MatDialogRef),
    ],
    declarations: [
      MockComponent(IxIconComponent),
      MockComponent(TruenasLogoComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    loader = TestbedHarnessEnvironment.loader(spectator.fixture);
  });

  it('should display help text correctly', () => {
    const helpTextElement = spectator.query('h1.help');
    expect(helpTextElement).toHaveText(helptextAbout.help);
  });

  it('should close the dialog when the close button is clicked', async () => {
    const closeButton = await loader.getHarness(MatButtonHarness.with({ text: 'Close' }));
    await closeButton.click();
    expect(spectator.inject(MatDialogRef).close).toHaveBeenCalled();
  });

  it('should display translated "docs" help text', () => {
    const docsElement = spectator.query('.line-item:nth-of-type(1) .medium-font');
    expect(docsElement).toHaveText('The Zura Documentation Site is a collaborative website with helpful guides and information about your new storage system');
  });

  it('should display translated "forums" help text', () => {
    const forumsElement = spectator.query('.line-item:nth-of-type(2) .medium-font');
    expect(forumsElement).toHaveText('The Zura Community Forums are the best place to ask questions and interact with fellow Zura users.');
  });

  it('should display system version correctly', () => {
    const systemVersionElement = spectator.query('#system-version');
    expect(systemVersionElement).toHaveText('System Version: SCALE-24.04');
  });

  it('should display product-specific open source text', () => {
    const openSourceElement = spectator.query('#open-source');
    expect(openSourceElement).toHaveText('Zura is Free and Open Source software, which is provided as-is with no warranty.');
  });
});
