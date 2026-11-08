import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import cocktailsJson from '../../../assets/data/cocktails.json';
import { Cocktail } from '../models/cocktail';

// The images are downloaded files, so these tests check what a type system cannot:
// the file exists, it is really a JPEG (not a saved error page), it is small enough
// for the app, and its source is recorded.
const cocktails = cocktailsJson as Cocktail[];

const MAX_IMAGE_BYTES = 500 * 1024;
const MIN_IMAGE_BYTES = 5 * 1024;
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];

const fileOf = (cocktail: Cocktail) => resolve(process.cwd(), 'src', cocktail.image);

function cocktailsWhere(isBad: (cocktail: Cocktail) => boolean): string[] {
  return cocktails.filter(isBad).map((cocktail) => cocktail.id);
}

describe('cocktail images', () => {
  it('has an image file for every cocktail', () => {
    expect(cocktailsWhere((c) => !existsSync(fileOf(c)))).toEqual([]);
  });

  it('only contains real JPEG files', () => {
    const notJpeg = (c: Cocktail) => {
      const header = readFileSync(fileOf(c)).subarray(0, 3);
      return !JPEG_SIGNATURE.every((byte, index) => header[index] === byte);
    };

    expect(cocktailsWhere((c) => existsSync(fileOf(c)) && notJpeg(c))).toEqual([]);
  });

  it('keeps every image between 5 KB and 500 KB', () => {
    const badSize = (c: Cocktail) => {
      const size = statSync(fileOf(c)).size;
      return size < MIN_IMAGE_BYTES || size > MAX_IMAGE_BYTES;
    };

    expect(cocktailsWhere((c) => existsSync(fileOf(c)) && badSize(c))).toEqual([]);
  });

  it('records the source of every image in docs/DATA_SOURCES.md', () => {
    const sources = readFileSync(resolve(process.cwd(), 'docs', 'DATA_SOURCES.md'), 'utf8');

    expect(cocktailsWhere((c) => !sources.includes(`${c.id}.jpg`))).toEqual([]);
  });

  it('does not use the same image file for two cocktails', () => {
    const present = cocktails.filter((c) => existsSync(fileOf(c)));
    const contents = present.map((c) => readFileSync(fileOf(c)).toString('base64'));
    const duplicates = present.filter((_, index) => contents.indexOf(contents[index]) !== index);

    expect(duplicates.map((c) => c.id)).toEqual([]);
  });
});
