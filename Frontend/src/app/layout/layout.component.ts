import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { layout } from './layout.types';
import { ActivatedRoute } from '@angular/router';
import { EmptyComponent } from './layouts/empty/empty.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [EmptyComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit, OnDestroy {
  layout: layout = 'empty';
  private route = inject(ActivatedRoute);

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
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
      // Check if there is a 'layout' data
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
