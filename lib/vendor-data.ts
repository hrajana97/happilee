import { Vendor } from "./types"

export const vendorData: Vendor[] = [
  {
    id: "1",
    name: "Gourmet Celebrations",
    category: "Catering",
    description: "Luxury catering service specializing in wedding celebrations and formal events",
    image: "/images/vendors/catering-1.jpg",
    startingPrice: "$3,000",
    packages: [
      {
        id: "gc-1",
        vendorName: "Gourmet Celebrations",
        packageName: "Essential Package",
        price: 3000,
        pricePerPerson: 75,
        description: "Perfect for intimate gatherings",
        includedServices: [
          "Appetizers",
          "Main Course",
          "Dessert Station",
          "Service Staff"
        ],
        additionalFees: [
          { name: "Service Charge", amount: 500 },
          { name: "Equipment Rental", amount: 300 }
        ],
        terms: [
          "50% deposit required",
          "Minimum 30 guests",
          "Cancellation policy: 30 days notice"
        ],
        menuItems: {
          appetizers: ["Bruschetta", "Shrimp Cocktail", "Mini Quiche"],
          mainCourse: ["Beef Tenderloin", "Grilled Salmon", "Vegetarian Pasta"],
          desserts: ["Wedding Cake", "Chocolate Fountain", "Mini Pastries"]
        },
        staffing: {
          servers: 4,
          chefs: 2,
          bartenders: 2
        },
        equipment: true,
        hours: 6
      }
    ]
  },
  {
    id: "2",
    name: "Elegant Eats",
    category: "Catering",
    description: "Farm-to-table catering with a focus on seasonal ingredients",
    image: "/images/vendors/catering-2.jpg",
    startingPrice: "$2,500",
    packages: [
      {
        id: "ee-1",
        vendorName: "Elegant Eats",
        packageName: "Seasonal Delights",
        price: 2500,
        pricePerPerson: 65,
        description: "Seasonal menu featuring local ingredients",
        includedServices: [
          "Passed Hors d'oeuvres",
          "Buffet Service",
          "Coffee & Tea Station",
          "Wait Staff"
        ],
        additionalFees: [
          { name: "Travel Fee", amount: 200 },
          { name: "Setup Fee", amount: 250 }
        ],
        terms: [
          "40% deposit required",
          "Minimum 25 guests",
          "14-day cancellation notice"
        ],
        menuItems: {
          appetizers: ["Seasonal Crostini", "Local Cheese Board", "Garden Fresh Crudités"],
          mainCourse: ["Herb Roasted Chicken", "Local Fish", "Seasonal Risotto"],
          desserts: ["Seasonal Fruit Tarts", "Local Ice Cream", "Cookie Display"]
        },
        staffing: {
          servers: 3,
          chefs: 1,
          bartenders: 1
        },
        equipment: true,
        hours: 5
      }
    ]
  },
  {
    id: "3",
    name: "Divine Dining",
    category: "Catering",
    description: "International cuisine with a modern twist",
    image: "/images/vendors/catering-3.jpg",
    startingPrice: "$3,500",
    packages: [
      {
        id: "dd-1",
        vendorName: "Divine Dining",
        packageName: "Global Fusion",
        price: 3500,
        pricePerPerson: 85,
        description: "International cuisine featuring multiple food stations",
        includedServices: [
          "International Food Stations",
          "Live Cooking Demonstrations",
          "Full Service Staff",
          "Bar Service"
        ],
        additionalFees: [
          { name: "Chef Station Fee", amount: 400 },
          { name: "Premium Bar Setup", amount: 600 }
        ],
        terms: [
          "60% deposit required",
          "Minimum 40 guests",
          "45-day cancellation notice"
        ],
        menuItems: {
          appetizers: ["Sushi Display", "Mediterranean Mezze", "Asian Dumplings"],
          mainCourse: ["Prime Rib Station", "Seafood Paella", "Thai Curry Station"],
          desserts: ["International Dessert Display", "Crepe Station", "Gelato Bar"]
        },
        staffing: {
          servers: 5,
          chefs: 3,
          bartenders: 2
        },
        equipment: true,
        hours: 7
      }
    ]
  }
]

