import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Favorite } from '../models/favoriteModel.js';
import { Vehicle } from '../models/vehicleModel.js';
import { Battery } from '../models/batteryModel.js';

dotenv.config();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

(async () => {
  try {
    await connectDB();

    const all = await Favorite.find({}).lean();
    console.log(`Found ${all.length} favorite records`);

    const toDeleteIds = [];
    const toNormalize = [];

    // Partition by type and prepare lookups
    const vehicleFavs = all.filter((f) => String(f.itemType).toLowerCase() === 'vehicle');
    const batteryFavs = all.filter((f) => String(f.itemType).toLowerCase() === 'battery');

    // Remove invalid ObjectIds immediately
    for (const f of all) {
      if (!isValidId(f.itemId) || !isValidId(f.userId)) {
        toDeleteIds.push(f._id);
      } else {
        // Normalize type casing if needed
        if (f.itemType !== 'Vehicle' && f.itemType !== 'Battery') {
          toNormalize.push({
            _id: f._id,
            itemType: String(f.itemType).toLowerCase() === 'vehicle' ? 'Vehicle' : 'Battery',
          });
        }
      }
    }

    // Check existence of referenced docs
    const vIds = vehicleFavs.map((f) => f.itemId).filter(isValidId);
    const bIds = batteryFavs.map((f) => f.itemId).filter(isValidId);

    const [vDocs, bDocs] = await Promise.all([
      vIds.length ? Vehicle.find({ _id: { $in: vIds } }).select('_id') : [],
      bIds.length ? Battery.find({ _id: { $in: bIds } }).select('_id') : [],
    ]);

    const vSet = new Set(vDocs.map((d) => String(d._id)));
    const bSet = new Set(bDocs.map((d) => String(d._id)));

    for (const f of vehicleFavs) {
      if (!vSet.has(String(f.itemId))) toDeleteIds.push(f._id);
    }
    for (const f of batteryFavs) {
      if (!bSet.has(String(f.itemId))) toDeleteIds.push(f._id);
    }

    // Apply normalization
    if (toNormalize.length) {
      for (const n of toNormalize) {
        await Favorite.updateOne({ _id: n._id }, { $set: { itemType: n.itemType } });
      }
      console.log(`Normalized ${toNormalize.length} favorites' itemType casing.`);
    }

    // Delete broken favorites
    if (toDeleteIds.length) {
      const res = await Favorite.deleteMany({ _id: { $in: toDeleteIds } });
      console.log(`Removed ${res.deletedCount} invalid favorites.`);
    } else {
      console.log('No invalid favorites to remove.');
    }

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('fixFavorites error:', err);
    process.exit(1);
  }
})();
