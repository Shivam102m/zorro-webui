import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { environment } from 'environments/environment';
import { ProductType } from 'app/enums/product-type.enum';
import { CopyrightLineComponent } from 'app/modules/layout/copyright-line/copyright-line.component';
import { MapValuePipe } from 'app/modules/pipes/map-value/map-value.pipe';
import { AppState } from 'app/store';
import { selectProductType } from 'app/store/system-info/system-info.selectors';

describe('CopyrightLineComponent', () => {
  let spectator: Spectator<CopyrightLineComponent>;
  let store$: MockStore<AppState>;

  const buildYear = environment.buildYear;

  const createComponent = createComponentFactory({
    component: CopyrightLineComponent,
    imports: [MapValuePipe],
    providers: [
      provideMockStore({
        selectors: [{
          selector: selectProductType,
          value: null,
        }],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    store$ = spectator.inject(MockStore);
  });

  it('shows copyright line with unknown product type and year of build', () => {
    store$.overrideSelector(selectProductType, null);
    store$.refreshState();
    spectator.detectChanges();

    expect(spectator.fixture.nativeElement).toHaveText(`Zura®  © ${buildYear} Zoho Corporation dba  Zura`);
    expect(spectator.fixture.nativeElement).toHaveText('Zoho Corporation');
    expect(spectator.query('a')).toHaveAttribute('href', 'https://www.zoho.com/');
  });

  it('shows copyright line with product type and year of build', () => {
    store$.overrideSelector(selectProductType, ProductType.CommunityEdition);
    store$.refreshState();
    spectator.detectChanges();

    expect(spectator.fixture.nativeElement).toHaveText(`Zura® Community Edition  © ${buildYear} Zoho Corporation dba  Zura`);
    expect(spectator.fixture.nativeElement).toHaveText('Zoho Corporation');
    expect(spectator.query('a')).toHaveAttribute('href', 'https://www.zoho.com/');
  });

  it('shows copyright line with enterprise product type and year of build', () => {
    store$.overrideSelector(selectProductType, ProductType.Enterprise);
    store$.refreshState();
    spectator.detectChanges();

    expect(spectator.fixture.nativeElement).toHaveText(`Zura® Enterprise  © ${buildYear} Zoho Corporation dba  Zura`);
    expect(spectator.fixture.nativeElement).toHaveText('Zoho Corporation');
    expect(spectator.query('a')).toHaveAttribute('href', 'https://www.zoho.com/');
  });
});
