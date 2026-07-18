export const parsePrice = (price: string): number => {
  const parsedPrice = Number(price.replace('$', ''));

  if (!Number.isFinite(parsedPrice)) {
    throw new Error(`Invalid price: "${price}"`);
  }

  return parsedPrice;
};

export const formatPrice = (price: number): string => price.toFixed(2);

export const roundPrice = (price: number): number => Number(price.toFixed(2));
