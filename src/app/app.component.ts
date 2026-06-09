import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DemoModalComponent } from './shared/components/demo-modal/demo-modal.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DemoModalComponent, FooterComponent, NavbarComponent, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  title = 'demo-hydraulik';

  ngOnInit(): void {
    this.seoService.injectLocalBusinessJsonLd();
  }
}
