import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding demo data...")

  // Create demo host
  const hashedPassword = await bcrypt.hash("demo123", 10)

  const demoHost = await prisma.user.upsert({
    where: { email: "host@demo.com" },
    update: {},
    create: {
      email: "host@demo.com",
      name: "Sarah Mitchell",
      password: hashedPassword,
      role: "host",
      emailVerified: new Date(),
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
  })
  console.log("Created demo host:", demoHost.email)

  // Create demo guest
  const demoGuest = await prisma.user.upsert({
    where: { email: "guest@demo.com" },
    update: {},
    create: {
      email: "guest@demo.com",
      name: "Alex Johnson",
      password: hashedPassword,
      role: "guest",
      emailVerified: new Date(),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
  })
  console.log("Created demo guest:", demoGuest.email)

  // Sample listing images from Unsplash
  const listingImages = {
    beachHouse: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    ],
    mountainCabin: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80",
    ],
    cityLoft: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    desertRetreat: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    lakehouse: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
  }

  // Create demo listings
  const listings = [
    {
      title: "Oceanfront Paradise with Private Beach Access",
      description: "Wake up to stunning ocean views in this beautifully renovated beach house. Features floor-to-ceiling windows, a gourmet kitchen, and direct access to a pristine private beach. Perfect for remote workers with dedicated workspace and high-speed WiFi.",
      price: 285,
      location: "Malibu, California",
      type: "House",
      bedrooms: "3",
      bathrooms: "2",
      maxGuests: 6,
      amenities: ["WiFi", "Kitchen", "Pool", "Beach Access", "Parking", "Air Conditioning", "Washer", "Dryer"],
      images: listingImages.beachHouse,
      vibes: ["luxury", "nature", "quiet"],
      workFriendly: true,
      workAmenities: ["fast_wifi", "dedicated_desk"],
      wifiSpeed: 200,
      idealFor: ["vacation", "honeymoon", "remote_work"],
    },
    {
      title: "Cozy Mountain Cabin with Hot Tub & Fireplace",
      description: "Escape to this charming A-frame cabin nestled in the pines. Features a wood-burning fireplace, private hot tub with mountain views, and fully equipped kitchen. Ideal for couples or small families seeking a peaceful retreat.",
      price: 175,
      location: "Aspen, Colorado",
      type: "Cabin",
      bedrooms: "2",
      bathrooms: "1",
      maxGuests: 4,
      amenities: ["WiFi", "Kitchen", "Hot Tub", "Fireplace", "Parking", "Heating", "Mountain View"],
      images: listingImages.mountainCabin,
      vibes: ["cozy", "rustic", "nature", "quiet"],
      workFriendly: true,
      workAmenities: ["fast_wifi"],
      wifiSpeed: 100,
      idealFor: ["vacation", "honeymoon", "adventure"],
    },
    {
      title: "Modern Downtown Loft in Arts District",
      description: "Stylish industrial loft in the heart of the city's vibrant arts district. Exposed brick, 16-foot ceilings, and designer furnishings. Walk to galleries, restaurants, and nightlife. Dedicated workspace perfect for business travelers.",
      price: 195,
      location: "Austin, Texas",
      type: "Loft",
      bedrooms: "1",
      bathrooms: "1",
      maxGuests: 2,
      amenities: ["WiFi", "Kitchen", "Gym", "Parking", "Air Conditioning", "Washer", "Dryer"],
      images: listingImages.cityLoft,
      vibes: ["modern", "urban", "social"],
      workFriendly: true,
      workAmenities: ["fast_wifi", "dedicated_desk", "monitor"],
      wifiSpeed: 500,
      idealFor: ["business", "remote_work"],
    },
    {
      title: "Luxurious Desert Retreat with Pool & Spa",
      description: "Experience desert luxury in this stunning modern home. Features a saltwater pool, outdoor spa, and panoramic views of Joshua Tree. Stargazing deck, chef's kitchen, and smart home technology throughout.",
      price: 350,
      location: "Joshua Tree, California",
      type: "Villa",
      bedrooms: "4",
      bathrooms: "3",
      maxGuests: 8,
      amenities: ["WiFi", "Kitchen", "Pool", "Hot Tub", "Parking", "Air Conditioning", "BBQ", "Fire Pit"],
      images: listingImages.desertRetreat,
      vibes: ["luxury", "modern", "quiet", "nature"],
      workFriendly: false,
      workAmenities: [],
      wifiSpeed: 150,
      idealFor: ["vacation", "family", "honeymoon"],
    },
    {
      title: "Serene Lakefront Cottage with Private Dock",
      description: "Peaceful cottage on crystal-clear lake with private dock and kayaks included. Wrap-around porch perfect for morning coffee. Fully renovated with modern amenities while keeping its classic charm.",
      price: 225,
      location: "Lake Tahoe, Nevada",
      type: "Cottage",
      bedrooms: "3",
      bathrooms: "2",
      maxGuests: 6,
      amenities: ["WiFi", "Kitchen", "Lake Access", "Kayaks", "Parking", "Fireplace", "BBQ", "Heating"],
      images: listingImages.lakehouse,
      vibes: ["cozy", "nature", "quiet"],
      workFriendly: true,
      workAmenities: ["fast_wifi", "dedicated_desk"],
      wifiSpeed: 100,
      idealFor: ["vacation", "family", "remote_work"],
    },
  ]

  for (const listing of listings) {
    const created = await prisma.listing.upsert({
      where: {
        id: `demo-${listing.title.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`,
      },
      update: {
        ...listing,
        imageSrc: listing.images[0],
        hostId: demoHost.id,
      },
      create: {
        id: `demo-${listing.title.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`,
        ...listing,
        imageSrc: listing.images[0],
        hostId: demoHost.id,
      },
    })
    console.log("Created listing:", created.title)
  }

  // Create a sample booking
  const listing = await prisma.listing.findFirst({
    where: { hostId: demoHost.id },
  })

  if (listing) {
    const checkIn = new Date()
    checkIn.setDate(checkIn.getDate() + 7) // 1 week from now
    const checkOut = new Date(checkIn)
    checkOut.setDate(checkOut.getDate() + 3) // 3 night stay

    await prisma.booking.upsert({
      where: { id: "demo-booking-1" },
      update: {},
      create: {
        id: "demo-booking-1",
        checkIn,
        checkOut,
        guests: 2,
        totalPrice: listing.price * 3,
        serviceFee: 0,
        status: "confirmed",
        guestId: demoGuest.id,
        listingId: listing.id,
      },
    })
    console.log("Created demo booking")

    // Create a review
    await prisma.review.upsert({
      where: { bookingId: "demo-booking-1" },
      update: {},
      create: {
        rating: 5,
        comment: "Absolutely stunning property! The views were incredible and Sarah was an amazing host. The place was spotless and had everything we needed. Can't wait to come back!",
        cleanliness: 5,
        accuracy: 5,
        checkIn: 5,
        communication: 5,
        location: 5,
        value: 5,
        bookingId: "demo-booking-1",
        listingId: listing.id,
        guestId: demoGuest.id,
      },
    })
    console.log("Created demo review")

    // Create maintenance items
    const maintenanceItems = [
      {
        id: "demo-maint-1",
        name: "HVAC Filter",
        category: "hvac",
        location: "Main Unit",
        quantity: 1,
        notes: "Replace every 90 days for optimal air quality",
        lastServiceDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        nextServiceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        intervalDays: 90,
        status: "good",
      },
      {
        id: "demo-maint-2",
        name: "Smoke Detector Batteries",
        category: "safety",
        location: "All Rooms",
        quantity: 4,
        notes: "Test monthly, replace batteries annually",
        lastServiceDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), // 300 days ago
        nextServiceDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days overdue
        intervalDays: 365,
        status: "overdue",
      },
      {
        id: "demo-maint-3",
        name: "Pool Pump Inspection",
        category: "appliance",
        location: "Pool Equipment Room",
        quantity: 1,
        notes: "Annual professional inspection recommended",
        lastServiceDate: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000), // 170 days ago
        nextServiceDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        intervalDays: 180,
        status: "due_soon",
      },
      {
        id: "demo-maint-4",
        name: "Deep Cleaning",
        category: "cleaning",
        location: "Entire Property",
        quantity: 1,
        notes: "Professional deep clean including carpets and upholstery",
        lastServiceDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        nextServiceDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000), // 65 days from now
        intervalDays: 90,
        status: "good",
      },
      {
        id: "demo-maint-5",
        name: "Exterior Paint Touch-up",
        category: "exterior",
        location: "Front Deck & Railings",
        quantity: 1,
        notes: "Check for weather damage and touch up as needed",
        lastServiceDate: null,
        nextServiceDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        intervalDays: 365,
        status: "due_soon",
      },
    ]

    for (const item of maintenanceItems) {
      await prisma.maintenanceItem.upsert({
        where: { id: item.id },
        update: item,
        create: {
          ...item,
          listingId: listing.id,
        },
      })
    }
    console.log("Created demo maintenance items")

    // Create maintenance logs for some items
    await prisma.maintenanceLog.upsert({
      where: { id: "demo-log-1" },
      update: {},
      create: {
        id: "demo-log-1",
        action: "replaced",
        notes: "Replaced with MERV-13 filter for better air quality",
        cost: 45.00,
        performedBy: "Self",
        maintenanceItemId: "demo-maint-1",
        performedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.maintenanceLog.upsert({
      where: { id: "demo-log-2" },
      update: {},
      create: {
        id: "demo-log-2",
        action: "inspected",
        notes: "All detectors functioning properly",
        cost: 0,
        performedBy: "Self",
        maintenanceItemId: "demo-maint-2",
        performedAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
      },
    })
    console.log("Created demo maintenance logs")

    // Create a conversation between host and guest
    const conversation = await prisma.conversation.upsert({
      where: { id: "demo-conversation-1" },
      update: {},
      create: {
        id: "demo-conversation-1",
        listingId: listing.id,
        bookingId: "demo-booking-1",
      },
    })

    // Add participants
    await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: demoHost.id,
        },
      },
      update: {},
      create: {
        conversationId: conversation.id,
        userId: demoHost.id,
        lastReadAt: new Date(),
      },
    })

    await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: demoGuest.id,
        },
      },
      update: {},
      create: {
        conversationId: conversation.id,
        userId: demoGuest.id,
        lastReadAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    })
    console.log("Created demo conversation")

    // Create messages
    const messages = [
      {
        id: "demo-msg-1",
        content: "Hi Sarah! I just booked your beautiful beach house for next week. We're so excited! Is there anything we should know before arriving?",
        senderId: demoGuest.id,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: "demo-msg-2",
        content: "Hi Alex! Welcome, and thank you for booking! 🌊 The house is all ready for you. A few tips:\n\n• Check-in is at 3 PM - I'll send you the door code the day before\n• Beach towels and chairs are in the garage\n• The best sunset views are from the back deck!\n\nLet me know if you have any questions!",
        senderId: demoHost.id,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 3 days ago + 2 hours
      },
      {
        id: "demo-msg-3",
        content: "That's so helpful, thank you! One quick question - is the WiFi fast enough for video calls? I might need to take a work call or two.",
        senderId: demoGuest.id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: "demo-msg-4",
        content: "Absolutely! We have 200 Mbps fiber internet, perfect for video calls. There's also a dedicated desk in the upstairs loft with a great ocean view - perfect for working! 💻",
        senderId: demoHost.id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 2 days ago + 30 min
      },
      {
        id: "demo-msg-5",
        content: "Perfect! Can't wait to check in. See you soon!",
        senderId: demoGuest.id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: "demo-msg-6",
        content: "Here's your door code: 4829 🔑\n\nThe lockbox is on the left side of the front door. Have a wonderful stay! Text me if you need anything at all.",
        senderId: demoHost.id,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    ]

    for (const msg of messages) {
      await prisma.message.upsert({
        where: { id: msg.id },
        update: msg,
        create: {
          ...msg,
          conversationId: conversation.id,
        },
      })
    }
    console.log("Created demo messages")
  }

  console.log("\n✅ Demo data seeded successfully!")
  console.log("\n📧 Demo Accounts:")
  console.log("   Host:  host@demo.com / demo123")
  console.log("   Guest: guest@demo.com / demo123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
