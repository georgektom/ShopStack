import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const catalog = [
  {
    name: "Audio",
    slug: "audio",
    products: [
      {
        name: "Aero ANC Headphones",
        slug: "aero-anc-headphones",
        description:
          "Wireless over-ear headphones with adaptive noise cancellation, spatial audio, and a 40-hour battery.",
        price: 249,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 14
      },
      {
        name: "Beam Smart Speaker",
        slug: "beam-smart-speaker",
        description:
          "Compact room-filling speaker with voice controls, multi-room sync, and tuned bass response.",
        price: 129,
        image:
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 22
      },
      {
        name: "Pulse Studio Earbuds",
        slug: "pulse-studio-earbuds",
        description:
          "Low-latency earbuds with wireless charging, sweat resistance, and crystal-clear call isolation.",
        price: 159,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 31
      }
    ]
  },
  {
    name: "Computing",
    slug: "computing",
    products: [
      {
        name: "Arc 32-inch 4K Monitor",
        slug: "arc-32-inch-4k-monitor",
        description:
          "A sharp 4K display with USB-C docking, 144Hz refresh rate, and edge-to-edge glass.",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 8
      },
      {
        name: "Vector Mechanical Keyboard",
        slug: "vector-mechanical-keyboard",
        description:
          "Hot-swappable wireless mechanical keyboard with aluminum frame and tactile switches.",
        price: 189,
        image:
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 17
      },
      {
        name: "Frame 4K Webcam",
        slug: "frame-4k-webcam",
        description:
          "AI-assisted framing, dual beamforming microphones, and studio-grade glass optics.",
        price: 99,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 28
      }
    ]
  },
  {
    name: "Accessories",
    slug: "accessories",
    products: [
      {
        name: "Flux GaN Charger",
        slug: "flux-gan-charger",
        description:
          "A compact 100W GaN charger with three ports and intelligent device power balancing.",
        price: 69,
        image:
          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 42
      },
      {
        name: "Luma USB-C Hub",
        slug: "luma-usb-c-hub",
        description:
          "A brushed aluminum 8-in-1 hub with HDMI, Ethernet, SD, and high-speed passthrough charging.",
        price: 79,
        image:
          "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 35
      },
      {
        name: "Glide Wireless Mouse",
        slug: "glide-wireless-mouse",
        description:
          "Precision mouse with silent clicks, programmable buttons, and all-day ergonomic comfort.",
        price: 59,
        image:
          "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 25
      }
    ]
  },
  {
    name: "Smart Home",
    slug: "smart-home",
    products: [
      {
        name: "Halo Desk Lamp",
        slug: "halo-desk-lamp",
        description:
          "A color-tunable lamp with wireless charging base, motion detection, and scene presets.",
        price: 89,
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 18
      },
      {
        name: "NestView Indoor Cam",
        slug: "nestview-indoor-cam",
        description:
          "An indoor security camera with privacy shutter, HDR video, and person detection alerts.",
        price: 119,
        image:
          "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 16
      },
      {
        name: "Orbit Smart Plug Duo",
        slug: "orbit-smart-plug-duo",
        description:
          "Two Wi-Fi smart plugs with energy monitoring, voice control, and automations support.",
        price: 39,
        image:
          "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?auto=format&fit=crop&w=1200&q=80",
        inventoryCount: 40
      }
    ]
  }
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const category of catalog) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        products: {
          create: category.products
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
