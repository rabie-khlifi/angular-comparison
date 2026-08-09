import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentScopePanel } from '../component-scope-panel/component-scope-panel';
import { RootScopePanel } from '../root-scope-panel/root-scope-panel';

@Component({
  selector: 'app-provider-scopes-page',
  imports: [RootScopePanel, ComponentScopePanel],
  templateUrl: './provider-scopes-page.html',
  styleUrl: './provider-scopes-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderScopesPage {}
