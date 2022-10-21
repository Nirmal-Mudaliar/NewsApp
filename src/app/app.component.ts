import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NewsService } from './service/news.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit{

  title = 'NewsApp';
  public sources: any = [];
  public articles: any = [];
  public selectedNewsChannel: string = "Top 10 trending news"
  @ViewChild(MatSidenav) sideNav!: MatSidenav;

  constructor(
    private observer: BreakpointObserver, 
    private cdr: ChangeDetectorRef,
    private newsApi: NewsService,
  ) {

  }
  ngOnInit(): void {
    this.newsApi.initSources()
    .subscribe((res: any) => {
      console.log(res);
      this.sources = res.sources;
    });

    this.newsApi.initArticles()
    .subscribe((res: any) => {
      console.log(res);
      this.articles = res.articles;
    });

    

  }

  ngAfterViewInit(): void {
    this.sideNav.opened = false;
    this.observer.observe(['(max-width:787px)']).subscribe((res: BreakpointState)=> {
      if (res?.matches) {
        this.sideNav.mode="over";
        this.sideNav.close();
      }
      else {
        this.sideNav.mode="side";
        this.sideNav.open();
      }
    });
    this.cdr.detectChanges();
  }

  searchSource(source: any) {
    this.newsApi.getArticlesBySourceId(source.id)
    .subscribe((res: any) => {
      this.articles = res.articles 
      this.selectedNewsChannel = source.name
    })
  }
}
