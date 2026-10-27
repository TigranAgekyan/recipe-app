import type { Recipe } from "../api";

// Sample data for the demo build (see demoApi.ts). Replace with real
// recipes from the database whenever you like: same shape as GET
// /recipes/{id}. A YouTube source_url shows that video's thumbnail; null
// shows the placeholder.

const day = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(Date.now() - n * day).toISOString();

// The cookbook the demo opens with, newest first
export const seedRecipes: Recipe[] = [
  {
    id: 6,
    title: "Crispy Smashed Potatoes",
    source_url: null,
    servings: 4,
    total_time_minutes: 55,
    created_at: daysAgo(1),
    ingredients: [
      { name: "baby potatoes", quantity: "1", unit: "kg", note: null },
      { name: "olive oil", quantity: "4", unit: "tbsp", note: null },
      { name: "garlic", quantity: "3", unit: "cloves", note: "finely grated" },
      { name: "flaky salt", quantity: null, unit: null, note: "to taste" },
      { name: "parsley", quantity: "1", unit: "handful", note: "chopped" },
    ],
    steps: [
      { text: "Boil the potatoes in well-salted water until a knife slides in easily.", timer_seconds: 1200, timer_label: "Boil potatoes" },
      { text: "Drain and let them steam dry for a few minutes. Heat the oven to 230°C.", timer_seconds: 300, timer_label: "Steam dry" },
      { text: "Smash each potato flat on an oiled tray, drizzle with the rest of the oil and season.", timer_seconds: null, timer_label: null },
      { text: "Roast until deep golden and crisp at the edges.", timer_seconds: 1500, timer_label: "Roast" },
      { text: "Toss with the garlic and parsley straight out of the oven, then finish with flaky salt.", timer_seconds: null, timer_label: null },
    ],
  },
  {
    id: 5,
    title: "Shakshuka",
    source_url: null,
    servings: 2,
    total_time_minutes: 30,
    created_at: daysAgo(3),
    ingredients: [
      { name: "olive oil", quantity: "2", unit: "tbsp", note: null },
      { name: "onion", quantity: "1", unit: null, note: "diced" },
      { name: "red bell pepper", quantity: "1", unit: null, note: "diced" },
      { name: "garlic", quantity: "3", unit: "cloves", note: "sliced" },
      { name: "cumin", quantity: "1", unit: "tsp", note: null },
      { name: "sweet paprika", quantity: "2", unit: "tsp", note: null },
      { name: "crushed tomatoes", quantity: "400", unit: "g", note: null },
      { name: "eggs", quantity: "4", unit: null, note: null },
      { name: "feta", quantity: "50", unit: "g", note: "crumbled, optional" },
    ],
    steps: [
      { text: "Soften the onion and pepper in the oil over medium heat.", timer_seconds: 480, timer_label: "Soften veg" },
      { text: "Add the garlic, cumin and paprika and stir for a minute until fragrant.", timer_seconds: 60, timer_label: "Bloom spices" },
      { text: "Pour in the tomatoes, season, and simmer until thickened.", timer_seconds: 600, timer_label: "Simmer sauce" },
      { text: "Make four wells, crack in the eggs, cover and cook until the whites are just set.", timer_seconds: 360, timer_label: "Cook eggs" },
      { text: "Top with feta and serve with bread.", timer_seconds: null, timer_label: null },
    ],
  },
  {
    id: 4,
    title: "Weeknight Chicken Curry",
    source_url: null,
    servings: 4,
    total_time_minutes: 45,
    created_at: daysAgo(6),
    ingredients: [
      { name: "chicken thighs", quantity: "700", unit: "g", note: "boneless, cut into chunks" },
      { name: "onions", quantity: "2", unit: null, note: "finely chopped" },
      { name: "ginger-garlic paste", quantity: "2", unit: "tbsp", note: null },
      { name: "curry powder", quantity: "2", unit: "tbsp", note: null },
      { name: "coconut milk", quantity: "400", unit: "ml", note: null },
      { name: "spinach", quantity: "2", unit: "handfuls", note: null },
      { name: "neutral oil", quantity: "2", unit: "tbsp", note: null },
    ],
    steps: [
      { text: "Fry the onions in the oil until deep golden.", timer_seconds: 720, timer_label: "Brown onions" },
      { text: "Stir in the ginger-garlic paste and curry powder and cook for two minutes.", timer_seconds: 120, timer_label: "Toast spices" },
      { text: "Add the chicken and turn until coated, then pour in the coconut milk.", timer_seconds: null, timer_label: null },
      { text: "Simmer gently until the chicken is cooked through and the sauce has thickened.", timer_seconds: 1200, timer_label: "Simmer curry" },
      { text: "Wilt in the spinach, season with salt, and serve with rice.", timer_seconds: null, timer_label: null },
    ],
  },
  {
    id: 3,
    title: "Brown Butter Chocolate Chip Cookies",
    source_url: null,
    servings: 18,
    total_time_minutes: 50,
    created_at: daysAgo(10),
    ingredients: [
      { name: "butter", quantity: "170", unit: "g", note: null },
      { name: "brown sugar", quantity: "150", unit: "g", note: null },
      { name: "white sugar", quantity: "50", unit: "g", note: null },
      { name: "egg", quantity: "1", unit: null, note: "plus 1 yolk" },
      { name: "vanilla extract", quantity: "2", unit: "tsp", note: null },
      { name: "flour", quantity: "220", unit: "g", note: null },
      { name: "baking soda", quantity: "1/2", unit: "tsp", note: null },
      { name: "dark chocolate", quantity: "200", unit: "g", note: "chopped" },
    ],
    steps: [
      { text: "Brown the butter in a pan until nutty and amber, then let it cool slightly.", timer_seconds: 360, timer_label: "Brown butter" },
      { text: "Whisk in both sugars, the egg, yolk and vanilla until glossy.", timer_seconds: null, timer_label: null },
      { text: "Fold in the flour, baking soda, a pinch of salt and the chocolate.", timer_seconds: null, timer_label: null },
      { text: "Chill the dough so the cookies don't spread too much.", timer_seconds: 1800, timer_label: "Chill dough" },
      { text: "Scoop onto a lined tray and bake at 180°C until the edges are set.", timer_seconds: 660, timer_label: "Bake" },
    ],
  },
  {
    id: 2,
    title: "Garlic Butter Pasta",
    source_url: null,
    servings: 2,
    total_time_minutes: 20,
    created_at: daysAgo(15),
    ingredients: [
      { name: "spaghetti", quantity: "200", unit: "g", note: null },
      { name: "butter", quantity: "40", unit: "g", note: null },
      { name: "garlic", quantity: "5", unit: "cloves", note: "thinly sliced" },
      { name: "chili flakes", quantity: "1/2", unit: "tsp", note: null },
      { name: "parmesan", quantity: "40", unit: "g", note: "finely grated" },
      { name: "lemon", quantity: "1/2", unit: null, note: "zest and juice" },
    ],
    steps: [
      { text: "Cook the spaghetti in salted water until just shy of al dente. Save a mug of the water.", timer_seconds: 540, timer_label: "Cook pasta" },
      { text: "Meanwhile, melt the butter and gently fry the garlic and chili until pale gold.", timer_seconds: 180, timer_label: "Fry garlic" },
      { text: "Toss in the pasta with a splash of the water and the parmesan until silky.", timer_seconds: null, timer_label: null },
      { text: "Finish with lemon zest and juice.", timer_seconds: null, timer_label: null },
    ],
  },
  {
    id: 1,
    title: "Overnight Oats",
    source_url: null,
    servings: 1,
    total_time_minutes: 5,
    created_at: daysAgo(21),
    ingredients: [
      { name: "rolled oats", quantity: "50", unit: "g", note: null },
      { name: "milk", quantity: "120", unit: "ml", note: "any kind" },
      { name: "Greek yogurt", quantity: "2", unit: "tbsp", note: null },
      { name: "chia seeds", quantity: "1", unit: "tsp", note: null },
      { name: "honey", quantity: "1", unit: "tsp", note: null },
      { name: "berries", quantity: "1", unit: "handful", note: "to serve" },
    ],
    steps: [
      { text: "Stir everything except the berries together in a jar.", timer_seconds: null, timer_label: null },
      { text: "Cover and refrigerate overnight, or at least four hours.", timer_seconds: null, timer_label: null },
      { text: "Top with berries in the morning.", timer_seconds: null, timer_label: null },
    ],
  },
];

