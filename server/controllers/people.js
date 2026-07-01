const People = require("../models/people");
const { uploadToBunny, deleteFromBunny } = require("../lib/bunnyService");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const getAllPeople = async (req, res) => {
  try {
    const people = await People.find({})
      .populate("country_code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "People retrieved successfully",
      data: people,
      total: people.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getPersonById = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await People.findById(id).populate("country_code");

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    return res.status(200).json({
      message: "Person retrieved successfully",
      data: person,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getPersonBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const person = await People.findOne({ slug }).populate("country_code");

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    return res.status(200).json({
      message: "Person retrieved successfully",
      data: person,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createPeople = async (req, res) => {
  try {
    const { full_name, birth_date, country_code, bio, slug } = req.body;

    if (!full_name || !birth_date || !country_code || !bio) {
      return res.status(400).json({
        message: "full_name, birth_date, country_code and bio are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Avatar image is required" });
    }

    let parsedDate;
    if (birth_date.includes("/")) {
      const [day, month, year] = birth_date.split("/");
      parsedDate = new Date(`${year}-${month}-${day}`);
    } else if (birth_date.includes("-")) {
      parsedDate = new Date(birth_date);
    } else {
      return res.status(400).json({
        message: "Invalid birth_date format. Use YYYY-MM-DD or DD/MM/YYYY",
      });
    }

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid birth_date value",
      });
    }

    const generatedSlug = slug || generateSlug(full_name);

    const existingPerson = await People.findOne({
      $or: [{ full_name }, { slug: generatedSlug }],
    });

    if (existingPerson) {
      return res.status(409).json({
        message: "Person with the same name or slug already exists",
      });
    }

    const avatarUpload = await uploadToBunny(
      req.file.buffer,
      req.file.originalname,
      "people/avatars",
    );

    if (!avatarUpload.success) {
      return res.status(500).json({ message: "Failed to upload avatar" });
    }

    const newPerson = new People({
      full_name,
      slug: generatedSlug,
      birth_date: parsedDate,
      country_code,
      bio,
      avatar_url: avatarUpload.cdnUrl,
    });

    await newPerson.save();

    const populatedPerson = await People.findById(newPerson._id).populate(
      "country_code",
    );

    return res.status(201).json({
      message: "Person created successfully",
      data: populatedPerson,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updatePeople = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Person ID is required" });
    }

    const person = await People.findById(id);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const { full_name, birth_date, country_code, bio, slug } = req.body;

    const updateData = {};

    if (full_name) {
      updateData.full_name = full_name;
      updateData.slug = slug || generateSlug(full_name);
    } else if (slug) {
      updateData.slug = slug;
    }

    if (birth_date) {
      let parsedDate;
      if (birth_date.includes("/")) {
        const [day, month, year] = birth_date.split("/");
        parsedDate = new Date(`${year}-${month}-${day}`);
      } else if (birth_date.includes("-")) {
        parsedDate = new Date(birth_date);
      } else {
        return res.status(400).json({
          message: "Invalid birth_date format. Use YYYY-MM-DD or DD/MM/YYYY",
        });
      }

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid birth_date value",
        });
      }

      updateData.birth_date = parsedDate;
    }

    if (country_code) updateData.country_code = country_code;
    if (bio) updateData.bio = bio;

    if (updateData.slug && updateData.slug !== person.slug) {
      const existingSlug = await People.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingSlug) {
        return res.status(409).json({ message: "Slug already exists" });
      }
    }

    if (req.file) {
      if (person.avatar_url) {
        const oldFilePath = person.avatar_url.split(".b-cdn.net/")[1];
        if (oldFilePath) {
          await deleteFromBunny(oldFilePath).catch((err) =>
            console.log("Delete old avatar error:", err.message),
          );
        }
      }

      const avatarUpload = await uploadToBunny(
        req.file.buffer,
        req.file.originalname,
        "people/avatars",
      );

      if (!avatarUpload.success) {
        return res.status(500).json({ message: "Failed to upload avatar" });
      }

      updateData.avatar_url = avatarUpload.cdnUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedPerson = await People.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("country_code");

    return res.status(200).json({
      message: "Person updated successfully",
      data: updatedPerson,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deletePeople = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Person ID is required" });
    }

    const person = await People.findById(id);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    if (person.avatar_url) {
      const filePath = person.avatar_url.split(".b-cdn.net/")[1];
      if (filePath) {
        await deleteFromBunny(filePath).catch((err) =>
          console.log("Delete avatar error:", err.message),
        );
      }
    }

    const deletedPerson = await People.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Person deleted successfully",
      data: deletedPerson,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllPeople,
  getPersonById,
  getPersonBySlug,
  createPeople,
  updatePeople,
  deletePeople,
};
