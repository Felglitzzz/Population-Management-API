class LocationMiddleware {
  static checkCreateApexLocationReqBody(req, res, next) {
    const { name, maleCount, femaleCount, subLocationName } = req.body;

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

    if (!subLocationName) {
      return res.status(400).send({
        message: "Name of sublocation is required"
      })
    }

    if (!name) {
      return res.status(400).send({
        message: "Name of apex location is required"
      })
    }

    return next()
  }

  static checkCreateSublocationReqBody(req, res, next) {
    const { maleCount, femaleCount, subLocationName, parentId } = req.body;

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

    if (!subLocationName) {
      return res.status(400).send({
        message: "Name of sublocation is required"
      })
    }

    if (!parentId) {
      return res.status(400).send({
        message: "apex location id is required"
      })
    }

    return next()
  }

  static checkUpdateSublocationReqBody(req, res, next) {
    const { maleCount, femaleCount, subLocationName } = req.body;

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

    if (!subLocationName) {
      return res.status(400).send({
        message: "Name of sublocation is required"
      })
    }

    return next()
  }

  static checkLocationReqBody(req, res, next) {
    const { maleCount, femaleCount, name } = req.body;

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

    if (!name) {
      return res.status(400).send({
        message: "Name of location is required"
      })
    }

    return next()
  }
}

export default LocationMiddleware;