// Recipes a demo import "extracts", handed out in order (then repeating),
// whatever link was pasted. id and created_at are filled in on import
export const importPool: Omit<Recipe, "id" | "created_at">[] = [
  {
    title: "Miso Glazed Salmon",
    source_url: null,
    servings: 2,
    total_time_minutes: 25,
    ingredients: [
      { name: "salmon fillets", quantity: "2", unit: null, note: "skin on" },
      { name: "white miso", quantity: "2", unit: "tbsp", note: null },
      { name: "honey", quantity: "1", unit: "tbsp", note: null },
      { name: "soy sauce", quantity: "1", unit: "tbsp", note: null },
      { name: "rice vinegar", quantity: "1", unit: "tsp", note: null },
      { name: "spring onions", quantity: "2", unit: null, note: "sliced" },
    ],
    steps: [
      { text: "Whisk the miso, honey, soy and vinegar into a glaze.", timer_seconds: null, timer_label: null },
      { text: "Brush it over the salmon and let it sit while the grill heats.", timer_seconds: 600, timer_label: "Marinate" },
      { text: "Grill skin-side down until the glaze caramelises and the fish flakes.", timer_seconds: 480, timer_label: "Grill salmon" },
      { text: "Scatter over the spring onions and serve with rice.", timer_seconds: null, timer_label: null },
    ],
  },
  {
    title: "Classic Hummus",
    source_url: null,
    servings: 6,
    total_time_minutes: 15,
    ingredients: [
      { name: "cooked chickpeas", quantity: "500", unit: "g", note: "still warm" },
      { name: "tahini", quantity: "120", unit: "g", note: null },
      { name: "lemon juice", quantity: "3", unit: "tbsp", note: null },
      { name: "garlic", quantity: "1", unit: "clove", note: null },
      { name: "ice water", quantity: "60", unit: "ml", note: null },
      { name: "olive oil", quantity: null, unit: null, note: "to serve" },
    ],
    steps: [
      { text: "Blend the tahini, lemon juice, garlic and a pinch of salt until thick.", timer_seconds: 60, timer_label: "Blend tahini" },
      { text: "Add the warm chickpeas and blend, streaming in the ice water, until very smooth.", timer_seconds: 240, timer_label: "Blend hummus" },
      { text: "Spread in a bowl and finish with olive oil.", timer_seconds: null, timer_label: null },
    ],
  },
  {
    title: "Fluffy Pancakes",
    source_url: null,
    servings: 3,
    total_time_minutes: 25,
    ingredients: [
      { name: "flour", quantity: "200", unit: "g", note: null },
      { name: "baking powder", quantity: "2", unit: "tsp", note: null },
      { name: "sugar", quantity: "1", unit: "tbsp", note: null },
      { name: "milk", quantity: "250", unit: "ml", note: null },
      { name: "egg", quantity: "1", unit: null, note: null },
      { name: "melted butter", quantity: "30", unit: "g", note: "plus more for the pan" },
    ],
    steps: [
      { text: "Mix the dry ingredients, then whisk in the milk, egg and butter until just combined.", timer_seconds: null, timer_label: null },
      { text: "Rest the batter so it thickens.", timer_seconds: 300, timer_label: "Rest batter" },
      { text: "Cook ladlefuls in a buttered pan until bubbles form, then flip.", timer_seconds: 150, timer_label: "First side" },
      { text: "Cook the second side until golden.", timer_seconds: 60, timer_label: "Second side" },
    ],
  },
];
