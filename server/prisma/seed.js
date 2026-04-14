const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  
  await prisma.product.createMany({
    data: [
      {
        name: 'Heirloom Tomatoes',
        description: 'Grown in rich volcanic soil, these tomatoes offer an explosion of sweet and acidic flavors.',
        price: 4.50,
        unit: 'lb',
        category: 'Vegetables',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6mwhqljw0EL8bnicSlJTCLTHZ3dKQi5QLCIbJWPJQ289bUTeu0nJIFq1mQHTGtGgY4aVz1kq7K_EpgdnxUhV5mRHt02KmCcw9IHZCL6XRJTu3LmYc52I_vHe8qeX8JteT2_6VBZPleOBtwCzuQHub5aEI0mX2K25dNFXMObN8bfLdsL-cMI47ZQGGYbQ3kJnP3RwKBgRwylIoYV8wD_KeWK0D6CWCGo8kJrivwpCg4mS0-j0PFnAEtDOv9lHcaWZbKxvEHHnKBsIn',
        available: 150,
        farmerName: 'Silas Miller',
        farmerDist: '12km',
        isOrganic: true,
        slug: 'tomatoes'
      },
      {
        name: 'Wildflower Honey',
        description: 'Raw, unfiltered honey harvested from high-altitude meadows in late spring.',
        price: 12.00,
        unit: 'jar',
        category: 'Dairy',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxGo8xykMfbW_ceFT__cHRwmW8L6PVNhS-3cKFMGqetC1J-2zm7QpwRVDjpAVewSFPzn5vu0ALNydaxIDyDGU92whXMBeF-MV0zC-4ZZKlDBV6fEyonnRjxiLgVL6DY4dQbY3nKU-smvtWYJ6DbOiqFv-P5Quqemdzajanq_PqDxKWMarRGw5v8Pah9RjMjcrgfJ6pkxWavuibueejkbu0uWR42aqKYLyQQmfiHzjByBUyef-VjyO8cvu0cWs_n8fNXmq6HXkVT8vo',
        available: 45,
        farmerName: 'Sarah Webb',
        farmerDist: '8km',
        isOrganic: false,
        slug: 'honey'
      },
      {
        name: 'Artisan Sourdough',
        description: 'Slow-fermented for 48 hours using ancient grains for a rich, tangy profile.',
        price: 6.75,
        unit: 'ea',
        category: 'Grains',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8ZSuovOBGVxAffx-kjE9loSIkjB0GYDry3AX5ripkDTwVL9qrrA801RJJWSUy0KBfNo73lAdcLxFTiLXmjLgg2gGXYiQxEmqSuRH5Uu20MuOrYy7US54pE89ZmettXrgffmbEjNwJlvyfc4AgQ8DHRV5ZKqV5nL2HrBmFf7fV_tXq6YVUQcNBwL7Y8a6G2DCuAIrX4FILNA0cuH_cvx7Hb5OJwoxhiLU6KzqgYbGjYJASDPaoYTV085Ur3BdXOsBoioCVYJ6ZKH3P',
        available: 30,
        farmerName: 'Baker Joe',
        farmerDist: '5km',
        isOrganic: true,
        slug: 'sourdough'
      },
      {
         name: 'Heirloom Honeycrisp Apples',
         description: 'Crisp, juicy, and exceptionally sweet with a subtle tart finish.',
         price: 4.50,
         unit: 'kg',
         category: 'Fruits',
         image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMRQ_ItuR2-n42eSBVhlINF4ujp5RwRQEaP51GzJ59CF-sT1DzPHDNN1UQXGnkYXVV9oTGoUbFZwVV-SE_B0i0zMs7XuJd8QzZtTOagn29-ULiB6Gu4-O1vJLtLHnY0DUL5rR7Gj-7obA8sh0Hq-qyMenCzfbanLb_9k0MYUn7jbqn2rZEroGeRGZMTIYoA3ktQJmmHEN9e9yYK0VZRQYZ_U2Xve2zO2unoBjGu7n0R0MIjiPBXdIxGmbDg9hdn0c_OUkg5gKaX0TD',
         available: 450,
         farmerName: 'Silas Miller',
         farmerDist: '12km',
         isOrganic: true,
         slug: 'apples'
      }
    ]
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
