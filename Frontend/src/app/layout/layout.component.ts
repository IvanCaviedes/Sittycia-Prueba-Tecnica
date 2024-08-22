import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { layout } from './layout.types';
import { EmptyComponent } from './layouts/empty/empty.component';
import { PrincipalComponent } from './layouts/principal/principal.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [EmptyComponent, PrincipalComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  layout: layout = 'empty';
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this._updateLayout();
  }

  private _updateLayout() {
    const layoutFromQueryParam = this.route.snapshot.queryParamMap.get(
      'layout'
    ) as layout;
    if (layoutFromQueryParam) {
      this.layout = layoutFromQueryParam;
    }

    const paths = this.route.pathFromRoot;
    paths.forEach((path) => {
      if (
        path.routeConfig &&
        path.routeConfig.data &&
        path.routeConfig.data['layout']
      ) {
        // Set the layout
        this.layout = path.routeConfig.data['layout'];
      }
    });

    console.log(this.layout);
  }
}
