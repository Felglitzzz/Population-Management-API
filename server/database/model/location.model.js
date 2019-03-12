import mongoose, { Schema } from 'mongoose';

let Location;

const SubLocationSchema = new Schema({
  subLocationName: { type: String, required: true },
  maleCount: { type: Number, default: 0 },
  femaleCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  apex: { type: Boolean, default: false},
  parentId: { type: Schema.Types.ObjectId }
})

const LocationSchema = new Schema({
  name: { type: String, required: true },
  maleCount: { type: Number, default: 0 },
  femaleCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  apex: { type: Boolean, default: true },
  subLocations: [SubLocationSchema]
})

LocationSchema.methods.toJSON = function() {
  const thisLocationObject = this.toObject()
  if (thisLocationObject.subLocations.length) {
    delete thisLocationObject.maleCount;
    delete thisLocationObject.femaleCount;
    delete thisLocationObject.totalCount;
    return thisLocationObject
  }
  delete thisLocationObject.subLocations;
  return thisLocationObject
}

Location = mongoose.model('location', LocationSchema)

export default Location;
