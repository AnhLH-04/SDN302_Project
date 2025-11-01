import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';

dotenv.config();

const fixItemType = async () => {
    try {
        await connectDB();

        console.log('🔧 Updating itemType fields to lowercase...');

        const result = await mongoose.connection.db.collection('transactions').updateMany(
            { itemType: { $in: ['Vehicle', 'Battery'] } },
            [
                {
                    $set: {
                        itemType: {
                            $cond: {
                                if: { $eq: ['$itemType', 'Vehicle'] },
                                then: 'vehicle',
                                else: 'battery'
                            }
                        }
                    }
                }
            ]
        );

        console.log(`✅ Updated ${result.modifiedCount} transactions`);

        // Verify
        const sample = await mongoose.connection.db.collection('transactions').findOne({});
        console.log('📋 Sample transaction itemType:', sample?.itemType);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixItemType();
