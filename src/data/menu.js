export const categories = ['All', 'Coffee', 'Cold Drinks', 'Tea & More', 'Pastries']

const items = [
  // Coffee
  { id: 1, name: 'Espresso', category: 'Coffee', temp: 'hot', vegan: true, price: 3.0, emoji: '☕', description: 'A bold double shot with a rich golden crema.' },
  { id: 2, name: 'Americano', category: 'Coffee', temp: 'hot', vegan: true, price: 3.5, emoji: '☕', description: 'Espresso topped with hot water for a smooth, long cup.' },
  { id: 3, name: 'Cappuccino', category: 'Coffee', temp: 'hot', vegan: false, price: 4.25, emoji: '☕', description: 'Equal parts espresso, steamed milk and velvety foam.' },
  { id: 4, name: 'Flat White', category: 'Coffee', temp: 'hot', vegan: false, price: 4.25, emoji: '☕', description: 'Silky microfoam poured over a double ristretto.' },
  { id: 5, name: 'Signature Latte', category: 'Coffee', temp: 'hot', vegan: false, price: 4.5, emoji: '☕', description: 'Double espresso, steamed milk and a touch of caramel.' },
  { id: 6, name: 'Oat Milk Latte', category: 'Coffee', temp: 'hot', vegan: true, price: 4.75, emoji: '☕', description: 'Creamy oat milk meets our house espresso blend.' },

  // Cold Drinks
  { id: 7, name: 'Cold Brew', category: 'Cold Drinks', temp: 'iced', vegan: true, price: 4.0, emoji: '🧊', description: 'Steeped for 18 hours, smooth and low in acidity.' },
  { id: 8, name: 'Iced Latte', category: 'Cold Drinks', temp: 'iced', vegan: false, price: 4.75, emoji: '🧊', description: 'Espresso and cold milk poured over ice.' },
  { id: 9, name: 'Iced Caramel Macchiato', category: 'Cold Drinks', temp: 'iced', vegan: false, price: 5.25, emoji: '🧊', description: 'Vanilla, milk, espresso and a caramel drizzle.' },
  { id: 10, name: 'Iced Matcha', category: 'Cold Drinks', temp: 'iced', vegan: true, price: 5.0, emoji: '🍵', description: 'Ceremonial matcha whisked with oat milk over ice.' },

  // Tea & More
  { id: 11, name: 'Chai Latte', category: 'Tea & More', temp: 'hot', vegan: false, price: 4.5, emoji: '🍵', description: 'Spiced black tea with steamed milk and honey.' },
  { id: 12, name: 'Green Tea', category: 'Tea & More', temp: 'hot', vegan: true, price: 3.25, emoji: '🍵', description: 'Delicate loose-leaf sencha, lightly grassy and fresh.' },
  { id: 13, name: 'Iced Peach Tea', category: 'Tea & More', temp: 'iced', vegan: true, price: 3.75, emoji: '🍑', description: 'Black tea shaken with ripe peach and a hint of mint.' },
  { id: 14, name: 'Hot Chocolate', category: 'Tea & More', temp: 'hot', vegan: false, price: 4.0, emoji: '🍫', description: 'Dark chocolate melted into steamed milk.' },

  // Pastries
  { id: 15, name: 'Butter Croissant', category: 'Pastries', temp: 'none', vegan: false, price: 3.25, emoji: '🥐', description: 'Baked fresh every morning, flaky and golden.' },
  { id: 16, name: 'Blueberry Muffin', category: 'Pastries', temp: 'none', vegan: false, price: 3.5, emoji: '🧁', description: 'Soft and fruity with a crisp sugar top.' },
  { id: 17, name: 'Vegan Banana Bread', category: 'Pastries', temp: 'none', vegan: true, price: 3.75, emoji: '🍞', description: 'Moist, naturally sweet, and packed with walnuts.' },
  { id: 18, name: 'Cinnamon Roll', category: 'Pastries', temp: 'none', vegan: false, price: 4.0, emoji: '🥮', description: 'Warm and gooey with cream cheese frosting.' },
]

// Load every image in the folder. Vite handles the file paths for us.
const images = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

// "Signature Latte" -> "signature-latte"
const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

// Find the photo whose filename matches the item name
const findImage = (item) =>
  Object.entries(images).find(([path]) => {
    const file = path.split('/').pop().replace(/\.\w+$/, '')
    return file === toSlug(item.name)
  })?.[1]

export const menuItems = items.map((item) => ({
  ...item,
  image: findImage(item),
}))

// Highest price on the menu, rounded up. Used by the price slider.
export const MAX_PRICE = Math.ceil(Math.max(...menuItems.map((item) => item.price)))