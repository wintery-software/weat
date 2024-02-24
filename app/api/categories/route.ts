const getCategories = () => {
  const regions = ['Chinese', 'Indian', 'Japanese', 'Korean', 'Mexican', 'Taiwanese', 'Thai', 'Vietnamese'];

  const types = [
    'Bakery',
    'Barbecue',
    'Breakfast & Brunch',
    'Bubble Tea',
    'Buffet',
    'Burgers',
    'Cafe',
    'Desserts',
    'Dim Sum',
    'Fast Food',
    'Hot Pot',
    'Noodles',
    'Pizza',
    'Seafood',
    'Sushi',
  ];

  return regions.concat(types);
};

export async function GET() {
  return Response.json(getCategories());
}
