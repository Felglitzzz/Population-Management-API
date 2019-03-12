import Location from '../database/model/location.model';

class LocationController {

  static createApexLocationAndSubLocation(req, res) {
    const {name, subLocationName, maleCount, femaleCount} = req.body;
    const apexLocation = new Location({
      name,
      subLocations:[{
        subLocationName,
        maleCount,
        femaleCount,
      }]
    })

    apexLocation.save()
      .then((record) => {
        record.subLocations.forEach(subRecord => {
          Location.updateOne(
            {"_id": record._id, "subLocations._id": subRecord._id},
            {$set: {
              "subLocations.$.totalCount": subRecord.maleCount + subRecord.femaleCount,
              "subLocations.$.parentId": record._id
            }}
          )
          .then(() => {
            return res.status(200).send({
              message: 'Apex Location and sublocation created successfully'
            })
          })
          .catch(err => {
            return res.status(201).send({
              message: 'error creating apex location and sub location',
              error: err.message
            })
          })
        })
      })
      .catch(err => {
        return res.status(201).send({
          message: 'error creating apex location and sub location',
          error: err.message
        })
      })
  }

  static createSublocation(req, res) {
    const { maleCount, femaleCount, parentId, subLocationName } = req.body;
    const subLocation = {
      subLocationName,
      maleCount,
      femaleCount,
      totalCount: maleCount + femaleCount,
      parentId
    }

    Location.findOne({"_id": parentId})
    .then(record => {
      if(!record) {
        return res.status(400).send({
          message: 'apex location not found'
        })
      }
      if (!record.subLocations.length) {
        return res.status(422).send({
          message: 'location does not have sub locations'
        })
      }
      record.subLocations.push(subLocation)
      record.save();
      return res.status(201).send({
        message: "sublocation added to apex location successfully"
      })
    })
    .catch(err => {
      return res.status(500).send({
        message: 'error occured adding a sublocation to apex location',
        error: err.message
      })
    })
  }

  static createLocation(req, res) {
    const { maleCount, femaleCount, name } = req.body;
    const apexLocationWithNoSubLocation = new Location({
      name,
      maleCount,
      femaleCount
    })

    apexLocationWithNoSubLocation.save()
    .then((record) => {
      Location.updateOne(
        {"_id": record._id},
        {$set: {
          totalCount: record.maleCount + record.femaleCount
        }}
      )
      .then(() => res.status(200).send({
        message: 'Location created successfully'
      }))
      .catch(err => res.status(500).send({
        message: 'error creating location'
      }))
    })
    .catch(err => {
      return res.status(500).send({
      message: 'error creating location'
    })})
  }

  static async get(req, res) {
    try {
      const locations = await Location.find()
      if (locations) {
        return res.status(201).send({
          message: 'locations retrieved successfully',
          data: locations
        })
      }
    } catch (err) {
      return res.status(500).send({
        message: 'something happened retrieving locations',
        error: err.message
      })
    }
  }

  static async updateLocation(req, res) {
    const {id} = req.params;
    const { name, maleCount, femaleCount } = req.body;
    Location.findById(id)
    .then(record => {
      if (!name) {
        return res.status(400).send({
          message: 'Location Name is required'
        })
      }
      if (!maleCount) {
        return res.status(400).send({
          message: 'Number of male resident field is required'
        })
      }
      if (!femaleCount) {
        return res.status(400).send({
          message: 'Number of female resident field is required'
        })
      }

      record.updateOne({
        name,
        maleCount,
        femaleCount,
        totalCount: maleCount + femaleCount
      })
      .then((data) => {
        return res.status(200).send({
          message: 'Location updated successfully',
        })
      })
      .catch(err => {
        return res.status(500).send({
          message: 'error occured updating location',
        })
      })
    })
  }

  static updateSubLocations(req, res) {
    const { parentId, id } = req.params;
    const { subLocationName, maleCount, femaleCount} = req.body;

    Location.update(
      {"_id": parentId, "subLocations._id": id},
      { "$set": {
        "subLocations.$.maleCount": maleCount,
        "subLocations.$.femaleCount": femaleCount,
        "subLocations.$.subLocationName": subLocationName,
        "subLocations.$.totalCount": femaleCount + maleCount,
      }}
    ).then(data => {
      return res.status(200).send({
        message: 'sublocation updated successfully',
      })
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(422).send({
          message: 'Incorrect parent or sublocation Id',
        });
      }
      return res.status(500).send({
        message: 'error occured updating sub location name',
        error: err.message
      })
    })
  }

  static updateApexLocation(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    Location.findById(id)
    .then(record => {
      if (!name) {
        return res.status(400).send({
          message: 'Parent Location Name is required'
        })
      }
      if (!record) {
        return res.status(404).send({
          message: 'Parent Location Not Found'
        })
      }
      record.updateOne({name})
        .then(() => {
          return res.status(200).send({
            message: 'parent location name updated successfully',
          })
        })
        .catch(err => {
          return res.status(500).send({
            message: 'error occured updating the parent location name',
          })
        })
    })
  }

  static deleteLocation(req, res) {
    const {id} = req.params
    Location.findOneAndDelete({"_id": id})
      .then(data => {
        if(!data) {
          return res.status(404).send({
            message: 'location not found'
          })
        }
        console.log('removed data', data)
        res.status(200).send({
          message: 'location removed successfully'
        })
      })
      .catch(err => {
        console.log('err deleting==>>', err)
        res.status(500).send({
          message: 'error occurred deleting location',
          error: err.message
        })
      }) 
  }

  static deleteSubLocation(req, res) {
    const {id, parentId} = req.params
    console.log('che kooo', id, parentId)
    Location.findOne({"_id": parentId, "subLocations._id": id})
      .then(record => {
        if(!record) {
          return res.status(400).send({
            message: 'apex location not found'
          })
        }
        if (!record.subLocations.length) {
          return res.status(422).send({
            message: 'location does not have sub locations'
          })
        }

        record.subLocations.pull(id)
        record.save()
          .then(() => {
            return res.status(200).send({
              message: 'sublocation deleted successfully',
            })
          })
          .catch(err => {
            return res.status(200).send({
              message: 'error occurred when deleting sublocation',
            })
          })
      })
      .catch(err => {
        return res.status(200).send({
          message: 'error occurred when deleting sublocation',
        })
      })

  }
}

export default LocationController