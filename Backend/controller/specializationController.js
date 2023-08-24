const specializationModel = require("../model/specializationModel");

module.exports = {
  getSpecialization: async (req, res) => {
    try {
      const id = req.query.name;
      const specData = await specializationModel.findOne(
        { name: id },
        { name: 1, description: 1, _id: 0, image: 1 }
      );
      if (specData) {
        res.status(200).json({
          status: true,
          document: specData,
        });
      }
    } catch (error) {
      res.status(error.status).json({
        message: error.message,
      });
    }
  },

  updateSpecialization: async (req, res) => {
    try {
      const { formValues } = req.body;

      const form = JSON.parse(formValues);

      const image = req?.file?.filename;

      specializationModel
        .findOneAndUpdate(
          { name: form.id },
          {
            $set: {
              name: form.name,
              description: form.description,
              image: image,
            },
          }
        )
        .then((result) => {
          res.json({
            status: true,
            message: "Successfully updated",
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      res.status(error.status).json({
        message: error.message,
      });
    }
  },
};
