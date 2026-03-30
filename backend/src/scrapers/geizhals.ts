import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Page } from 'puppeteer';

puppeteerExtra.use(StealthPlugin());

const GEIZHALS_BASE_URL = 'https://geizhals.de';
const SEARCH_PATH = '/?fs=';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 ProcureDockBot/1.0';

export class GeizhalsNoVendorOfferError extends Error {}
export class GeizhalsRobotsBlockedError extends Error {}

interface ScrapeParams {
  productName: string;
  vendorName: string;
}

interface ScrapedOffer {
  price: number;
  url: string;
  inStock: boolean;
}

interface OfferCandidate {
  vendorName: string;
  priceText: string;
  url: string;
  availabilityText: string;
}

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' und ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const parseGermanPrice = (value: string): number => {
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsed = Number.parseFloat(normalized);

  if (Number.isNaN(parsed)) {
    throw new Error(`Could not parse price from "${value}"`);
  }

  return parsed;
};

const isLikelyInStock = (availabilityText: string): boolean => {
  const text = normalizeText(availabilityText);

  if (!text) {
    return false;
  }

  const negativeSignals = ['nicht lagernd', 'nicht auf lager', 'ausverkauft', 'nicht verfugbar', 'derzeit nicht'];
  const positiveSignals = ['lagernd', 'sofort', 'lieferbar', 'verfugbar', 'ab lager'];

  if (negativeSignals.some((signal) => text.includes(signal))) {
    return false;
  }

  return positiveSignals.some((signal) => text.includes(signal));
};

const isAllowedByRobots = async (targetPath: string): Promise<boolean> => {
  const response = await fetch(`${GEIZHALS_BASE_URL}/robots.txt`, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!response.ok) {
    return false;
  }

  const robotsTxt = await response.text();
  const lines = robotsTxt.split(/\r?\n/);
  const disallowedPaths = new Set<string>();
  let appliesToAll = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const [directiveRaw, ...valueParts] = trimmed.split(':');
    if (!directiveRaw || valueParts.length === 0) {
      continue;
    }

    const directive = directiveRaw.trim().toLowerCase();
    const value = valueParts.join(':').trim();

    if (directive === 'user-agent') {
      appliesToAll = value === '*';
      continue;
    }

    if (appliesToAll && directive === 'disallow' && value) {
      disallowedPaths.add(value);
    }
  }

  for (const blockedPath of disallowedPaths) {
    if (targetPath.startsWith(blockedPath)) {
      return false;
    }
  }

  return true;
};

const extractFirstProductUrl = async (page: Page): Promise<string | null> =>
  page.evaluate(() => {
    const browserGlobal = globalThis as unknown as {
      document: { querySelectorAll: (selector: string) => ArrayLike<{ href?: string }> };
    };
    const anchors = Array.from(browserGlobal.document.querySelectorAll('a[href]'));
    const candidates = anchors
      .map((anchor) => anchor.href ?? '')
      .filter((href) => href.includes('/?cat=') || href.includes('/a') || href.includes('/preisvergleich/'));

    return candidates[0] ?? null;
  });

const extractOfferCandidates = async (page: Page): Promise<OfferCandidate[]> =>
  page.evaluate(() => {
    type BrowserNode = {
      innerText?: string;
      href?: string;
      querySelector: (selector: string) => BrowserNode | null;
    };
    const browserDocument = (globalThis as unknown as {
      document: { querySelectorAll: (selector: string) => ArrayLike<BrowserNode> };
    }).document;
    const rows = Array.from(browserDocument.querySelectorAll('article, .offer__row, .row.offer, .gh_offers li, .offers-list__item'));

    const offers = rows
      .map((row) => {
        const text = row.innerText || '';

        const vendorElement =
          row.querySelector('[data-testid*="merchant"], [class*="merchant"], [class*="shop"], [class*="vendor"]');
        const priceElement =
          row.querySelector('[data-testid*="price"], [class*="price"]');
        const availabilityElement =
          row.querySelector('[data-testid*="availability"], [class*="availability"], [class*="stock"], [class*="delivery"]');
        const linkElement =
          row.querySelector('a[href*="http"], a[href*="/jump"], a[href]');

        const priceFallback = text.match(/\d[\d.,]*\s*€/);

        return {
          vendorName: vendorElement?.innerText?.trim() ?? '',
          priceText: priceElement?.innerText?.trim() ?? priceFallback?.[0] ?? '',
          url: linkElement?.href ?? '',
          availabilityText: availabilityElement?.innerText?.trim() ?? text,
        };
      })
      .filter((offer) => offer.vendorName && offer.priceText && offer.url);

    return offers;
  });

export const scrapeGeizhalsOfferForVendor = async ({
  productName,
  vendorName,
}: ScrapeParams): Promise<ScrapedOffer> => {
  const searchPath = `${SEARCH_PATH}${encodeURIComponent(productName)}`;
  const isAllowed = await isAllowedByRobots(searchPath);

  if (!isAllowed) {
    throw new GeizhalsRobotsBlockedError('Scraping blocked by geizhals.de robots.txt');
  }

  const browser = await puppeteerExtra.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setViewport({ width: 1440, height: 1200 });

    await page.goto(`${GEIZHALS_BASE_URL}${searchPath}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForSelector('a[href]', { timeout: 10000 });

    const productUrl = await extractFirstProductUrl(page);

    if (!productUrl) {
      throw new GeizhalsNoVendorOfferError(`No Geizhals product page found for "${productName}"`);
    }

    await page.goto(productUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForSelector('body', { timeout: 10000 });

    const offers = await extractOfferCandidates(page);
    const normalizedVendorName = normalizeText(vendorName);
    const matchedOffer = offers.find((offer) => {
      const normalizedOfferVendor = normalizeText(offer.vendorName);
      return (
        normalizedOfferVendor.includes(normalizedVendorName) ||
        normalizedVendorName.includes(normalizedOfferVendor)
      );
    });

    if (!matchedOffer) {
      throw new GeizhalsNoVendorOfferError(
        `No Geizhals offer found for vendor "${vendorName}" and product "${productName}"`,
      );
    }

    return {
      price: parseGermanPrice(matchedOffer.priceText),
      url: matchedOffer.url,
      inStock: isLikelyInStock(matchedOffer.availabilityText),
    };
  } finally {
    await browser.close();
  }
};
