const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const Review = require('./models/Review');
const Content = require('./models/Content');
const entertainmentService = require('./services/entertainmentService');

dotenv.config();

const seedData = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seeder] Seeding media contents catalog to MongoDB Atlas...');
    await Content.deleteMany({});
    const curatedItems = entertainmentService.getAllCurated();
    const contentDocs = curatedItems.map((item) => ({
      contentId: item.id,
      contentType: item.contentType,
      title: item.title,
      subtitle: item.subtitle,
      overview: item.overview,
      posterUrl: item.posterUrl,
      backdropUrl: item.backdropUrl,
      releaseDate: item.releaseDate,
      rating: item.rating,
      voteCount: item.voteCount,
      genre: item.genre,
      durationOrAlbum: item.durationOrAlbum,
      trailerUrl: item.trailerUrl,
      trailerKey: item.trailerKey,
      previewUrl: item.previewUrl,
      cast: item.cast,
      featured: !!item.featured,
    }));
    await Content.insertMany(contentDocs);
    console.log(`[Seeder] Seeded ${contentDocs.length} media contents into MongoDB Atlas!`);

    console.log('[Seeder] Clearing existing test data...');
    await User.deleteMany({ email: { $in: ['demo@binus.ac.id', 'john@example.com'] } });

    console.log('[Seeder] Creating demo users...');
    const demoUser = await User.create({
      username: 'binusian_user',
      email: 'demo@binus.ac.id',
      password: 'password123',
      fullName: 'Binus Student Demo',
      bio: 'Movie & Music Critic @ Entertainment Hub',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    });

    const secondUser = await User.create({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      fullName: 'John Cinephile',
      bio: 'Soundtrack collector & TV enthusiast',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    });

    console.log('[Seeder] Seeding initial favorites...');
    await Favorite.deleteMany({ userId: { $in: [demoUser._id, secondUser._id] } });
    await Favorite.create([
      {
        userId: demoUser._id,
        contentId: 'm-1',
        contentType: 'movie',
        title: 'Dune: Part Two',
        subtitle: 'Denis Villeneuve',
        posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        releaseDate: '2024-03-01',
        rating: 8.6,
        genre: 'Sci-Fi / Adventure',
        durationOrAlbum: '166 min',
      },
      {
        userId: demoUser._id,
        contentId: 'music-1',
        contentType: 'music',
        title: 'Cruel Summer',
        subtitle: 'Taylor Swift',
        posterUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/600x600bb.jpg',
        backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
        releaseDate: '2019-08-23',
        rating: 9.3,
        genre: 'Pop / Synth-pop',
        durationOrAlbum: 'Lover • 2:58',
      },
      {
        userId: demoUser._id,
        contentId: 'tv-2993',
        contentType: 'tv',
        title: 'Stranger Things',
        subtitle: 'The Duffer Brothers',
        posterUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/595/1489169.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
        releaseDate: '2016-07-15',
        rating: 8.7,
        genre: 'Drama / Fantasy / Horror',
        durationOrAlbum: '4 Seasons • 34 Eps',
      },
    ]);

    console.log('[Seeder] Seeding initial reviews & ratings...');
    await Review.deleteMany({ userId: { $in: [demoUser._id, secondUser._id] } });
    await Review.create([
      {
        userId: demoUser._id,
        username: demoUser.username,
        userAvatar: demoUser.avatar,
        contentId: 'm-1',
        contentType: 'movie',
        contentTitle: 'Dune: Part Two',
        rating: 5,
        reviewText: 'Masterpiece sinematik yang luar biasa! Visual dan sound design karya Hans Zimmer benar-benar membawa pengalaman menonton ke level yang belum pernah ada sebelumnya.',
      },
      {
        userId: secondUser._id,
        username: secondUser.username,
        userAvatar: secondUser.avatar,
        contentId: 'm-1',
        contentType: 'movie',
        contentTitle: 'Dune: Part Two',
        rating: 5,
        reviewText: 'Akting Timothée Chalamet dan Austin Butler sangat memukau. Salah satu film sci-fi terbaik sepanjang masa.',
      },
      {
        userId: demoUser._id,
        username: demoUser.username,
        userAvatar: demoUser.avatar,
        contentId: 'music-1',
        contentType: 'music',
        contentTitle: 'Cruel Summer',
        rating: 5,
        reviewText: 'Bridge lagunya tiada tandingan! Melodi synth-pop yang sangat adiktif.',
      },
      {
        userId: secondUser._id,
        username: secondUser.username,
        userAvatar: secondUser.avatar,
        contentId: 'tv-2993',
        contentType: 'tv',
        contentTitle: 'Stranger Things',
        rating: 4,
        reviewText: 'Atmosfer 80-an yang sangat kental dan misteri Upside Down yang membuat penasaran di setiap episodenya.',
      },
    ]);

    console.log('\n=============================================');
    console.log('✅ Seeding Selesai!');
    console.log('Akun Demo Pengujian:');
    console.log('  Email: demo@binus.ac.id');
    console.log('  Password: password123');
    console.log('  Username: binusian_user');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Gagal:', error);
    process.exit(1);
  }
};

seedData();
