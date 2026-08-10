# Lesson 15: Emulated vs None vs Shadow DOM view encapsulation

Open [`/view-encapsulation`](https://angular-comparison.netlify.app/view-encapsulation). Three
components demonstrate how Angular handles their CSS. The page includes a
global rule that enters the Emulated component and a rule from the None
component that deliberately leaks back into the page.

`ViewEncapsulation.Emulated` is the default. Angular adds generated attributes
to component elements and rewrites component CSS selectors to include those
attributes. Component rules normally stay inside, but global document rules can
still style matching elements inside an Emulated component. It resembles style
isolation without creating a browser shadow root.

`ViewEncapsulation.None` performs no selector rewriting. Component styles
become global document CSS and remain capable of affecting unrelated elements,
even after navigating away once that stylesheet has been loaded. Use it only
for intentionally global styling and prefix selectors to avoid collisions. The
lesson leaves one selector unprefixed specifically to make this leakage visible.

`ViewEncapsulation.ShadowDom` creates a real browser shadow root. Component CSS
stays within that root and ordinary document selectors cannot enter it. Native
encapsulation is stronger, but affects theming, content projection, querying,
testing, and integration with libraries expecting light-DOM elements. Inherited
CSS properties and custom properties can still cross the host boundary.

| Concern                 | Emulated                | None                | ShadowDom                  |
| ----------------------- | ----------------------- | ------------------- | -------------------------- |
| Component styles escape | Normally no             | Yes                 | No                         |
| Global selectors enter  | Yes                     | Yes                 | Normally no                |
| Scoping mechanism       | Angular-generated attrs | No scoping          | Native browser shadow root |
| Typical choice          | Normal application UI   | Intentional globals | Strongly isolated elements |

`:host` targets the component's host element. `:host-context()` can style based
on an ancestor context but is discouraged for new design-system architecture.
Avoid `::ng-deep`: it deliberately pierces encapsulation and is retained only
for backwards compatibility.

There is no separate pre-signals implementation because signals never changed
this feature. Classic NgModule-declared components and modern standalone
components use the same `ViewEncapsulation` modes. Signals govern reactive
state notification; view encapsulation governs CSS selector boundaries.

