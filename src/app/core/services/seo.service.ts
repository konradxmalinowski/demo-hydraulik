import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FAQ_ITEMS } from '../../data/faq.data';

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://konradxmalinowski.github.io/demo-hydraulik';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const BUSINESS_NAME = 'HydroFix 24/7 - Hydraulik Kraków';
const PHONE = '+48 123 456 789';
const EMAIL = 'kontakt@hydrofix-krakow.pl';
const ADDRESS = 'ul. Wodna 12, 30-001 Kraków';
const LOCALITY = 'Kraków';
const REGION = 'małopolskie';
const POSTAL_CODE = '30-001';
const COUNTRY = 'PL';
const LATITUDE = '50.0647';
const LONGITUDE = '19.9450';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  setPage(config: SeoConfig): void {
    const fullTitle = `${config.title} | HydroFix 24/7 Kraków`;
    const image = config.image ?? DEFAULT_IMAGE;
    const url = config.url ? `${BASE_URL}${config.url}` : BASE_URL;

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'pl_PL' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonicalUrl(url);

    if (config.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    }
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  injectLocalBusinessJsonLd(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['LocalBusiness', 'PlumbingService'],
          '@id': `${BASE_URL}/#business`,
          name: BUSINESS_NAME,
          description: 'Profesjonalne usługi hydrauliczne w Krakowie i okolicach. Pogotowie hydrauliczne 24/7, usuwanie awarii, montaż armatury, instalacje wodne i kanalizacyjne.',
          url: BASE_URL,
          telephone: PHONE,
          email: EMAIL,
          image: DEFAULT_IMAGE,
          logo: `${BASE_URL}/favicon.svg`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: ADDRESS,
            addressLocality: LOCALITY,
            addressRegion: REGION,
            postalCode: POSTAL_CODE,
            addressCountry: COUNTRY,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: LATITUDE,
            longitude: LONGITUDE,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              opens: '00:00',
              closes: '23:59',
            },
          ],
          priceRange: '$$',
          currenciesAccepted: 'PLN',
          paymentAccepted: 'Cash, Credit Card, Bank Transfer',
          areaServed: [
            { '@type': 'City', name: 'Kraków' },
            { '@type': 'City', name: 'Wieliczka' },
            { '@type': 'City', name: 'Skawina' },
            { '@type': 'City', name: 'Myślenice' },
            { '@type': 'City', name: 'Niepołomice' },
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Usługi hydrauliczne',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Usuwanie awarii hydraulicznych' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Montaż armatury łazienkowej' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Instalacje wodne' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Instalacje kanalizacyjne' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ogrzewanie i pompy ciepła' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pogotowie hydrauliczne 24/7' } },
            ],
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '127',
            bestRating: '5',
          },
        },
        this.buildFaqJsonLd(),
      ],
    };

    this.injectJsonLd('local-business-jsonld', schema);
  }

  private buildFaqJsonLd(): object {
    return {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/faq#faqpage`,
      mainEntity: FAQ_ITEMS.slice(0, 8).map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }

  private injectJsonLd(id: string, schema: object): void {
    // Safe for both SSR and browser
    const existing = this.document.getElementById(id);
    if (existing) {
      existing.textContent = JSON.stringify(schema);
      return;
    }
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
