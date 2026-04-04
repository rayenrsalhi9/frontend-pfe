import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { Directionality } from "@angular/cdk/bidi";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { NavMenu } from "@app/shared/types/nav-menu.interface";
import { navConfiguration } from "@app/configs/nav.config";
import { SecurityService } from "@app/core/security/security.service";

@Component({
  selector: "vertical-menu-content",
  templateUrl: "vertical-menu-content.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalMenuContentComponent implements OnInit, OnDestroy {
  menu: NavMenu[] = [];
  @Output() onNavLinkClick = new EventEmitter<string>();
  isRtl = false;

  private manualExpandedKeys = new Set<string>();
  private autoExpandedKeys = new Set<string>();
  private routerSubscription?: Subscription;
  private langSubscription?: Subscription;

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private cdr: ChangeDetectorRef,
    private directionality: Directionality,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.isRtl = this.directionality.value === "rtl";
    this.menu = this.filterVisibleMenu(navConfiguration);
    this.syncExpandedState();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncExpandedState();
        this.cdr.markForCheck();
      });

    this.langSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.isRtl = this.directionality.value === "rtl";
        this.cdr.markForCheck();
      },
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.langSubscription?.unsubscribe();
  }

  trackByKey(_: number, item: NavMenu): string {
    return item?.key || item?.path || item?.title || `${_}`;
  }

  onLinkClick(path: string): void {
    this.onNavLinkClick.emit(path);
  }

  isVisible(item: NavMenu): boolean {
    if (!item) {
      return false;
    }

    if (!item.claims || item.claims.length === 0) {
      return true;
    }

    return this.securityService.hasClaim(item.claims);
  }

  isSection(item: NavMenu): boolean {
    return item?.type === "title" && this.hasChildren(item);
  }

  hasChildren(item: NavMenu): boolean {
    return !!item?.submenu && item.submenu.length > 0;
  }

  getVisibleChildren(item: NavMenu): NavMenu[] {
    return (item?.submenu || []).filter((child) => this.isVisible(child));
  }

  toggleSubmenu(item: NavMenu): void {
    if (!item?.key) {
      return;
    }

    if (this.manualExpandedKeys.has(item.key)) {
      this.manualExpandedKeys.delete(item.key);
    } else {
      this.manualExpandedKeys.add(item.key);
    }
  }

  isExpanded(item: NavMenu): boolean {
    if (!item?.key) {
      return false;
    }
    return (
      this.manualExpandedKeys.has(item.key) ||
      this.autoExpandedKeys.has(item.key)
    );
  }

  isExactRouteActive(path: string): boolean {
    return (
      !!path &&
      this.router.isActive(path, {
        paths: "exact",
        queryParams: "ignored",
        fragment: "ignored",
        matrixParams: "ignored",
      })
    );
  }

  isBranchActive(item: NavMenu): boolean {
    return !!item?.key && this.autoExpandedKeys.has(item.key);
  }

  getIconClass(item: NavMenu): string[] {
    const iconClasses: string[] = [];

    if (item?.iconType === "line-awesome") {
      if (item.iconStyle === "regular") {
        iconClasses.push("lar");
      } else if (item.iconStyle === "brands") {
        iconClasses.push("lab");
      } else {
        iconClasses.push("las");
      }
    }

    if (item?.iconType === "feather") {
      iconClasses.push("feather");
    }

    if (item?.icon) {
      iconClasses.push(item.icon);
    }

    return iconClasses;
  }

  private filterVisibleMenu(nodes: NavMenu[]): NavMenu[] {
    return (nodes || [])
      .filter((node) => this.isVisible(node))
      .map((node) => ({
        ...node,
        submenu: this.filterVisibleMenu(node.submenu || []),
      }))
      .filter((node) => {
        if (node.type === "title") {
          return (node.submenu || []).length > 0;
        }

        if (node.type === "collapse") {
          return (node.submenu || []).length > 0;
        }

        return true;
      });
  }

  private syncExpandedState(): void {
    this.autoExpandedKeys.clear();
    this.collectActiveAncestors(this.menu, []);
  }

  private collectActiveAncestors(
    nodes: NavMenu[],
    ancestors: string[],
  ): boolean {
    for (const node of nodes || []) {
      const nextAncestors =
        node.type === "title" ? [...ancestors] : [...ancestors, node.key];

      if (node.path && this.isExactRouteActive(node.path)) {
        ancestors.forEach((key) => {
          this.autoExpandedKeys.add(key);
        });
        return true;
      }

      if (
        this.hasChildren(node) &&
        this.collectActiveAncestors(node.submenu || [], nextAncestors)
      ) {
        if (node.type !== "title" && node.key) {
          this.autoExpandedKeys.add(node.key);
        }
        return true;
      }
    }

    return false;
  }
}
