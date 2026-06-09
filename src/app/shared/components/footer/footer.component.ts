import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

const FOOTER_TEXT = 'Projekt demonstracyjny wykonany przez Konrada Malinowskiego';
const GITHUB_URL = 'https://github.com/konradxmalinowski/demo-hydraulik';
const PORTFOLIO_URL = 'https://konradmalinowski.pl';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-gray-900 text-gray-100 py-6 px-4 mt-auto">
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-center sm:text-left">
          {{ footerText }} &copy; {{ year }}
        </p>
        <nav class="flex gap-4 text-sm" aria-label="Footer navigation">
          <a
            [href]="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-orange-400 transition-colors underline"
          >
            GitHub
          </a>
          <a
            [href]="portfolioUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-orange-400 transition-colors underline"
          >
            Portfolio
          </a>
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly footerText = FOOTER_TEXT;
  protected readonly githubUrl = GITHUB_URL;
  protected readonly portfolioUrl = PORTFOLIO_URL;
  protected readonly year = new Date().getFullYear();
}
