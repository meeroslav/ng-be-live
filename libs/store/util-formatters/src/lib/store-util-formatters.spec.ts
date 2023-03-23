import { formatRating } from './store-util-formatters';

describe('formatRating', () => {
  it('should work', () => {
    expect(formatRating(97)).toEqual('9.7');
  });
});
