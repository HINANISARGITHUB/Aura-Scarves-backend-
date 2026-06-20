require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Style = require('./models/Style')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB...')

  // Create admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aurascarves.com'
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@123'
  let admin = await User.findOne({ email: adminEmail })
  if (!admin) {
    admin = await User.create({ name: 'Admin', email: adminEmail, password: adminPass, role: 'admin' })
    console.log(`✅ Admin created: ${adminEmail} / ${adminPass}`)
  } else {
    console.log('✅ Admin already exists')
  }

  // Sample styles
  const count = await Style.countDocuments()
  if (count === 0) {
    const sampleStyles = [
      { title: 'Classic Chiffon Drape', description: 'A timeless chiffon hijab that drapes beautifully for any occasion. Lightweight and breathable.', category: 'Casual', fabric: 'Chiffon', occasion: 'Daily', price: 1800, images: ['https://images.unsplash.com/photo-1529139574466-a303027614b8?w=600&q=80'] },
      { title: 'Silk Formal Wrap', description: 'Luxurious silk hijab perfect for formal events. Subtle sheen and elegant drape.', category: 'Formal', fabric: 'Silk', occasion: 'Office', price: 4500, featured: true, images: ['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80'] },
      { title: 'Occasion Satin Glow', description: 'Satin hijab with a beautiful gloss finish. Ideal for weddings and celebrations.', category: 'Occasion', fabric: 'Satin', occasion: 'Wedding', price: 3200, featured: true, images: ['https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=600&q=80'] },
      { title: 'Jersey Everyday Comfort', description: 'Stretchy jersey fabric for all-day comfort. No-slip and easy to style.', category: 'Casual', fabric: 'Jersey', occasion: 'Daily', price: 1200, images: ['https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80'] },
      { title: 'Bridal Pearl Veil', description: 'Exquisite bridal hijab adorned with subtle pearl embellishments. The perfect wedding look.', category: 'Bridal', fabric: 'Silk', occasion: 'Wedding', price: 8500, featured: true, images: ['https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80'] },
      { title: 'Voile Summer Breeze', description: 'Ultra-light voile hijab perfect for warm weather. Airy and comfortable.', category: 'Casual', fabric: 'Voile', occasion: 'Beach', price: 1500, images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&q=80'] },
    ]
    await Style.insertMany(sampleStyles)
    console.log(`✅ ${sampleStyles.length} sample styles created`)
  } else {
    console.log(`✅ ${count} styles already exist`)
  }

  console.log('\n🎉 Seed complete!')
  console.log(`\n📌 Admin Login:\n   Email: ${adminEmail}\n   Password: ${adminPass}\n`)
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
